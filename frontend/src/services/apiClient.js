// Thin fetch wrapper for the Nuvela REST API (/api/v1).
// When VITE_API_URL is not set the app runs in demo mode and the service
// modules fall back to local, in-browser behaviour instead of calling this.
import { APP } from "../config/app.js";

const TOKEN_KEY = "nuvela.auth";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const tokenStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY)) ?? null;
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      if (value) localStorage.setItem(TOKEN_KEY, JSON.stringify(value));
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Storage unavailable; the session just won't persist.
    }
  },
};

async function refreshTokens() {
  const session = tokenStore.get();
  if (!session?.refreshToken) return null;
  const res = await fetch(`${APP.apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (!res.ok) {
    tokenStore.set(null);
    return null;
  }
  const { data } = await res.json();
  tokenStore.set({ ...session, ...data });
  return data.accessToken;
}

export async function apiRequest(path, { method = "GET", body, auth = false, lang, signal, retry = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (lang) headers["Accept-Language"] = lang;
  const session = tokenStore.get();
  if (auth && session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  signal?.addEventListener("abort", () => controller.abort());

  let res;
  try {
    res = await fetch(`${APP.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(err.name === "AbortError" ? "Request timed out" : "Network error", 0);
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 401 && auth && retry && (await refreshTokens())) {
    return apiRequest(path, { method, body, auth, lang, signal, retry: false });
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(payload.message || `Request failed (${res.status})`, res.status, payload.errors);
  return payload.data;
}
