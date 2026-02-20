## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | nextjs-standards | `~/.gemini/antigravity/skills/nextjs-standards/SKILL.md` | Next.js architecture and middleware |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Implement robust authentication and session management using `better-auth`. Map the authentication layer to the Neon database via Prisma.

## Scope
- Install `better-auth`.
- Configure `lib/auth.ts` for the server/client `better-auth` instances.
- Set up the Prisma Postgres adapter for User session mapping.
- Scaffold Next.js Middleware to protect specific routes (`/dashboard`, `/chat`).
- Create basic functional Login/SignUp forms styled dynamically and placed in the project directory.

## Context
See FR-001 in `docs/issues/FR-001.md`. This is required before any user-specific data (like uploaded documents or topic mastery strings) can be tracked properly. Security and session cookie handling are paramount. Neon uses standard PostgreSQL connectors for Prisma.

## Definition of Done
- [ ] Authentication works via Email/Password.
- [ ] The Prisma schema incorporates the necessary tables required by `better-auth`.
- [ ] Users can successfully log in, register, and sign out, resulting in a database session record.
- [ ] Middleware correctly routes unauthenticated users away from protected areas.

## Expected Artifacts
- `lib/auth.ts`
- `middleware.ts`
- Client authentication components.
