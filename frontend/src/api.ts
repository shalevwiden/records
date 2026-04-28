export type ApiError = { error?: string; message?: string };

const API_BASE = "/api";

export function apiFetch<T>(
  path: string,
  opts?: {
    method?: string;
    token?: string | null;
    body?: unknown;
  },
): Promise<T> {
  const method = opts?.method ?? "GET";
  const token = opts?.token ?? null;
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {};
  if (opts?.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return fetch(url, {
    method,
    headers,
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = (data as ApiError) || { error: `Request failed (${res.status})` };
      throw new Error(err.error || err.message || `Request failed (${res.status})`);
    }
    return data as T;
  });
}

export async function signup(input: { username: string; email: string; password: string }) {
  return apiFetch<{ id: number; username: string; createdAt: string }>(
    "/auth/signup",
    { method: "POST", body: input },
  );
}

export async function login(input: { emailOrUsername: string; password: string }) {
  return apiFetch<{ accessToken: string; user: { id: number; username: string; createdAt: string } }>(
    "/auth/login",
    { method: "POST", body: input },
  );
}

export async function getMe(token: string) {
  return apiFetch<{ id: number; username: string; favoritesCount: number }>(
    "/me",
    { token },
  );
}

export async function getLibrary(token: string) {
  return apiFetch<{ items: any[] }>("/me/library", { token });
}

export async function listenAlbum(token: string, input: { artist: string; title: string }) {
  return apiFetch<{ album: { id: number; artist: string; title: string } }>(
    "/me/listen",
    { method: "POST", token, body: input },
  );
}

export async function upsertReview(token: string, input: { albumId: number; body: string }) {
  return apiFetch<{ review: any }>("/me/reviews", { method: "POST", token, body: input });
}

export async function toggleFavorite(token: string, input: { albumId: number; favorite?: boolean }) {
  return apiFetch<{ favorited: boolean }>(
    "/me/favorites",
    { method: "POST", token, body: input },
  );
}

export async function getFavorites(token: string) {
  return apiFetch<{ items: { id: number; artist: string; title: string }[] }>(
    "/me/favorites",
    { token },
  );
}

export async function getProfile(username: string, token?: string | null) {
  // Profile is public, but we pass token when we want follow state.
  return apiFetch<any>(`/users/${encodeURIComponent(username)}/profile`, { token: token ?? null });
}

export async function getFollowing(token: string) {
  return apiFetch<{ items: { id: number; username: string }[] }>("/me/following", { token });
}

export async function followUser(token: string, username: string) {
  return apiFetch<{ following: boolean }>(`/me/follows/${encodeURIComponent(username)}`, {
    method: "POST",
    token,
  });
}

export async function unfollowUser(token: string, username: string) {
  return apiFetch<{ following: boolean }>(`/me/follows/${encodeURIComponent(username)}`, {
    method: "DELETE",
    token,
  });
}

export async function getFeed(token: string) {
  return apiFetch<{ items: any[] }>("/me/feed", { token });
}

