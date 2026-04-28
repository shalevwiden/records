import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { followUser, getFollowing, getProfile, unfollowUser } from "../api";

type ProfileData = {
  user: { id: number; username: string; createdAt: string };
  favorites: { id: number; artist: string; title: string }[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean | null;
};

type FollowingItem = { id: number; username: string };

export default function ProfilePage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [followUsername, setFollowUsername] = useState("");

  const canUse = useMemo(() => Boolean(token && user), [token, user]);

  async function refresh() {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const p = await getProfile(user.username, token);
      setProfile(p as ProfileData);
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

  return (
    <div style={{ marginTop: 8 }}>
      <div className="grid-2">
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Your profile</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            Displaying your 5 most favorited albums.
          </div>
          <div className="hr" />

          {error ? <div className="error">{error}</div> : null}
          {loading || !profile ? <div className="muted">Loading...</div> : null}

          {profile ? (
            <>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div className="pill">@{profile.user.username}</div>
                <div className="pill">{profile.followersCount} followers</div>
                <div className="pill">{profile.followingCount} following</div>
              </div>

              <div style={{ marginTop: 14, fontWeight: 900 }}>Top 5 favorites</div>
              <div className="list" style={{ marginTop: 12 }}>
                {(profile.favorites || []).map((a) => (
                  <div key={a.id} className="item">
                    <h3>
                      {a.artist} — {a.title}
                    </h3>
                  </div>
                ))}
                {(profile.favorites || []).length === 0 ? (
                  <div className="muted">Favorite albums to see them here.</div>
                ) : null}
              </div>
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

