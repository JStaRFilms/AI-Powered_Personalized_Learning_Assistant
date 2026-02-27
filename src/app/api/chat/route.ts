import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { findSimilarContext } from "@/lib/knowledge.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkAndIncrementApiLimit, updateTokenUsage, RateLimitError, TokenLimitError } from "@/lib/usage.service";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { messages, conversationId, modelId, preferences, documentId } = await req.json();

        // Use selected model or default
        const selectedModel = modelId || "google/gemini-2.5-flash";

        // Validate Usage Limits
        try {
            await checkAndIncrementApiLimit(session.user.id);
        } catch (error) {
            if (error instanceof RateLimitError || error instanceof TokenLimitError) {
                return new NextResponse(error.message, { status: 429 });
            }
            throw error; // Re-throw unknown errors
        }

        // Extract the latest query to find context
        const lastMsg = messages[messages.length - 1];
        const latestQuery = lastMsg.content || lastMsg.parts?.find((p: any) => p.type === 'text')?.text || "";

        // Perform RAG Pipeline -> retrieve chunks from Neon Postgres
        // If a specific documentId is selected, filter to just that document
        const contextChunks = await findSimilarContext(latestQuery, session.user.id, 5, documentId);

        // Format the context string to include the source document title for each chunk
        const contextString = contextChunks.map(chunk => `[Source Document: ${chunk.source}]\n${chunk.content}`).join("\n\n---\n\n");

        // Read user preferences (from Settings page toggles)
        const socraticMode = preferences?.socraticMode ?? true;
        const strictCurriculumMode = preferences?.strictCurriculumMode ?? true;

        // Determine student's experience level from usage history
        const usage = await db.userUsage.findUnique({
            where: { userId: session.user.id },
            select: { apiCallsCount: true },
        });
        const questionsAsked = usage?.apiCallsCount ?? 0;
        let experienceLevel: 'new' | 'intermediate' | 'experienced' = 'new';
        if (questionsAsked > 50) experienceLevel = 'experienced';
        else if (questionsAsked > 10) experienceLevel = 'intermediate';

        // Build adaptive system prompt
        let systemPrompt = `You are Lumina, a helpful and adaptive academic AI tutor.\n`;

        // Formatting instructions
        systemPrompt += `\n## FORMATTING RULES (VERY IMPORTANT)\n`;
        systemPrompt += `- Write in a clear, conversational tone like a friendly tutor explaining to a student face-to-face.\n`;
        systemPrompt += `- Use SHORT paragraphs (2-3 sentences max per paragraph). Leave blank lines between paragraphs for breathing room.\n`;
        systemPrompt += `- NEVER write walls of text. Break up your response into digestible sections.\n`;
        systemPrompt += `- Use **bold** for key terms and concepts when first introducing them.\n`;
        systemPrompt += `- Use analogies and real-world examples to make concepts click.\n`;
        systemPrompt += `- Use bullet points sparingly — only for lists of 3+ related items.\n`;
        systemPrompt += `- Use headings (##) only when covering multiple distinct sub-topics in one response.\n`;
        systemPrompt += `- End every response with a source reference placard in this exact format, citing the specific document(s) you used from the context:\n`;
        systemPrompt += `---\n📚 *Source: [Insert Document Title Here]*\n`;
        systemPrompt += `If the context was empty or you relied entirely on general knowledge, instead write:\n`;
        systemPrompt += `---\n📚 *Source: General knowledge (no matching content found in your uploads)*\n\n`;

        // Curriculum strictness
        if (strictCurriculumMode) {
            systemPrompt += `Answer the student's question strictly using the provided context from their uploaded curriculum materials. If the answer cannot be deduced from the context, gently say "I don't have enough information in your uploaded materials to answer that. Try uploading more relevant notes or textbooks."\n`;
        } else {
            systemPrompt += `Primarily use the provided context to answer. If the context doesn't fully cover the topic, you may supplement with general knowledge, but clearly indicate when you are going beyond the uploaded materials.\n`;
        }

        // Socratic method
        if (socraticMode) {
            systemPrompt += `Use the Socratic method: guide the student toward understanding by asking leading questions rather than directly revealing full answers. Help them think through problems step by step. After explaining a concept, ask a follow-up question to check their understanding.\n`;
        }

        // Adaptive complexity based on experience level
        if (experienceLevel === 'new') {
            systemPrompt += `This student is relatively new (${questionsAsked} questions asked so far). Use simpler language, break down concepts into small steps, include concrete examples, and be encouraging to build their confidence.\n`;
        } else if (experienceLevel === 'intermediate') {
            systemPrompt += `This student has moderate experience (${questionsAsked} questions asked). Balance clarity with depth — you can introduce some technical terms but ensure you explain them.\n`;
        } else {
            systemPrompt += `This student is experienced (${questionsAsked} questions asked). You can use technical vocabulary freely and provide deeper, more nuanced explanations. Be concise unless they explicitly ask for elaboration.\n`;
        }

        systemPrompt += `\nCONTEXT FROM UPLOADED CURRICULUM:\n${contextString || "(No relevant context found in uploaded materials)"}`;

        // Map client messages to CoreMessage format for prompt validation
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content || m.parts?.find((p: any) => p.type === 'text')?.text || ""
        }));

        const result = streamText({
            model: openrouter(selectedModel),
            system: systemPrompt,
            messages: coreMessages,
            // @ts-ignore - maxTokens is supported but linting may fail due to provider type inference
            maxTokens: 4096,
            async onFinish({ text, usage }) {
                // Update tokens used based on the response
                if (usage) {
                    const typedUsage = usage as any;
                    const input = typedUsage.inputTokens ?? 0;
                    const output = typedUsage.outputTokens ?? 0;
                    const totalTokens = input + output;
                    if (totalTokens > 0) {
                        await updateTokenUsage(session.user.id, totalTokens).catch(console.error);
                    }
                }

                if (conversationId) {
                    // Save conversation to database
                    // Filter messages to find a title from the first sequence
                    const userMsg = messages.find((m: any) => m.role === 'user');
                    const userContent = userMsg?.content || userMsg?.parts?.find((p: any) => p.type === 'text')?.text || "";
                    const title = userContent ? userContent.substring(0, 50).trim() : "Tutor Session";

                    // The newest messages array (v6 format)
                    const updatedMessages = [
                        ...messages,
                        { role: "assistant", parts: [{ type: "text", text }] }
                    ];

                    await db.conversation.upsert({
                        where: { id: conversationId },
                        update: {
                            messages: updatedMessages as any,
                            updatedAt: new Date(),
                        },
                        create: {
                            id: conversationId,
                            userId: session.user.id,
                            title,
                            messages: updatedMessages as any,
                        },
                    }).catch(console.error);
                }
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
