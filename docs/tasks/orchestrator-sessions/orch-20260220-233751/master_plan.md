# Orchestrator Master Plan

## Overview
This session covers the initial build phase for the AI-Powered Personalized Learning Assistant MVP. We are converting the Functional Requirements (FR) created during the Genesis phase into specific builder tasks. 

## Skills Registry
| Skill | Path | Description / Applicability |
|---|---|---|
| `nextjs-standards` | `.gemini/antigravity/skills/nextjs-standards` | Core guidelines for App Router, Tailwind, and structure. Used for **every** task. |
| `ui-ux-pro-max` | `.gemini/antigravity/skills/ui-ux-pro-max` | High-fidelity design system and styling standards for the Web UI. |
| `ai-sdk` | `.gemini/antigravity/skills/ai-sdk` | Best practices for the Vercel AI SDK, `useChat`, streaming, and OpenRouter integration. |

## Workflows Registry
| Workflow | Description |
|---|---|
| `/vibe-build` | The core scaffolding and implementation workflow. Needs verification gates. |
| `/vibe-primeAgent` | To be run at the start of every task to load the project's Coding Guidelines. |

## Task Decomposition

| # | Task | Mode | Workflow | Skills | Focus |
|---|---|---|---|---|---|
| 01 | Scaffolding & Database Setup | `vibe-code` | `/vibe-build` | `nextjs-standards` | Init App Router, Prisma ORM, Neon Postgres hookup, and Tailwind CSS. |
| 02 | Authentication (FR-001) | `vibe-code` | `/vibe-build` | `nextjs-standards` | Install and configure `better-auth` using Prisma adapter. Protect routes. |
| 03 | Dashboard UI (FR-002) | `vibe-code` | `/vibe-build` | `ui-ux-pro-max` | Build the core layout shell and the overview page pulling recent data. |
| 04 | Material Uploads (FR-003) | `vibe-code` | `/vibe-build` | `nextjs-standards` | Form upload, Server Actions, PDF parsing via Node backend. |
| 05 | RAG Pipeline (FR-004) | `vibe-code` | `/vibe-build` | `ai-sdk` | Text chunking, embedding generation, and `pgvector` raw insertion. |
| 06 | AI Chat Engine (FR-005) | `vibe-code` | `/vibe-build` | `ai-sdk`, `ui-ux-pro-max` | Build the `useChat` frontend and the OpenRouter/Retrieval route handler. |

## Execution DAG
```
01 Setup ──► 02 Auth ──► 03 Dashboard (UI shell)
                             │
                             ├──► 04 Uploads ──► 05 RAG Pipeline
                             │
                             └──► 06 Chat Engine (depends on 05 for context)
```
