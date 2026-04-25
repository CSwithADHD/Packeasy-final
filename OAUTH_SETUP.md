# OAuth Setup Guide

This guide explains how to enable OAuth login for Google, Apple, and Facebook in the PackEasy app.

## Overview

The application now supports OAuth 2.0 authentication with three providers:
- **Google** - Recommended for quick setup
- **Facebook** - For social integration
- **Apple** - Required for iOS App Store compliance

## Architecture

### Backend (`artifacts/api-server/`)
- OAuth endpoints in `src/routes/oauth.ts`
- Token exchange and user creation
- OAuth provider records stored in `oauthProvidersTable`

### Mobile (`artifacts/mobile/`)
- OAuth flow via `expo-web-browser`
- Token exchange via `expo-auth-session`
- OAuth hooks in `lib/oauth.ts`

### Database
- New table: `oauthProvidersTable` - stores OAuth provider credentials per user
- Updated: `usersTable.passwordHash` - now nullable for OAuth-only accounts

## Setup Instructions

### 1. Google OAuth

**Requirements:**
- Google Cloud Project
- OAuth 2.0 Client ID (Web Application type)

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/oauth/google/callback`
   - Production: `https://yourdomain.com/api/oauth/google/callback`
6. Copy Client ID and Client Secret

**Environment Variables:**
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
```

**Mobile Configuration:**
- Redirect scheme: `packeasy://oauth-callback`
- Automatically handled by `expo-web-browser`

---

### 2. Facebook OAuth

**Requirements:**
- Facebook Developer Account
- Facebook App

**Steps:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create new app or select existing
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:3000/api/oauth/facebook/callback`
   - Production: `https://yourdomain.com/api/oauth/facebook/callback`
5. Get App ID and App Secret from Settings > Basic

**Environment Variables:**
```
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/oauth/facebook/callback
```

**Scopes Used:**
- `public_profile` - Access to public profile info
- `email` - Access to email address

---

### 3. Apple OAuth

**Requirements:**
- Apple Developer Account (paid membership)
- App ID and associated Services ID
- Private signing key

**Steps:**
1. Go to [Apple Developer](https://developer.apple.com)
2. Create App ID with "Sign in with Apple" capability
3. Create Services ID for web auth
4. Configure redirect URIs:
   - Development: `http://localhost:3000/api/oauth/apple/callback`
   - Production: `https://yourdomain.com/api/oauth/apple/callback`
5. Create private key for server communication
6. Download key file (keep secure!)

**Environment Variables:**
```
APPLE_CLIENT_ID=your_services_id
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=base64_encoded_private_key
APPLE_REDIRECT_URI=http://localhost:3000/api/oauth/apple/callback
```

**Note:** Apple private key should be base64 encoded for environment variable storage.

---

## Database Migration

Run migrations to add OAuth support:

```sql
-- Create OAuth providers table
CREATE TABLE oauth_providers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(provider, provider_id)
);

-- Update users table to make passwordHash nullable
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

## Testing OAuth Flow

### Local Development

1. **Start Backend:**
   ```bash
   cd artifacts/api-server
   pnpm run dev
   ```

2. **Start Mobile App:**
   ```bash
   cd artifacts/mobile
   pnpm run dev
   ```

3. **Test OAuth:**
   - Click Google/Apple/Facebook button in login/signup
   - Accept OAuth consent screen
   - Should redirect back to app with token

### Verifying Backend

Test OAuth endpoints directly:

```bash
# Get Google OAuth URL
curl http://localhost:3000/api/oauth/google/url

# Exchange token (after user grants permission)
curl -X POST http://localhost:3000/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"provider": "google", "code": "auth_code_here"}'
```

## Security Considerations

1. **Environment Variables:** Store all secrets in `.env` file, never commit to git
2. **HTTPS:** Always use HTTPS in production
3. **Token Storage:** Mobile app securely stores tokens using `@react-native-async-storage/async-storage`
4. **Refresh Tokens:** Implement token refresh logic for long sessions
5. **State Parameter:** State parameter is used to prevent CSRF attacks

## Troubleshooting

### "Invalid redirect URI"
- Verify exact URI match in provider configuration
- Check query parameters aren't being added by redirect

### "Access denied"
- Ensure OAuth app is in development/testing mode
- Check user permissions on OAuth provider
- Verify scopes are correctly configured

### Mobile app not receiving callback
- Ensure `expo-web-browser` is installed
- Check deep link scheme matches provider config
- Verify `WebBrowser.maybeCompleteAuthSession()` is called

## Future Enhancements

- [ ] Refresh token rotation
- [ ] Account linking (connect multiple OAuth providers to one user)
- [ ] Social profile picture import
- [ ] Conditional OAuth requirement based on app config
- [ ] Support for additional providers (GitHub, LinkedIn, Twitter)
