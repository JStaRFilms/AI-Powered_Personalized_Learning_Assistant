import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { db } from "@/lib/db";
import crypto from "crypto";

/**
 * Process raw document text into vectorized chunks and securely store them in the Neon Postgres database.
 * @param documentId The ID of the document record in the database
 * @param rawText The raw text content of the document
 */
export async function processDocumentForRAG(documentId: string, rawText: string) {
    if (!rawText || rawText.trim().length === 0) {
        throw new Error("Document text is empty");
    }

    // 1. Chunk the text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    // createDocuments returns Langchain Document objects
    const chunks = await splitter.createDocuments([rawText]);
    const chunkTexts = chunks.map(c => c.pageContent);

    if (chunkTexts.length === 0) {
        return { success: true, chunksCount: 0 };
    }

    // 2. Embed the chunks
    // Using Vercel AI SDK with OpenAI's text-embedding-3-small (1536 dims)
    const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: chunkTexts,
    });

    // 3. Store in Postgres using raw SQL due to pgvector Prisma limitations
    // We insert chunks sequentially or in a transaction
    for (let i = 0; i < chunks.length; i++) {
        const text = chunkTexts[i];
        const embedding = embeddings[i];

        // Format embedding for pgvector: '[0.1, 0.2, ...]'
        const vectorString = `[${embedding.join(',')}]`;
        const newId = crypto.randomUUID();

        await db.$executeRaw`
            INSERT INTO "DocumentEmbedding" ("id", "documentId", "contentChunk", "embedding", "createdAt", "updatedAt")
            VALUES (${newId}, ${documentId}, ${text}, ${vectorString}::vector, NOW(), NOW())
        `;
    }

    return { success: true, chunksCount: chunks.length };
}

/**
 * Fetch nearest neighbor vectors directly from Neon Postgres.
 * @param query The user's search query
 * @param limit The maximum number of relevant chunks to return
 * @param documentId Optional. Filter by specific document ID
 */
export async function findSimilarContext(query: string, limit: number = 5, documentId?: string): Promise<string[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    // 1. Embed the search query
    const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: [query],
    });

    const queryEmbedding = embeddings[0];
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // 2. Perform vector similarity search using nearest neighbor (cosine distance `<=>`)
    let nearestNeighbors: Array<{ contentChunk: string; distance: number }>;

    if (documentId) {
        nearestNeighbors = await db.$queryRaw<Array<{ contentChunk: string; distance: number }>>`
            SELECT "contentChunk", "embedding" <=> ${vectorString}::vector AS distance
            FROM "DocumentEmbedding"
            WHERE "documentId" = ${documentId}
            ORDER BY distance ASC
            LIMIT ${limit}
        `;
    } else {
        nearestNeighbors = await db.$queryRaw<Array<{ contentChunk: string; distance: number }>>`
            SELECT "contentChunk", "embedding" <=> ${vectorString}::vector AS distance
            FROM "DocumentEmbedding"
            ORDER BY distance ASC
            LIMIT ${limit}
        `;
    }

    // Return the raw content chunks most relevant to the query
    return nearestNeighbors.map(n => n.contentChunk);
}
