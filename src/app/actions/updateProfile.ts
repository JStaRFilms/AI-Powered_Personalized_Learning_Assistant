'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return { error: "Unauthorized" };
        }

        const name = formData.get("name") as string;

        if (!name || name.trim().length === 0) {
            return { error: "Name cannot be empty" };
        }

        await db.user.update({
            where: { id: session.user.id },
            data: { name: name.trim() },
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Failed to update profile. Please try again." };
    }
}
