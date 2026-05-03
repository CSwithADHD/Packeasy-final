import { db } from "@workspace/db";
import { oauthProvidersTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";

import { newId } from "../lib/ids";
import { createSession } from "../lib/sessions";

const router: IRouter = Router();

// OAuth configuration - should come from environment variables
const OAUTH_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/oauth/google/callback",
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/oauth/facebook/callback",
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || "",
    clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    teamId: process.env.APPLE_TEAM_ID || "",
    keyId: process.env.APPLE_KEY_ID || "",
    privateKey: process.env.APPLE_PRIVATE_KEY || "",
    redirectUri: process.env.APPLE_REDIRECT_URI || "http://localhost:3000/api/oauth/apple/callback",
  },
};

// Helper to create or update OAuth user
async function createOrUpdateOAuthUser(
  provider: string,
  providerId: string,
  email: string,
  name: string,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
) {
  // Check if OAuth provider already exists
  const existingOAuth = await db
    .select()
    .from(oauthProvidersTable)
    .where(and(
      eq(oauthProvidersTable.provider, provider),
      eq(oauthProvidersTable.providerId, providerId),
    ))
    .limit(1);

  if (existingOAuth.length > 0) {
    // Update existing OAuth record
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
    await db
      .update(oauthProvidersTable)
      .set({
        accessToken,
        refreshToken: refreshToken || null,
        expiresAt,
      })
      .where(eq(oauthProvidersTable.id, existingOAuth[0].id));
    
    return existingOAuth[0].userId;
  }

  // Check if user with this email exists
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  let userId: string;
  if (existingUser.length > 0) {
    userId = existingUser[0].id;
  } else {
    // Create new user (without password for OAuth users)
    userId = newId();
    await db.insert(usersTable).values({
      id: userId,
      email,
      name,
      passwordHash: await hashOAuthPassword(userId),
    });
  }

  // Create OAuth provider record
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
  await db.insert(oauthProvidersTable).values({
    id: newId(),
    userId,
    provider,
    providerId,
    accessToken,
    refreshToken: refreshToken || null,
    expiresAt,
  });

  return userId;
}

function publicUser(u: { id: string; email: string; name: string }) {
  return { id: u.id, email: u.email, name: u.name };
}

// Google OAuth URL endpoint
router.get("/oauth/google/url", (req: Request, res: Response) => {
  const state = newId();
  const scope = "openid profile email";
  const redirectUri = OAUTH_CONFIG.google.redirectUri;
  const clientId = OAUTH_CONFIG.google.clientId;

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  return res.json({
    url: url.toString(),
    state,
  });
});

// Facebook OAuth URL endpoint
router.get("/oauth/facebook/url", (req: Request, res: Response) => {
  const state = newId();
  const scope = "public_profile,email";
  const redirectUri = OAUTH_CONFIG.facebook.redirectUri;
  const clientId = OAUTH_CONFIG.facebook.clientId;

  const url = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);

  return res.json({
    url: url.toString(),
    state,
  });
});

// Apple OAuth URL endpoint
router.get("/oauth/apple/url", (req: Request, res: Response) => {
  const state = newId();
  const scope = "name email";
  const redirectUri = OAUTH_CONFIG.apple.redirectUri;
  const clientId = OAUTH_CONFIG.apple.clientId;

  const url = new URL("https://appleid.apple.com/auth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  url.searchParams.set("response_mode", "form_post");

  return res.json({
    url: url.toString(),
    state,
  });
});

// Token exchange schema
const oauthTokenSchema = z.object({
  provider: z.enum(["google", "facebook", "apple"]),
  code: z.string(),
  state: z.string().optional(),
});

// Generic OAuth token exchange endpoint
router.post("/oauth/token", async (req: Request, res: Response) => {
  const parsed = oauthTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_input", details: parsed.error.flatten() });
  }

  const { provider, code } = parsed.data;

  try {
    let userData: { id: string; email: string; name: string; accessToken: string; refreshToken?: string; expiresIn?: number };

    if (provider === "google") {
      userData = await exchangeGoogleCode(code);
    } else if (provider === "facebook") {
      userData = await exchangeFacebookCode(code);
    } else if (provider === "apple") {
      userData = await exchangeAppleCode(code);
    } else {
      return res.status(400).json({ error: "invalid_provider" });
    }

    const userId = await createOrUpdateOAuthUser(
      provider,
      userData.id,
      userData.email,
      userData.name,
      userData.accessToken,
      userData.refreshToken,
      userData.expiresIn,
    );

    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: "user_not_found" });
    }

    const session = await createSession(userId);
    return res.json({
      user: publicUser(user[0]),
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth exchange failed";
    return res.status(400).json({ error: "oauth_exchange_failed", message });
  }
});

// Helper functions to exchange codes for tokens with OAuth providers
async function exchangeGoogleCode(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: OAUTH_CONFIG.google.clientId,
      client_secret: OAUTH_CONFIG.google.clientSecret,
      redirect_uri: OAUTH_CONFIG.google.redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("Google token exchange failed");
  }

  const tokenData = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };
  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userResponse.ok) {
    throw new Error("Google user info fetch failed");
  }

  const userData = (await userResponse.json()) as {
    sub: string;
    email: string;
    name?: string;
  };
  return {
    id: userData.sub,
    email: userData.email,
    name: userData.name || userData.email,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
  };
}

async function exchangeFacebookCode(code: string) {
  const response = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
    method: "POST",
    body: new URLSearchParams({
      code,
      client_id: OAUTH_CONFIG.facebook.clientId,
      client_secret: OAUTH_CONFIG.facebook.clientSecret,
      redirect_uri: OAUTH_CONFIG.facebook.redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("Facebook token exchange failed");
  }

  const tokenData = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };
  const userResponse = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`,
  );

  if (!userResponse.ok) {
    throw new Error("Facebook user info fetch failed");
  }

  const userData = (await userResponse.json()) as {
    id: string;
    email?: string;
    name?: string;
  };
  return {
    id: userData.id,
    email: userData.email || "",
    name: userData.name || "Facebook User",
    accessToken: tokenData.access_token,
  };
}

async function exchangeAppleCode(code: string) {
  // Note: Apple OAuth implementation is more complex and requires JWT signing
  // For now, we'll implement a simplified version
  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: OAUTH_CONFIG.apple.clientId,
      client_secret: OAUTH_CONFIG.apple.clientSecret,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!response.ok) {
    throw new Error("Apple token exchange failed");
  }

  const tokenData = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    id_token: string;
  };
  // Decode ID token (JWT) - simplified version, should validate signature in production
  const idTokenParts = tokenData.id_token.split(".");
  const payload = JSON.parse(Buffer.from(idTokenParts[1], "base64").toString()) as {
    sub: string;
    email?: string;
  };

  return {
    id: payload.sub,
    email: payload.email || "",
    name: "Apple User",
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
  };
}

async function hashOAuthPassword(userId: string) {
  return `oauth-${userId}-${newId()}`;
}

export default router;
