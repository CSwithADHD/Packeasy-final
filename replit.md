# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## PackEasy app

PackEasy is the active product: an Expo (React Native) packing-list app backed by Express + Drizzle + Postgres.

### Backend (`artifacts/api-server`)

Routes are mounted at `/api`. Auth uses scrypt-hashed passwords + Bearer-token sessions stored in DB; `attachUser` middleware reads `Authorization: Bearer <token>` and sets `req.userId`. Route files:

- `routes/auth.ts` — `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `routes/trips.ts` — `GET/POST /trips`, `GET/DELETE /trips/:id`, `POST /trips/:id/seed`,
  `POST /trips/:id/categories`, `POST /trips/:id/tasks`,
  `POST /categories/:id/items`, `PATCH/DELETE /items/:id`, `PATCH /tasks/:id`
- `lib/seed.ts` — default smart-list categories/items used by `POST /trips/:id/seed` and `POST /trips` with `smart: true`

DB schema lives in `lib/db/src/schema/{users,sessions,trips,categories,items,tasks}.ts`. Each table is its own file; the index re-exports them. Use `pnpm --filter @workspace/db run push` after schema changes.

Per-route validation uses plain `zod` (not the codegen pipeline). `@workspace/api-zod` is still used for the existing health route only.

### Mobile (`artifacts/mobile`)

- `lib/auth-storage.ts` — AsyncStorage-backed token + user storage.
- `lib/api.ts` — typed wrapper around `customFetch` from `@workspace/api-client-react` for all PackEasy endpoints.
- `context/AuthContext.tsx` — bootstraps stored token, registers `setBaseUrl(https://$EXPO_PUBLIC_DOMAIN)` and `setAuthTokenGetter`, exposes `signup` / `login` / `logout`.
- `context/TripContext.tsx` — React Query wrapper that exposes the same `useTrips()` interface as before (trips, currentTrip, createTrip, toggleItem, addItem, addCategory, addTask, toggleTask) but every mutation goes through the API and updates the `["trips"]` query cache.
- `app/_layout.tsx` — wraps the tree in `AuthProvider` → `TripProvider`; an `AuthGate` redirects unauthenticated users to `/(auth)/login` whenever they hit `(tabs)`, `new-trip`, or `smart-list`.
- Auth screens (`app/(auth)/login.tsx`, `app/(auth)/signup.tsx`) call `useAuth()` and show inline error messages.
- `app/new-trip.tsx` awaits `createTrip` (without smart) then opens the smart-list modal; `app/smart-list.tsx` calls `seedCurrentTrip()` for "Build My Smart List" and just navigates for "Start from scratch".
- Settings has a "Sign out" row that calls `useAuth().logout()` and redirects to login.

### Strict conventions

- Each screen lives in its own file under `artifacts/mobile/app/`.
- Theme constants stay in `artifacts/mobile/constants/colors.ts` (light theme, teal `#1AA8C4` accent).
