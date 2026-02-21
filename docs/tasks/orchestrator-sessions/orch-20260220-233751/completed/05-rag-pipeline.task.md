## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | ai-sdk | `~/.gemini/antigravity/skills/ai-sdk/SKILL.md` | Provides exact patterns for `embedMany` and vector pipelines |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Implement the Retrieval-Augmented Generation (RAG) backend engine. This entails processing raw document text into vectorized chunks and securely storing them in the Neon Postgres database.

## Scope
- Create a `knowledge.service.ts` file in the back-end architecture.
- Integrate LangChain (or alternative) recursive text splitting methodologies to chunk the parsed document data.
- Utilize the Vercel AI SDK (e.g., `embedMany`) to transform textual chunks into vectors using a fast, low-cost embedding model.
- Write the Prisma raw SQL query to insert vectors into Neon using the `pgvector` extension.
- Create a semantic search function, `findSimilarContext(query: string)`, fetching nearest neighbor vectors directly from Neon Postgres.

## Context
See FR-004 in `docs/issues/FR-004.md`. This pipeline is the heart of the learning assistant's academic accuracy. The raw SQL queries are inherently tricky due to Prisma's historically limited abstract support for the specialized `vector` type. Prioritize testing the embedding retrieval logic heavily. 

## Definition of Done
- [x] Raw text can be correctly split into logical chunks with overlap.
- [x] Chunks are assigned vector embeddings via an API layer.
- [x] Vectors are securely inserted into the `DocumentEmbedding` Postgres table.
- [x] The `findSimilarContext` function correctly queries and returns the raw `contentChunk` of the most contextually relevant neighbors to a given string.

## Expected Artifacts
- `lib/knowledge.service.ts`
- Associated testing/validation scripts.
