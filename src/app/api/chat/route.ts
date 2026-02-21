import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { findSimilarContext } from "@/lib/knowledge.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages, conversationId } = await req.json();

        // Extract the latest query to find context
        const latestMessage = messages[messages.length - 1].content;

        // Perform RAG Pipeline -> retrieve chunks from Neon Postgres
        const contextChunks = await findSimilarContext(latestMessage);
        const contextString = contextChunks.join("\n\n");

        const systemPrompt = `You are a helpful, adaptive academic AI tutor.
Answer the student's question strictly using the provided context. If the answer cannot be deduced from the context, gently say "I don't know based on your materials."

CONTEXT:
${contextString}`;

        const result = streamText({
            model: openrouter("openai/gpt-4o"), // User configurable, hardcoded to standard capable model
            system: systemPrompt,
            messages,
            async onFinish({ text }) {
                if (conversationId) {
                    // Save conversation to database
                    // Filter messages to find a title from the first sequence
                    const userMessage = messages.find((m: any) => m.role === 'user')?.content;
                    const title = userMessage ? userMessage.substring(0, 50).trim() : "Tutor Session";

                    // The newest messages array
                    const updatedMessages = [...messages, { role: "assistant", content: text }];

                    await db.conversation.upsert({
                        where: { id: conversationId },
                        update: {
                            messages: updatedMessages,
                            updatedAt: new Date(),
                        },
                        create: {
                            id: conversationId,
                            userId: session.user.id,
                            title,
                            messages: updatedMessages,
                        },
                    });
                }
            },
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
