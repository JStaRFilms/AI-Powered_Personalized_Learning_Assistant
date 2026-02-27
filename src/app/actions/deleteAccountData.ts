'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteAccountData() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Delete in order: embeddings → documents → conversations → usage
        // Embeddings are cascade-deleted when documents are deleted (via Prisma relations)
        await db.document.deleteMany({
            where: { userId },
        });

        await db.conversation.deleteMany({
            where: { userId },
        });

        await db.userUsage.deleteMany({
            where: { userId },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/library');
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error("Account data deletion error:", error);
        return { error: "Failed to delete account data. Please try again." };
    }
}
