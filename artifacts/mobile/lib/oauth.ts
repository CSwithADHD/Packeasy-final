import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";

import { api } from "@/lib/api";

WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = "google" | "facebook" | "apple";

export async function getOAuthURL(provider: OAuthProvider): Promise<string> {
  const endpoint = `/api/oauth/${provider}/url`;
  const response = await api.customFetch<{ url: string; state: string }>(endpoint, {
    method: "GET",
    responseType: "json",
  });
  return response.url;
}

export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  state?: string,
) {
  return api.oauthExchange({
    provider,
    code,
    state,
  });
}

export function useOAuth() {
  const handleOAuthLogin = useCallback(async (provider: OAuthProvider) => {
    try {
      const authUrl = await getOAuthURL(provider);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, "packeasy://oauth-callback");

      if (result.type === "success") {
        const url = new URL(result.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code) {
          throw new Error("No authorization code received");
        }

        const authResult = await exchangeOAuthCode(provider, code, state || undefined);
        return authResult;
      } else if (result.type === "cancel") {
        throw new Error("OAuth login cancelled");
      } else if (result.type === "dismiss") {
        throw new Error("OAuth login dismissed");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return { handleOAuthLogin };
}
