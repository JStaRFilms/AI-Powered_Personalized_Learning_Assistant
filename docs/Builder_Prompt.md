# Builder Prompt: AI-Powered Personalized Learning Assistant

## Core Development Guidelines
You are building the "Lumina AI" Learning Assistant. Follow the strict requirements in `Project_Requirements.md` and use the specified tech stack (Next.js App Router, Tailwind, PostgreSQL, Prisma, AI SDK).

### 1. Mandatory Mockup-Driven Implementation
The `/docs/mockups` folder is the **UNQUESTIONABLE source of truth** for all front-end UI/UX.
You must NOT deviate from the layout, color palette, typography, or component structure defined in the mockups and the `/docs/design/design-system.html`.
Before implementing any page, open the corresponding mockup file and replicate it exactly.

*Design Vibe:* Minimal, Trustworthy, Creative.
*Typography:* Playfair Display (Serif Headings) & Inter (Sans-Serif Body).
*Colors:* Deep teals (Brand) & warm off-whites (Surface) to simulate academic focus without harsh white light.

### 2. File Structure & Scope
- **Features over Pages:** Group logic by feature (e.g., `src/features/curriculum`, `src/features/chat`).
- **Server Components Default:** Use React Server Components wherever possible. Isolate interactivity (like the Chat Input or File Uploader) into specific `'use client'` boundary components.

### 3. Key Functional Constraints
- **Absolute Grounding (RAG):** The AI Tutor must ONLY answer questions using the provided context from the vectorized documents. Do not let the base LLM hallucinate or rely on pre-training data. Provide citations in the UI (as shown in `docs/mockups/tutor.html`).
- **Data Privacy:** Ensure user uploads are scoped securely to their tenant ID/User ID in the database.

Use this document alongside specific feature requirements to build out the application.
