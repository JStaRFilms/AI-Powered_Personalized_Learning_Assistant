import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { db } from "@/lib/db";
import crypto from "crypto";

const EMBED_MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2:free";
const EMBED_API = "https://openrouter.ai/api/v1/embeddings";
const BATCH_SIZE = 50; // OpenRouter is generous, but keep batches manageable

/**
 * Call OpenRouter's OpenAI-compatible embedding endpoint.
 * Returns an array of embedding vectors for the given input texts.
 */
async function getEmbeddings(texts: string[]): Promise<number[][]> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

    const res = await fetch(EMBED_API, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: EMBED_MODEL,
            input: texts,
        }),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Embedding API error (${res.status}): ${errorBody}`);
    }

    const data = await res.json();
    // Sort by index to ensure order matches input order
    const sorted = data.data.sort((a: any, b: any) => a.index - b.index);
    return sorted.map((d: any) => d.embedding);
}

/**
 * Process raw document text into vectorized chunks and store them in Neon Postgres.
 * Uses NVIDIA's free embedding model via OpenRouter.
 */
export async function processDocumentForRAG(documentId: string, rawText: string) {
    if (!rawText || rawText.trim().length === 0) {
        throw new Error("Document text is empty");
    }

    console.log(`[RAG] Starting embedding pipeline for document ${documentId} (${rawText.length} chars)`);

    // 1. Chunk the text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([rawText]);
    const chunkTexts = chunks.map(c => c.pageContent);
    console.log(`[RAG] Split into ${chunkTexts.length} chunks`);

    if (chunkTexts.length === 0) {
        return { success: true, chunksCount: 0 };
    }

    // 2. Embed the chunks in batches via OpenRouter (NVIDIA free model)
    const allEmbeddings: number[][] = [];
    const totalBatches = Math.ceil(chunkTexts.length / BATCH_SIZE);
    console.log(`[RAG] Generating embeddings via ${EMBED_MODEL} (${totalBatches} batches)...`);

    for (let i = 0; i < chunkTexts.length; i += BATCH_SIZE) {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const batch = chunkTexts.slice(i, i + BATCH_SIZE);

        const batchEmbeddings = await getEmbeddings(batch);
        allEmbeddings.push(...batchEmbeddings);
        console.log(`[RAG] Batch ${batchNum}/${totalBatches}: embedded ${batch.length} chunks ✓`);

        // Small delay between batches to be respectful of rate limits
        if (i + BATCH_SIZE < chunkTexts.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    console.log(`[RAG] Generated ${allEmbeddings.length} total embeddings (dim=${allEmbeddings[0]?.length})`);

    // 3. Store in Postgres using raw SQL (pgvector)
    let insertedCount = 0;
    for (let i = 0; i < chunks.length; i++) {
        const text = chunkTexts[i];
        const embedding = allEmbeddings[i];

        const vectorString = `[${embedding.join(',')}]`;
        const newId = crypto.randomUUID();

        try {
            await db.$executeRaw`
                INSERT INTO "DocumentEmbedding" ("id", "documentId", "contentChunk", "embedding", "createdAt", "updatedAt")
                VALUES (${newId}, ${documentId}, ${text}, ${vectorString}::vector, NOW(), NOW())
            `;
            insertedCount++;
        } catch (insertErr) {
            console.error(`[RAG] Failed to insert chunk ${i}:`, insertErr);
            throw insertErr;
        }
    }

    console.log(`[RAG] Successfully inserted ${insertedCount}/${chunks.length} embeddings`);
    return { success: true, chunksCount: chunks.length };
}

/**
 * Find the most relevant context chunks for a user's query using vector similarity search.
 * Uses NVIDIA's free embedding model via OpenRouter for the query embedding.
 */
export async function findSimilarContext(query: string, userId: string, limit: number = 5, documentId?: string): Promise<string[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    // 1. Embed the search query
    const [queryEmbedding] = await getEmbeddings([query]);
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // 2. Perform vector similarity search, scoped to the current user's documents
    let nearestNeighbors: Array<{ contentChunk: string; distance: number }>;

    if (documentId) {
        nearestNeighbors = await db.$queryRaw<Array<{ contentChunk: string; distance: number }>>`
            SELECT de."contentChunk", de."embedding" <=> ${vectorString}::vector AS distance
            FROM "DocumentEmbedding" de
            INNER JOIN "Document" d ON de."documentId" = d."id"
            WHERE d."userId" = ${userId} AND de."documentId" = ${documentId}
            ORDER BY distance ASC
            LIMIT ${limit}
        `;
    } else {
        nearestNeighbors = await db.$queryRaw<Array<{ contentChunk: string; distance: number }>>`
            SELECT de."contentChunk", de."embedding" <=> ${vectorString}::vector AS distance
            FROM "DocumentEmbedding" de
            INNER JOIN "Document" d ON de."documentId" = d."id"
            WHERE d."userId" = ${userId}
            ORDER BY distance ASC
            LIMIT ${limit}
        `;
    }

    return nearestNeighbors.map(n => n.contentChunk);
}
