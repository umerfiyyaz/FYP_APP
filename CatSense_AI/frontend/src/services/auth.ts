// Talks to the backend for sign up / sign in and keeps the login token safe on the phone.
import * as SecureStore from "expo-secure-store";

import { api, ApiError, setAuthToken, USE_MOCK } from "@/services/api";

const TOKEN_KEY = "catsense_token";

export type AuthUser = { id: string; email: string; full_name: string | null };
type TokenOut = { access_token: string; token_type: string; user: AuthUser };

// ---- token storage (never crashes the app if secure storage is not available) ----
async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* the user just has to sign in again next time */
  }
}
async function loadToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}
async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

// ---- public functions ----
export async function signUp(
  email: string,
  password: string,
  fullName?: string,
): Promise<AuthUser> {
  const res = await api<TokenOut>("/auth/signup", {
    method: "POST",
    body: { email, password, full_name: fullName ?? null },
  });
  setAuthToken(res.access_token);
  await saveToken(res.access_token);
  return res.user;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  const res = await api<TokenOut>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setAuthToken(res.access_token);
  await saveToken(res.access_token);
  return res.user;
}

export async function signOut(): Promise<void> {
  setAuthToken(null);
  await clearToken();
}

/** App start: if a saved token is still valid, return the user (null = show the login screen). */
export async function restoreSession(): Promise<AuthUser | null> {
  if (USE_MOCK) return null;
  const token = await loadToken();
  if (!token) return null;
  setAuthToken(token);
  try {
    return await api<AuthUser>("/auth/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      setAuthToken(null);
      await clearToken(); // expired or invalid token
    }
    return null; // server not reachable: show login, keep the token for next time
  }
}

/** Turns any error into one short sentence for the user. */
export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    try {
      const detail = JSON.parse(e.message)?.detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail) && detail[0]?.msg) {
        return String(detail[0].msg).replace(/^Value error,\s*/, "");
      }
    } catch {
      /* not JSON, fall through */
    }
    return "Something went wrong. Please try again.";
  }
  return "Cannot reach the server. Check your Wi-Fi and try again.";
}
