## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | ai-sdk | `~/.gemini/antigravity/skills/ai-sdk/SKILL.md` | Core implementation details for `useChat` and streaming |
> | ui-ux-pro-max | `~/.gemini/antigravity/skills/ui-ux-pro-max/SKILL.md` | Ensures the responsive ChatGPT-like styling is premium |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Implement the responsive AI Chat frontend interface and the core Next.js backend Route Handler orchestrating the semantic retrieval and OpenRouter LLM stream.

## Scope
- Create a `ChatInterface` client component with `useChat` (`@ai-sdk/react`).
- Build `app/api/chat/route.ts` leveraging the Vercel AI SDK.
- The route handler MUST extract the latest user message, query the Neon `pgvector` database (via `knowledge.service.ts` from FR-004), and dynamically construct the system prompt.
- The system prompt defines the "Tutor Persona" to ensure it relies absolutely on the loaded curriculum context (no hallucinations).
- Link the UI's messages specifically to the user session, saving conversations to the Prisma database.

## Context
See FR-005 in `docs/issues/FR-005.md`. The RAG backend must be operational prior to executing this completely. OpenRouter serves as the gateway to the LLM; the `@openrouter/ai-sdk-provider` must be configured correctly so the student has choice over which model effectively runs their localized tutor.

## Definition of Done
- [ ] Responsive `ChatInterface` operates beautifully on web/mobile.
- [ ] Route handler streams AI text effectively back to the UI.
- [ ] Responses are strictly grounded in user-provided materials via RAG context injection.
- [ ] Past chat sessions for the active user are retrievable and stored in the PostgreSQL database.

## Expected Artifacts
- `components/ChatInterface.tsx`
- `app/api/chat/route.ts`
