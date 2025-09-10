# 🏀 Tournament Management Database Schema (Single-Elimination)

This document describes the database schema for the **Tournament Management System** with a focus on **single-elimination brackets**.

---

## 📌 Users

- `id` → UUID from Supabase Auth
- `email` → unique email of the user
- `name` → full name of the user
- `role` → one of: `admin`, `organizer`, `coach`, `player`, `guest`
- `created_at` → timestamp of creation

---

## 📌 Organizer Applications

Used when a user applies to become an **organizer**.

- `id`
- `user_id` → references **Users**
- `status` → `pending`, `approved`, `rejected`
- `reason` → optional rejection/approval note
- `created_at`

---

## 📌 Teams

Created and managed by **coaches**.

- `id`
- `name` → team name
- `coach_id` → references **Users** (role = coach)
- `logo_url` → optional team logo
- `created_at`

---

## 📌 Players

Players are linked to **users** and belong to a **team**.

- `id`
- `user_id` → references **Users** (role = player)
- `team_id` → references **Teams**
- `position` → playing role (e.g., guard, forward)
- `jersey_number`
- `created_at`

---

## 📌 Tournaments

Created and managed by **organizers**.

- `id`
- `name`
- `description`
- `organizer_id` → references **Users**
- `start_date`
- `end_date`
- `status` → `upcoming`, `ongoing`, `finished`
- `created_at`

---

## 📌 Tournament Teams (Registration)

Mapping table that registers teams into tournaments.

- `id`
- `tournament_id` → references **Tournaments**
- `team_id` → references **Teams**
- `created_at`

---

## 📌 Games (with Bracket Support)

Represents matches in the tournament. Supports **single-elimination brackets**.

- `id`
- `tournament_id` → references **Tournaments**
- `round_number` → integer (1 = quarterfinals, 2 = semifinals, 3 = final, etc.)
- `game_order` → order of the game within the round (for bracket rendering)
- `team1_id` → references **Teams**
- `team2_id` → references **Teams**
- `winner_id` → references **Teams** (nullable until game is finished)
- `next_game_id` → references **Games** (nullable, points to the next round’s game)
- `status` → `scheduled`, `live`, `finished`
- `scheduled_at` → timestamp of scheduled game time
- `created_at`

---

## 📌 Player Stats

Performance of players in each game.

- `id`
- `game_id` → references **Games**
- `player_id` → references **Players**
- `points`
- `rebounds`
- `assists`
- `fouls`
- `created_at`

---

## 🔗 Relationships Overview

- A **User** can be an **admin**, **organizer**, **coach**, **player**, or **guest**.
- An **Organizer** creates **Tournaments**.
- A **Coach** creates and manages **Teams**.
- A **Player** belongs to a **Team**.
- A **Team** can register for multiple **Tournaments**.
- A **Tournament** consists of multiple **Games**, grouped by `round_number`.
- Each **Game** can point to a **next_game_id**, allowing winners to advance in the bracket.
- A **Game** contains many **Player Stats**.
- A **Player** accumulates stats across many **Games**.

---

✅ This schema supports **single-elimination tournaments** and allows rendering a bracket structure like typical knockout competitions.
