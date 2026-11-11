// ---------------------------------------------------------------------------------------------
// ONE place for talking to the FastAPI backend.
//   .env  ->  EXPO_PUBLIC_API_URL=http://192.168.1.10:8000     (your PC's IP; Android emulator: http://10.0.2.2:8000)
// While EXPO_PUBLIC_API_URL is empty the app runs on MOCK data (USE_MOCK = true), nothing else to change.
// ---------------------------------------------------------------------------------------------

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

/** true = no backend configured yet, the stores keep their demo data. */
export const USE_MOCK = BASE_URL === "";

let authToken: string | null = null;
/** Call after login: setAuthToken(response.access_token). */
export const setAuthToken = (t: string | null) => {
  authToken = t;
};

/**
 * Image source for a picture that lives on the backend, e.g. "/cats/<id>/photo?v=...".
 * The photo endpoint is login-protected, so the token travels with the request.
 */
export const imageSource = (path: string | null | undefined) =>
  path
    ? {
        uri: /^https?:\/\//.test(path) ? path : `${BASE_URL}${path}`,
        headers: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : undefined,
      }
    : null;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  timeoutMs?: number;
};

/** fetch with JSON, bearer token and a timeout (a dead server must not freeze the screen). */
export async function api<T>(
  path: string,
  { method = "GET", body, timeoutMs = 10000 }: Options = {},
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  } finally {
    clearTimeout(timer);
  }
}
/** Upload a file (multipart). Do NOT set Content-Type: fetch adds it together with the boundary. */
export async function apiUpload<T>(
  path: string,
  form: FormData,
  timeoutMs = 120000,
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: form,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new ApiError(res.status, await res.text());
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
