# Blueprint: AI-Powered Personalized Learning Assistant

## 1. Goal
Establish the foundational Next.js architecture for the AI-Powered Personalized Learning Assistant. The system will enable students to upload curriculum materials, interact with an AI tutor aware of their mastery level, and receive tailored, strictly curriculum-grounded responses. The focus is exclusively on a premium, mobile-responsive Web UI.

## 2. Tech Stack Choices
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (responsive Web UI)
- **Database:** Neon (Serverless Postgres) + Prisma ORM
- **LLM Access:** OpenRouter (ideal for model flexibility, e.g., using GPT-4o, Claude 3.5, or open-weight models)
- **AI/RAG Core:** Vercel AI SDK + LangChain (or LlamaIndex) for chunking and vectorization
- **Vector Storage:** Postgres with `pgvector` extension (hosted directly on Neon)
- **Validation:** Zod

## 3. Core Components (Data Flow & Architecture)

### 3.1 Client Features (`src/features/*`)
Following the Feature-Sliced Design pattern:
- **`Auth`:** Sign-in and session management.
- **`Dashboard`:** Overview of student progress conceptually.
- **`Chat`:** The primary interaction point. A ChatGPT-like UI featuring streaming responses powered by Vercel AI SDK (`useChat`).
- **`Materials`:** File upload interface for course materials (PDFs, notes), which triggers background vectorization.

### 3.2 Server Logic (`src/services/*`)
All core business logic will be isolated in specific services to keep Next.js Route Handlers thin:
- **`rag.service.ts`:** Handles querying the `pgvector` database for semantic similarity.
- **`llm.service.ts`:** Calls OpenRouter. Responsibilities include system prompt construction (enforcing the "tutor persona"), dynamically injecting the student's mastery level, and feeding retrieved context to the LLM.
- **`knowledge.service.ts`:** Manages the pipeline of taking a raw uploaded document, chunking it, creating vector embeddings, and storing them.

## 4. Database Schema (Prisma Overview)
- **`User`:** `id`, `email`, `name`, `role`
- **`TopicMastery`:** `id`, `userId`, `topicId`, `masteryLevel` (e.g., beginner, intermediate, advanced)
- **`Document`:** `id`, `title`, `content` (raw reference)
- **`DocumentEmbedding`:** `id`, `documentId`, `contentChunk`, `embedding` (Unsupported type `vector` mapped in Prisma)
- **`Conversation` & `Message`:** `id`, `userId`, `role` (user/assistant), `content`

## 5. Next Steps for the Orchestrator
Once this Blueprint is approved, the Orchestrator will slice this into specific task files (e.g. `01-scaffold-db.task.md`, `02-rag-pipeline.task.md`, `03-chat-ui.task.md`) and deploy specialized sub-agents with the required skills (`nextjs-standards`, `ai-sdk`) and workflows to execute them in parallel sequentially.
