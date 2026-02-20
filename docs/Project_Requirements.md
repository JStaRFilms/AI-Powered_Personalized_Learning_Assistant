# Project Requirements Document

## Project Overview

**Name:** AI-Powered Personalized Learning Assistant
**Mission:** An adaptive, intelligent tutor that answers student questions, simplifies complex academic concepts, and adjusts its teaching style based on individual user performance using only uploaded curriculum.
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Neon (PostgreSQL + pgvector), Prisma ORM, OpenRouter, Vercel AI SDK, better-auth.

## Functional Requirements

| FR ID | Description | User Story | Status |
| :--- | :--- | :--- | :--- |
| FR-001 | Authentication & User Sessions | As a student, I want to securely log in and out so my learning history is saved. | MUS |
| FR-002 | Dashboard & Progress Overview | As a student, I want to see my topic mastery and recent activity so I know where I stand. | MUS |
| FR-003 | Curriculum Material Uploads | As a student, I want to upload PDFs and notes so the AI can learn from my specific course materials. | MUS |
| FR-004 | RAG Document Processing Pipeline | As the system, I need to extract text from uploads, chunk it, and store vector embeddings so the AI can retrieve context. | MUS |
| FR-005 | Adaptive AI Chat Interface | As a student, I want to chat with an AI tutor that answers my questions based on my uploaded materials and adjusts to my current mastery level. | MUS |
| FR-006 | Topic Mastery Tracking Engine | As the system, I need to evaluate the student's understanding during chat and update their mastery profile to personalize future responses. | Future |
| FR-007 | Advanced Analytics | As a teacher/student, I want detailed graphs of my learning progress over time. | Future |
