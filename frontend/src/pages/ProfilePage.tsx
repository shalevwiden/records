import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { followUser, getFollowing, getProfile, unfollowUser, updateProfile, uploadImage } from "../api";

type ProfileData = {
  user: {
    id: number;
    username: string;
    displayName: string | null;
    bio: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  topArtists: { slot: number; name: string }[];
  favorites: { id: number; artist: string; title: string }[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean | null;
};

type FollowingItem = { id: number; username: string };

function topArtistsToSlots(tops: { slot: number; name: string }[]): string[] {
  const arr = ["", "", "", "", ""];
  for (const t of tops) {
    if (t.slot >= 1 && t.slot <= 5) arr[t.slot - 1] = t.name;
  }
  return arr;
}

export default function ProfilePage() {
  const { token, user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [followUsername, setFollowUsername] = useState("");

  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editTopArtists, setEditTopArtists] = useState<string[]>(["", "", "", "", ""]);

  const canUse = useMemo(() => Boolean(token && user), [token, user]);

  async function refresh() {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const p = await getProfile(user.username, token);
      const data = p as ProfileData;
      setProfile(data);
      setEditDisplayName(data.user.displayName ?? "");
      setEditBio(data.user.bio ?? "");
      setEditAvatarUrl(data.user.avatarUrl ?? "");
      setEditTopArtists(topArtistsToSlots(data.topArtists || []));
      const f = await getFollowing(token);
      setFollowing((f.items || []) as FollowingItem[]);
    } catch (err: any) {
      setError(err?.message || "Could not load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canUse) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUse]);

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    setError(null);
    try {
      await updateProfile(token, {
        displayName: editDisplayName.trim() || null,
        bio: editBio.trim() || null,
        avatarUrl: editAvatarUrl.trim() || null,
        topArtists: editTopArtists,
      });
      await refresh();
      await refreshUser();
    } catch (err: any) {
      setError(err?.message || "Could not save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setError(null);
    try {
      const { url } = await uploadImage(token, file);
      setEditAvatarUrl(url);
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function onFollow() {
    if (!token || !user) return;
    const target = followUsername.trim();
    if (!target) return;
    if (target === user.username) {
      setError("You can't follow yourself.");
      return;
    }
    setError(null);
    try {
      await followUser(token, target);
      setFollowUsername("");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not follow");
    }
  }

  async function onUnfollow(username: string) {
    if (!token) return;
    setError(null);
    try {
      await unfollowUser(token, username);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not unfollow");
    }
  }

  const displayName = profile?.user.displayName?.trim() || profile?.user.username || "";
  const avatarSrc = profile?.user.avatarUrl || undefined;

  return (
    <div style={{ marginTop: 8 }}>
      <div className="grid-2">
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Your profile</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            How you appear to others. Edit details and your top artists below.
          </div>
          <div className="hr" />

          {error ? <div className="error">{error}</div> : null}
          {loading || !profile ? <div className="muted">Loading...</div> : null}

          {profile ? (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "var(--border, #e5e5e5)",
                    flexShrink: 0,
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 36,
                        color: "#888",
                      }}
                    >
                      {(profile.user.username[0] || "?").toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2 }}>{displayName}</div>
                  <div className="muted" style={{ marginTop: 4, fontWeight: 650 }}>
                    @{profile.user.username}
                  </div>
                  <div style={{ marginTop: 12, lineHeight: 1.5, fontWeight: 550, whiteSpace: "pre-wrap" }}>
                    {profile.user.bio?.trim() ? profile.user.bio : (
                      <span className="muted">No bio yet.</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                    <div className="pill">{profile.followersCount} followers</div>
                    <div className="pill">{profile.followingCount} following</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 22, fontWeight: 900 }}>Top 5 musical artists</div>
              <div className="list" style={{ marginTop: 10 }}>
                {(profile.topArtists || []).length === 0 ? (
                  <div className="muted">Add your favorite artists in the form below.</div>
                ) : (
                  (profile.topArtists || []).map((t) => (
                    <div key={t.slot} className="item" style={{ padding: "10px 12px" }}>
                      <span className="muted" style={{ marginRight: 10, fontWeight: 700 }}>
                        {t.slot}.
                      </span>
                      <span style={{ fontWeight: 750 }}>{t.name}</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: 22, fontWeight: 900 }}>Favorite albums</div>
              <div className="muted" style={{ marginTop: 4, fontWeight: 600, fontSize: 13 }}>
                Your five most recently favorited albums.
              </div>
              <div className="list" style={{ marginTop: 12 }}>
                {(profile.favorites || []).map((a) => (
                  <div key={a.id} className="item">
                    <h3 style={{ margin: 0, fontSize: 16 }}>
                      {a.artist} — {a.title}
                    </h3>
                  </div>
                ))}
                {(profile.favorites || []).length === 0 ? (
                  <div className="muted">Favorite albums from your library to see them here.</div>
                ) : null}
              </div>

              <div className="hr" style={{ marginTop: 22 }} />
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Edit profile</div>
              <form onSubmit={onSaveProfile}>
                <div className="field">
                  <label>Name</label>
                  <input
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="Display name"
                    maxLength={120}
                  />
                </div>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell people about your taste…"
                    maxLength={5000}
                  />
                </div>
                <div className="field" style={{ marginTop: 10 }}>
                  <label>Profile picture</label>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={onAvatarFile} />
                    <input
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="Or paste image URL (/uploads/… or https://…)"
                      style={{ flex: "1 1 200px", minWidth: 0 }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 14, fontWeight: 800 }}>Top artists (up to 5)</div>
                {editTopArtists.map((val, i) => (
                  <div className="field" style={{ marginTop: 8 }} key={i}>
                    <label>{i + 1}.</label>
                    <input
                      value={val}
                      onChange={(e) =>
                        setEditTopArtists((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      placeholder="Artist name"
                      maxLength={200}
                    />
                  </div>
                ))}
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn-primary" type="submit" disabled={savingProfile}>
                    {savingProfile ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </form>
            </>
          ) : null}
        </div>

        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Friends</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            Follow people to see their reviews in your feed.
          </div>
          <div className="hr" />

          <div className="field">
            <label>Follow a friend by username</label>
            <div className="row">
              <input
                value={followUsername}
                onChange={(e) => setFollowUsername(e.target.value)}
                placeholder="e.g. john_doe"
              />
              <button className="btn btn-primary" type="button" onClick={onFollow} disabled={!followUsername.trim() || loading}>
                Follow
              </button>
            </div>
          </div>

          <div style={{ marginTop: 14, fontWeight: 900 }}>Following</div>

          {following.length === 0 && loading ? <div className="muted">Loading...</div> : null}
          {following.length === 0 && !loading ? (
            <div className="muted" style={{ marginTop: 8 }}>
              You aren&apos;t following anyone yet.
            </div>
          ) : null}

          <div className="list" style={{ marginTop: 12 }}>
            {following.map((f) => (
              <div key={f.id} className="item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ marginBottom: 2, fontSize: 16 }}>@{f.username}</h3>
                  </div>
                  <button className="btn btn-danger" type="button" onClick={() => onUnfollow(f.username)}>
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
