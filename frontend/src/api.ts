export type ApiError = { error?: string; message?: string };

export type UserPublic = {
  id: number;
  username: string;
  displayName: string | null;
  bio: string;
  avatarUrl: string | null;
  createdAt: string;
};

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
      // #region agent log
      if (path.includes("auth/login")) {
        fetch("http://127.0.0.1:7673/ingest/9e471fcb-489a-4876-9a35-910e1943b6e1", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e9bd46" },
          body: JSON.stringify({
            sessionId: "e9bd46",
            location: "frontend/src/api.ts:apiFetch",
            message: "login response not ok",
            data: { status: res.status, bodyKeys: data && typeof data === "object" ? Object.keys(data as object) : [] },
            timestamp: Date.now(),
            hypothesisId: "H-client",
          }),
        }).catch(() => {});
      }
      // #endregion
      const err = (data as ApiError) || { error: `Request failed (${res.status})` };
      throw new Error(err.error || err.message || `Request failed (${res.status})`);
    }
    return data as T;
  });
}

export async function signup(input: { username: string; email: string; password: string }) {
  return apiFetch<UserPublic>("/auth/signup", { method: "POST", body: input });
}

export async function login(input: { emailOrUsername: string; password: string }) {
  return apiFetch<{ accessToken: string; user: UserPublic }>("/auth/login", { method: "POST", body: input });
}

export async function getMe(token: string) {
  return apiFetch<UserPublic & { favoritesCount: number }>("/me", { token });
}

export async function updateProfile(
  token: string,
  body: {
    displayName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    topArtists?: string[];
  },
) {
  return apiFetch<UserPublic>("/me/profile", { method: "PATCH", token, body });
}

export async function uploadImage(token: string, file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const url = `${API_BASE}/me/uploads/image`;
  return fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  }).then(async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = (data as ApiError) || { error: `Request failed (${res.status})` };
      throw new Error(err.error || err.message || `Request failed (${res.status})`);
    }
    return data as { url: string };
  });
}

export type ListeningEntryType = "album" | "song";

export async function getLibrary(token: string) {
  return apiFetch<{
      items: {
      listenedAt: string | null;
      type: ListeningEntryType;
      coverImageUrl: string | null;
      album: { id: number; artist: string; title: string };
      review: unknown;
      isFavorite: boolean;
    }[];
  }>("/me/library", { token });
}

export async function addListening(
  token: string,
  input: { artist: string; title: string; type?: ListeningEntryType; coverImageUrl?: string | null },
) {
  return apiFetch<{ album: { id: number; artist: string; title: string }; type: ListeningEntryType }>(
    "/me/listen",
    { method: "POST", token, body: input },
  );
}

export async function patchListeningCover(token: string, albumId: number, coverImageUrl: string | null) {
  return apiFetch<{ albumId: number; coverImageUrl: string | null }>(
    `/me/listenings/${albumId}`,
    { method: "PATCH", token, body: { coverImageUrl } },
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

