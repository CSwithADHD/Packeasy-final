# PackEasy Project - Quick Start Guide

## Project Overview
PackEasy is a full-stack React Native + Express app for managing travel packing lists.

**Stack:**
- **Frontend**: React Native with Expo, TypeScript
- **Backend**: Express 5, Node.js
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **Package Manager**: pnpm (monorepo)

## Prerequisites
- ✅ Node.js v22+ (or v20+)
- ✅ pnpm (installed)
- ❓ PostgreSQL or cloud PostgreSQL (Supabase/Neon)

## Setup Steps

### 1. Configure Database

Choose one:

**Option A: Supabase (Cloud - Recommended)**
- Create free account at https://supabase.com
- New Project → copy connection string
- Edit `.env` file and add your DATABASE_URL

**Option B: Local PostgreSQL**
- Install PostgreSQL: https://www.postgresql.org/download/windows/
- Create database: `psql -U postgres -c "CREATE DATABASE packeasy;"`
- Edit `.env` file with: `postgresql://postgres:password@localhost:5432/packeasy`

### 2. Update .env File
```
DATABASE_URL=your_postgresql_connection_string_here
PORT=3000
EXPO_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 2a. Demo Login for Local Development
If you just want to run the app and sign in without setting up PostgreSQL, use:

```text
Email: demo@packeasy.local
Password: password123
```

These demo credentials work in development mode and return a fake session so you can get into the app right away.

### 3. Initialize Database Schema
```bash
pnpm --filter @workspace/db run push
```
This creates all required tables.

### 4. Run the API Server
```bash
cd artifacts/api-server
pnpm run dev
```
Server runs on http://localhost:3000

### 5. Run the Mobile App
In a new terminal:
```bash
cd artifacts/mobile
pnpm run dev
```
This starts the Expo development server.

## Testing the App

### API Health Check
```bash
curl http://localhost:3000/api/health
```

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Trip
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Authorization: Bearer <TOKEN_FROM_SIGNUP>" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris",
    "country": "France",
    "emoji": "🇫🇷",
    "smart": true
  }'
```

## Available Scripts

### Root Level
```bash
pnpm build                              # Typecheck + build all packages
pnpm run typecheck                      # Typecheck all code
```

### API Server
```bash
cd artifacts/api-server
pnpm run dev                            # Start dev server
pnpm run build                          # Build for production
pnpm run typecheck                      # Check types
```

### Mobile App
```bash
cd artifacts/mobile
pnpm run dev                            # Start Expo dev server
pnpm run build                          # Build APK/IPA
pnpm run typecheck                      # Check types
```

### Database
```bash
cd lib/db
pnpm run push                           # Apply schema changes
pnpm run push-force                     # Force apply changes (careful!)
```

## Project Structure
```
artifacts/
  ├── api-server/          # Express API backend
  ├── mobile/              # React Native/Expo app
  └── mockup-sandbox/      # Component testing UI
lib/
  ├── api-client-react/    # React Query hooks
  ├── api-spec/            # OpenAPI spec
  ├── api-zod/             # Zod validation schemas
  └── db/                  # Drizzle ORM + schema
```

## Features
- User authentication (signup/login)
- Trip management (CRUD)
- Smart packing lists with pre-built categories
- Items per category with checklist
- Pre-trip tasks management
- Real-time sync between frontend and backend

## Troubleshooting

**"DATABASE_URL not provided"**
→ Check .env file has DATABASE_URL set

**"Port 3000 already in use"**
→ Change PORT in .env or stop other services

**"Cannot connect to PostgreSQL"**
→ Verify database is running and connection string is correct

**Mobile app won't connect to API**
→ Check EXPO_PUBLIC_API_URL in .env matches your API server URL

## Next Steps
1. Set up database (see DATABASE_SETUP.md)
2. Start API server
3. Start mobile app
4. Sign up in the app
5. Create a trip and add items

Good luck! 🎉
