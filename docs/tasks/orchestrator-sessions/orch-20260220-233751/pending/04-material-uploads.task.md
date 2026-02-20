## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | nextjs-standards | `~/.gemini/antigravity/skills/nextjs-standards/SKILL.md` | Handling Node-compatible packages in server actions |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Build the document upload flow, allowing students to submit their materials to the internal database for processing. 

## Scope
- Construct a dedicated UI specifically for uploading documents (`.txt`, `.pdf`).
- Implement the Next.js Server Action that receives and validates the `FormData`.
- For PDF processing, integrate a compatible library (`pdf-parse` or similar) to extract raw text seamlessly within the Node runtime.
- Save the `Document` metadata and associated text to the Prisma database.

## Context
See FR-003 in `docs/issues/FR-003.md`. This task focuses simply on the ingest point. The uploaded raw text will be handed off to the RAG pipeline later. It is vital to ensure proper file size and type validation at this step to prevent downstream crashes.

## Definition of Done
- [ ] Upload UI form is built and visually aligned with the design system.
- [ ] A Server Action cleanly receives the file.
- [ ] Raw text is extracted from a `.pdf` file.
- [ ] The Prisma `Document` record is successfully created in the Postgres database.

## Expected Artifacts
- `components/FileUploader.tsx` (or similar)
- `app/actions/uploadMaterial.ts`
