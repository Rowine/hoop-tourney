# 🏀 Agile Development Plan – Tournament Management System

## 🎯 Project Vision

Build a **tournament management web app** where:

- **Admins** control the system and approve organizers.
- **Organizers** create/manage tournaments, schedule games, and record stats.
- **Coaches** manage teams and players.
- **Players** track their own stats.
- **Guests** view games, scores, and tournaments live.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router, Server Components)
- **Language**: TypeScript
- **UI**: shadcn/ui
- **Data Fetching**: TanStack Query
- **State Management**: Zustand
- **Validation**: Zod
- **Backend**: Supabase (Database, Auth, Realtime, Edge Functions)
- **Deployment**: Vercel
- **Package Manager**: pnpm

---

## 🏗 Architecture Overview

- **Frontend**

  - Next.js renders UI with server components.
  - TanStack Query for caching & data fetching.
  - Zustand for lightweight client-side state.

- **Backend**

  - Supabase provides authentication, database, and realtime updates.
  - Edge Functions for heavy or sensitive operations.
  - Row Level Security (RLS) ensures strict role-based access.

- **Deployment**
  - Hosted on Vercel.
  - CI/CD pipeline runs linting, tests, and build checks before deploy.

---

## 🗃 Database Schema (Initial)

- **users** → roles: guest, player, coach, organizer, admin
- **teams** → linked to coaches and players
- **players** → linked to teams
- **tournaments** → created by organizers
- **games** → linked to tournaments and teams
- **stats** → game + player performance

✅ All tables must enforce **RLS policies**.  
✅ Every query validated with **Zod** before execution.

---

## 📂 Folder Structure

src/
├─ app/ # Next.js routes
│ ├─ (auth)/ # Auth flows
│ ├─ dashboard/ # Protected routes
│ ├─ api/ # Server actions / API endpoints
│ └─ layout.tsx
│
├─ components/ # Reusable UI components
│ ├─ forms/
│ ├─ layout/
│ └─ ui/ # shadcn/ui wrappers
│
├─ features/ # Feature-based modules
│ ├─ auth/
│ ├─ profile/
│ └─ tournaments/
│
├─ lib/ # Utilities & services
│ ├─ supabase.ts
│ ├─ auth.ts
│ └─ validators.ts
│
├─ hooks/ # React hooks
│ └─ useUser.ts
│
├─ stores/ # Zustand stores
│ └─ userStore.ts
│
├─ types/ # Shared types
│ ├─ supabase.ts # Generated types
│ └─ user.ts

---

## 📦 Epics & User Stories

### 1. Authentication & Roles

- As a **guest**, I want to sign up as a player, coach, or apply as an organizer.
- As an **admin**, I want to approve/reject organizer applications.
- As a **user**, I want to log in securely and see only the features for my role.

### 2. Teams & Players

- As a **coach**, I want to create/manage a team.
- As a **coach**, I want to add/remove players to my team.
- As a **player**, I want to view my stats.
- As a **guest**, I want to browse teams and view players stats.

### 3. Tournaments & Games

- As an **organizer**, I want to create/manage tournaments.
- As an **organizer**, I want to register teams into tournaments.
- As an **organizer**, I want to schedule games.
- As a **guest**, I want to view tournaments and games.

### 4. Live Scores & Stats

- As an **organizer**, I want to record game results and player stats.
- As an **organizer**, I want to have control on the scoreboard.
- As a **guest**, I want to see live updates of scores.
- As a **player**, I want to view my game performance.

### 5. Admin Dashboard

- As an **admin**, I want to see all users, teams, tournaments, and games.
- As an **admin**, I want to manage roles.

---

## 🗓 Sprint Schedule (8 Weeks, 4 Sprints)

### Sprint 1 (Weeks 1–2): Foundation

- Set up Next.js, shadcn/ui, Zustand, TanStack Query, and Supabase.
- Define database schema (users, teams, tournaments, games, stats).
- Implement Supabase Auth & RLS policies.
- Basic login/signup UI.
- **Deliverable:** Role-based authentication working.

### Sprint 2 (Weeks 3–4): Teams & Players

- Coach can create/manage teams.
- Coach can add/remove players.
- Players linked to teams.
- Guests can browse teams & players.
- **Deliverable:** Team & player management live.

### Sprint 3 (Weeks 5–6): Tournaments & Games

- Organizer can create/manage tournaments.
- Organizer can register teams.
- Organizer can schedule games.
- Guests can view tournament brackets/schedules.
- **Deliverable:** Tournament & scheduling live.

### Sprint 4 (Weeks 7–8): Live Scores & Stats

- Organizers record scores & stats.
- Supabase Realtime → live updates for guests.
- Players see personal stats dashboard.
- Admin Dashboard launched.
- **Deliverable:** MVP Tournament Management System finished.

---
