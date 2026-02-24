# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Physio-Track** — PWA for physiotherapy workout tracking and nutrition management, designed around ACL (LCA) rehabilitation. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, and Supabase.

## Running Locally

```bash
npm install
npm run dev
# Navigate to http://localhost:3000
```

Requires `.env.local` with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Architecture

**Next.js App Router** with server and client components, Supabase for auth/database, Zustand for client state.

### Route Structure
- `src/app/(auth)/` — Login, register, password reset (public routes)
- `src/app/(patient)/` — Patient routes: dashboard, workout, history, nutrition, settings
- `src/app/physio/` — Physio routes: dashboard, exercises, plans, invite codes
- `src/middleware.ts` — Auth guard + role-based routing (patient vs physio)

### Key Directories
- `src/components/ui/` — shadcn/ui components
- `src/components/workout/` — Workout player, timer, exercise display, pain feedback
- `src/components/nutrition/` — Calorie ring, macro bar, meal sections
- `src/components/layout/` — Bottom nav (patient), sidebar (physio), header
- `src/lib/supabase/` — Server and client Supabase clients
- `src/lib/stores/` — Zustand stores (workout state with 6h persistence)
- `src/lib/hooks/` — Timer, audio cues, wake lock
- `src/types/` — TypeScript types (database, workout, nutrition)
- `supabase/migrations/` — Database schema + seed data

### Database Tables
- `profiles` — Users with role (patient/physio) and physio_id link
- `exercises` — Exercise library (global seed + physio-created)
- `workout_plans` / `plan_items` — Workout programs with exercises
- `workout_logs` — Completed sessions with pain feedback
- `recipes` — 130+ recipes with macros, ingredients, steps
- `nutrition_logs` — Daily meal tracking
- `calorie_budgets` — Per-patient calorie targets
- `invite_codes` — Patient-physio linking system

## Domain Constraints (Critical)

### Rehabilitation Rules
- **Physiotherapy exercises are IMMUTABLE** — they are medical prescriptions. Never change order, sets, reps, or loads for seed exercises in the database.
- **Bike duration is fixed** (300s / 5 minutes for rehab workouts).
- **Avoid**: jumps, plyometrics, loaded rotations, sprints.
- All seed exercises are from an ACL rehabilitation program.

### Nutrition Restrictions
- NO bananas, NO deli meats (affettati), NO artichokes (carciofi).
- Legumes only as hummus.
- Calorie targets: ~1900 kcal (rest day), ~2100 kcal (workout day).

## Tech Stack

- **Framework**: Next.js 16.1.6, React 19.2.3, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui (new-york style), Lucide icons
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State**: Zustand 5 with localStorage persistence
- **Forms**: React Hook Form + Zod validation
- **PWA**: Service worker, web manifest, installable

## Conventions

- **Language**: Italian for all UI text
- **Path alias**: `@/*` maps to `src/*`
- **Components**: shadcn/ui for all UI primitives
- **Auth pattern**: Server components use `createClient()` from `@/lib/supabase/server`, client components from `@/lib/supabase/client`
- **Colors**: Medical blue (primary), sage green (secondary), pain scale (red/amber/green)
