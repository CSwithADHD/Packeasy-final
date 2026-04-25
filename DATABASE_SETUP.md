# Database Setup Guide for PackEasy

## Option A: Using Supabase (Recommended - Fastest)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Choose a name (e.g., "packeasy"), set a secure password, select your region
4. Wait for the project to initialize (2-3 minutes)
5. Go to Project Settings → Database
6. Copy the "Connection string" (psycopg2)
7. Replace the user, password, and host in this format:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```
8. Add this to your .env file as:
   ```
   DATABASE_URL=your_connection_string_here
   ```

## Option B: Local PostgreSQL Installation

1. Download from: https://www.postgresql.org/download/windows/
2. During installation, remember the password you set for the postgres user
3. Keep default port (5432)
4. Add to .env:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/packeasy
   ```
5. Create the database:
   ```
   psql -U postgres -c "CREATE DATABASE packeasy;"
   ```

## After Setting DATABASE_URL

Once you've added the DATABASE_URL to your .env file, run:

```bash
pnpm --filter @workspace/db run push
```

This will create all necessary tables in your database.

## Verification

To verify the database is set up correctly:
```bash
pnpm --filter @workspace/db run push
```

You should see output indicating tables were created.
