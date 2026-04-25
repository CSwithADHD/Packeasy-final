#!/usr/bin/env pwsh
# Setup validation and helper script for PackEasy

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PackEasy Project - Setup Validator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
}

# Check pnpm
$pnpmVersion = pnpm --version 2>$null
if ($pnpmVersion) {
    Write-Host "✓ pnpm: v$pnpmVersion" -ForegroundColor Green
}
else {
    Write-Host "✗ pnpm not found" -ForegroundColor Red
}

# Check environment file
Write-Host ""
Write-Host "Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    $envContent = Get-Content .env -Raw
    if ($envContent -match "DATABASE_URL") {
        $hasUrl = $envContent -match "DATABASE_URL=.+"
        if ($hasUrl) {
            Write-Host "✓ DATABASE_URL is set" -ForegroundColor Green
        }
        else {
            Write-Host "✗ DATABASE_URL is not configured" -ForegroundColor Red
            Write-Host "  → Please update .env with your PostgreSQL connection string" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    Write-Host "  → Copy .env.example to .env and configure DATABASE_URL" -ForegroundColor Yellow
}

# Check if node_modules exist
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✗ Dependencies not installed" -ForegroundColor Red
    Write-Host "  → Run: pnpm install" -ForegroundColor Yellow
}

# Check PostgreSQL
Write-Host ""
Write-Host "Checking database..." -ForegroundColor Yellow
$psqlVersion = psql --version 2>$null
if ($psqlVersion) {
    Write-Host "✓ PostgreSQL installed: $psqlVersion" -ForegroundColor Green
}
else {
    Write-Host "⚠ PostgreSQL not found locally" -ForegroundColor Yellow
    Write-Host "  → Use Supabase/Neon (cloud) or install PostgreSQL locally" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. DATABASE SETUP (Required)"
Write-Host "   Option A (Recommended):"
Write-Host "   - Go to https://supabase.com and create a free account"
Write-Host "   - Create a new project"
Write-Host "   - Copy the PostgreSQL connection string"
Write-Host "   - Paste in .env as DATABASE_URL"
Write-Host ""
Write-Host "   Option B:"
Write-Host "   - Install PostgreSQL: https://www.postgresql.org/download/windows/"
Write-Host "   - Create database: psql -U postgres -c `"CREATE DATABASE packeasy;`""
Write-Host "   - Update .env with your credentials"
Write-Host ""

Write-Host "2. INITIALIZE DATABASE"
Write-Host "   Run: pnpm --filter @workspace/db run push"
Write-Host ""

Write-Host "3. START API SERVER (Terminal 1)"
Write-Host "   Run: cd artifacts/api-server; pnpm run dev"
Write-Host ""

Write-Host "4. START MOBILE APP (Terminal 2)"
Write-Host "   Run: cd artifacts/mobile; pnpm run dev"
Write-Host ""

Write-Host "5. TEST THE API"
Write-Host "   Run: curl http://localhost:3000/api/health"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Documentation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "- QUICK_START.md     - Complete setup guide"
Write-Host "- DATABASE_SETUP.md  - Detailed database setup"
Write-Host "- docker-compose.yml - PostgreSQL via Docker"
Write-Host ""
