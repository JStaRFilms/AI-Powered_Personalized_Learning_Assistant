'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteDocument(documentId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        // Verify the document belongs to this user
        const doc = await db.document.findUnique({
            where: { id: documentId },
            select: { userId: true },
        });

        if (!doc) {
            return { error: "Document not found" };
        }

        if (doc.userId !== session.user.id) {
            return { error: "You don't have permission to delete this document" };
        }

        // Delete the document (embeddings cascade via Prisma relation)
        await db.document.delete({
            where: { id: documentId },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/library');
        return { success: true };
    } catch (error) {
        console.error("Delete document error:", error);
        return { error: "Failed to delete document. Please try again." };
    }
}
