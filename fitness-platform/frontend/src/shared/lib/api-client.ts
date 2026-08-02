/**
 * Minimal fetch wrapper with token attachment and one-shot refresh-on-401.
 * Every feature's api.ts goes through this, so auth handling lives in one
 * place instead of being copy-pasted per feature.
 */

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/shared/lib/token-storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const body = (await response.json()) as { access_token: string; refresh_token: string };
  setTokens(body.access_token, body.refresh_token);
  return true;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = getAccessToken();

  const doFetch = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    });

  let response = await doFetch();

  // A single, de-duplicated refresh attempt: if five requests 401 at once
  // (e.g. a dashboard firing several queries in parallel), we don't want
  // to hit /auth/refresh five times — they all await the same promise.
  if (response.status === 401 && getRefreshToken()) {
    refreshInFlight ??= refreshTokens().finally(() => {
      refreshInFlight = null;
    });
    const refreshed = await refreshInFlight;
    if (refreshed) {
      response = await doFetch();
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }));
    throw new ApiError(response.status, body.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
