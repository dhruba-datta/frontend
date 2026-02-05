# Tech Stack

## Mandatory architecture

- Two separate projects:
  1. Frontend app
  2. Backend REST API
- Frontend communicates with backend only via REST APIs

## Frontend

- Next.js (App Router)
- Tailwind CSS
- next/font (Inter)
- Simple UI components (cards, forms, buttons)

## Backend

- Node.js + Express (or Fastify) REST API
- JWT auth (access token) + bcrypt password hashing
- Role-based authorization middleware (Employer, Talent)
- Validation: zod (or yup) minimal

## Database

- Supabase Postgres (database only)
- Use pg (node-postgres) or Prisma
- Do not use Supabase client from frontend for core logic
- Do not use Supabase Auth for core logic (keep auth inside backend for safest compliance)

## AI

- LLM API for:
  - Job Description generation
  - Matching score generation (0-100)
- Use the simplest API you can call quickly (OpenAI or Google AI Studio)

## Tools

- Antigravity for coding speed
- ChatGPT for planning and prompts
- Codex at end for security review

## Explicitly not using

- n8n
- BaaS for core logic
- Mock APIs
- Hardcoded counters
- Complex microservices
