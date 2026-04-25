# Supabase Setup Guide for PackEasy

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended - easier) or email
4. After login, click "New Project"
5. Fill in:
   - **Project Name**: `packeasy` (or whatever you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., us-east-1, eu-west-1)
6. Click "Create new project"
7. Wait 3-5 minutes for the project to initialize

## Step 2: Get Your Connection String

1. Once the project is ready, go to **Settings** (bottom left)
2. Click **Database**
3. Under "Connection string" section, look for the "URI" tab
4. Copy the connection string that starts with `postgresql://`
5. It will look like:
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## Step 3: Update Your .env File

1. Open `.env` in your text editor
2. Replace the `DATABASE_URL` line with your Supabase connection string
3. Example:
   ```
   DATABASE_URL=postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   PORT=3000
   NODE_ENV=development
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

⚠️ **IMPORTANT**: Keep this connection string secret! Don't commit `.env` to git.

## Step 4: Initialize Database Schema

Run this command from the project root:

```bash
pnpm --filter @workspace/db run push
```

This will create all the tables in your Supabase database. You should see:
```
✓ Tables created successfully
```

**Verify in Supabase:**
- Go to your Supabase project → **Table Editor**
- You should see: `users`, `sessions`, `trips`, `categories`, `items`, `tasks`

## Step 5: You're Ready!

Your database is now configured. Move on to starting the servers.

---

## Troubleshooting

**Error: "Cannot connect to database"**
- Double-check the connection string in .env
- Make sure you copied the full password with special characters
- Verify you're using the correct region

**Error: "Unknown table"**
- Run: `pnpm --filter @workspace/db run push` again
- Check Supabase dashboard to confirm tables exist

**Connection string not working?**
- Go to Supabase Settings → Database → Connection string
- Make sure you're copying the full URI including password
- The password is between the `:` and `@` symbols

---

## What Gets Created

Supabase automatically creates these tables for PackEasy:

- **users** - User accounts with email & password hash
- **sessions** - Authentication tokens
- **trips** - Travel trips/destinations
- **categories** - Packing categories (clothes, toiletries, etc.)
- **items** - Items within categories (shirt, pants, etc.)
- **tasks** - Pre-trip tasks (book flights, pack, etc.)

All data is encrypted and securely stored.
