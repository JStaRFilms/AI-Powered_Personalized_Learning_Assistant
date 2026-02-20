## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
> Load: `cat .agent/workflows/vibe-build.md`

### Prime Agent Context
> MANDATORY: Run `/vibe-primeAgent` first

### Required Skills
> | Skill | Path | Why |
> |-------|------|-----|
> | ui-ux-pro-max | `~/.gemini/antigravity/skills/ui-ux-pro-max/SKILL.md` | Provides high-fidelity UI design patterns |

### Check Additional Skills
> Scan all known skills directories for more relevant skills

---

## Objective
Establish the foundational responsive Dashboard layout where a user can view their tracked progress and interact with features. 

## Scope
- Create an overall application layout shell (header, sidebar/nav, main content area) for authenticated users.
- Build the Dashboard overview page (`app/dashboard/page.tsx`).
- Fetch the user session and display personalized information (e.g. name, simulated mastery metrics) using Prisma.
- Implement clear call-to-action sections for uploading materials and accessing the chat UI.

## Context
See FR-002 in `docs/issues/FR-002.md`. The design should prioritize visual excellence—do not settle for generic layout shells. It must feel premium and interactive while remaining fully responsive for web.

## Definition of Done
- [ ] Authenticated application layout shell is built and functional.
- [ ] Dashboard route successfully retrieves session and basic mock/real metrics from the Postgres DB.
- [ ] The dashboard offers obvious entry points into the student's workflow (uploading & chatting).

## Expected Artifacts
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- UI component files adhering to `ui-ux-pro-max` guidelines.
