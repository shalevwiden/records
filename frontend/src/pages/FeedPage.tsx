import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getFeed } from "../api";

type FeedItem = {
  review: {
    body: string;
    createdAt: string;
    user: { id: number; username: string };
  };
  album: { id: number; artist: string; title: string } | null;
  author: { id: number; username: string } | null;
};

export default function FeedPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUse = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!canUse) return;
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await getFeed(token as string);
        if (cancelled) return;
        setItems((res.items || []) as FeedItem[]);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "Could not load feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [canUse, token]);

  return (
    <div style={{ marginTop: 8 }}>
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1 className="page-title">Your feed</h1>
          <p className="page-subtitle">
            Reviews posted by you and the people you follow.
          </p>
        </div>
        <div className="pill pill-muted">
          {items.length} {items.length === 1 ? "review" : "reviews"}
        </div>
      </div>

      <div className="card card-hero">
        <div className="section-title">Latest reviews</div>
        <div className="section-sub">
          Fresh thoughts on albums and songs from your circle.
        </div>
        <div className="hr" />

        {error ? <div className="error">{error}</div> : null}
        {loading ? <div className="muted">Loading...</div> : null}
        {!loading && items.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>
            No reviews in your feed yet. Add a review in your library or follow
            more people.
          </div>
        ) : null}

        <div className="list" style={{ marginTop: 12 }}>
          {items.map((it, idx) => {
            const username =
              it.review?.user?.username || it.author?.username || "Unknown";
            const initial = (username || "?").charAt(0).toUpperCase();
            return (
              <div className="item" key={`${it.review.createdAt}-${idx}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      minWidth: 0,
                    }}
                  >
                    <div className="feed-avatar" aria-hidden>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ marginBottom: 4 }}>
                        {it.album
                          ? `${it.album.artist} — ${it.album.title}`
                          : "Album"}
                      </h3>
                      <div
                        className="muted"
                        style={{ fontSize: 13, fontWeight: 650 }}
                      >
                        by <span style={{ color: "#1d75e8" }}>@{username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pill pill-muted">
                    {it.review.createdAt
                      ? new Date(it.review.createdAt).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
                <div
                  style={{ marginTop: 12, lineHeight: 1.6, fontWeight: 500 }}
                >
                  {it.review?.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
