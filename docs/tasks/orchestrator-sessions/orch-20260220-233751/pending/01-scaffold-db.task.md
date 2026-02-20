## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | nextjs-standards | `~/.gemini/antigravity/skills/nextjs-standards/SKILL.md` | Core framework architecture & App Router paradigms |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Initialize the Next.js App Router codebase, establish the Tailwind CSS design system shell, and configure Prisma ORM hooked up to the Neon serverless PostgreSQL database.

## Scope
- `npx create-next-app@latest` (TypeScript, Tailwind, ESLint, App Router).
- Initialize Prisma `npx prisma init`.
- Update `prisma/schema.prisma` with the base models (`User`, `Document`, `Conversation`) as outlined in the Core Architecture blueprint.
- Set up the `.env` file structure (Neon `DATABASE_URL`).

## Context
This is the foundational setup for the AI-Powered Personalized Learning Assistant. The project relies on Neon for database operations, meaning Prisma must be configured to work with PostgreSQL, and we will eventually need `pgvector` support. The application is purely a responsive web app.

## Definition of Done
- [ ] Next.js app compiles and runs cleanly on `localhost:3000`.
- [ ] Database schema is defined in `prisma/schema.prisma`.
- [ ] Prisma client is generated (`npx prisma generate`).
- [ ] Basic Tailwind `globals.css` structure is established without generic colors.

## Expected Artifacts
- The initialized code repository.
- A functional `prisma/schema.prisma` file.
