'use server'

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { PDFParse } from "pdf-parse";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMaterial(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { error: "Unauthorized" };
        }

        const file = formData.get("file") as File;
        if (!file) {
            return { error: "No file provided" };
        }

        if (file.size > MAX_FILE_SIZE) {
            return { error: "File size exceeds 10MB limit" };
        }

        let rawText = "";

        if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
            try {
                const data = await parser.getText();
                rawText = data.text;
            } finally {
                await parser.destroy();
            }
        } else if (file.type === "text/plain") {
            rawText = await file.text();
        } else {
            return { error: "Unsupported file type. Please upload .pdf or .txt" };
        }

        const doc = await db.document.create({
            data: {
                title: file.name,
                content: rawText,
                userId: session.user.id,
            },
        });

        revalidatePath('/dashboard/library');
        return { success: true, docId: doc.id };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to process upload. Please try again." };
    }
}
