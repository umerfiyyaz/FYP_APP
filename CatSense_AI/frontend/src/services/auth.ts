// Talks to the backend for sign up / sign in and keeps the login token safe on the phone.
import { useSyncExternalStore } from "react";
import * as SecureStore from "expo-secure-store";

import { api, ApiError, setAuthToken, USE_MOCK } from "@/services/api";
import { alertActions } from "@/store/alertStore";
import { catActions } from "@/store/catStore";
import { historyActions } from "@/store/historyStore";

const TOKEN_KEY = "catsense_token";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string | null;
  email_verified: boolean;
};
type TokenOut = { access_token: string; token_type: string; user: AuthUser };

let currentUser: AuthUser | null = null;
const listeners = new Set<() => void>();
function setUser(u: AuthUser | null) {
  currentUser = u;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Forget the cats, results and alerts of the previous account. */
function clearUserData() {
  catActions.clear();
  historyActions.clear();
  alertActions.clear();
}
/** The signed-in user (null in demo mode or before sign in). */
export const getCurrentUser = () => currentUser;
/** Same as getCurrentUser, but the screen redraws when the user (for example the name) changes. */
export const useCurrentUser = () =>
  useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser);

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
  setUser(res.user);
  clearUserData(); // a new account has nothing yet
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
  setUser(res.user);
  clearUserData();
  await catActions.hydrate(); // load this account's cats (results and alerts load per cat)
  return res.user;
}

export async function signOut(): Promise<void> {
  setAuthToken(null);
  setUser(null);
  await clearToken();
  if (!USE_MOCK) clearUserData(); // demo mode keeps its sample data
}

/** App start: if a saved token is still valid, return the user (null = show the login screen). */
export async function restoreSession(): Promise<AuthUser | null> {
  if (USE_MOCK) return null;
  const token = await loadToken();
  if (!token) return null;
  setAuthToken(token);
  try {
    const me = await api<AuthUser>("/auth/me");
    setUser(me);
    await catActions.hydrate();
    return me;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      setAuthToken(null);
      await clearToken(); // expired or invalid token
    }
    return null; // server not reachable: show login, keep the token for next time
  }
}

/** Sign up: type the 6 digit code that was emailed. The server marks the email as verified. */
export async function verifyEmail(code: string): Promise<AuthUser> {
  const me = await api<AuthUser>("/auth/verify-email", {
    method: "POST",
    body: { code },
  });
  setUser(me);
  return me;
}

/** Send a new verification code (the server allows one per minute). */
export const resendCode = () =>
  api<{ ok: boolean }>("/auth/resend-code", { method: "POST" });

/** Forgot password, step 1: email a reset code (the answer is "ok" even if the email has no account). */
export const forgotPassword = (email: string) =>
  api<{ ok: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });

/** Forgot password, step 2: the code from the email plus the new password. */
export const resetPassword = (
  email: string,
  code: string,
  newPassword: string,
) =>
  api<{ ok: boolean }>("/auth/reset-password", {
    method: "POST",
    body: { email, code, new_password: newPassword },
  });

/** Sign-up screen: is this email already used by another account? */
export async function isEmailTaken(email: string): Promise<boolean> {
  const res = await api<{ available: boolean }>("/auth/check-email", {
    method: "POST",
    body: { email },
  });
  return !res.available;
}

/** Change the display name of the signed-in user (PATCH /auth/me). */
export async function updateName(fullName: string): Promise<AuthUser> {
  const me = await api<AuthUser>("/auth/me", {
    method: "PATCH",
    body: { full_name: fullName },
  });
  setUser(me);
  return me;
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
