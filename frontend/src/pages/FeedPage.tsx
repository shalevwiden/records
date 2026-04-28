import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getFeed } from "../api";

type FeedItem = {
  review: { body: string; createdAt: string; user: { id: number; username: string } };
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
      <div className="card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Friends feed</div>
        <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
          Reviews posted by you and the people you follow.
        </div>
        <div className="hr" />

        {error ? <div className="error">{error}</div> : null}
        {loading ? <div className="muted">Loading...</div> : null}
        {!loading && items.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>
            No reviews in your feed yet. Add a review in your library.
          </div>
        ) : null}

        <div className="list" style={{ marginTop: 12 }}>
          {items.map((it, idx) => {
            const username = it.review?.user?.username || it.author?.username || "Unknown";
            return (
              <div className="item" key={`${it.review.createdAt}-${idx}`}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ marginBottom: 4 }}>{it.album ? `${it.album.artist} — ${it.album.title}` : "Album"}</h3>
                    <div className="muted" style={{ fontSize: 13, fontWeight: 650 }}>
                      by {username}
                    </div>
                  </div>
                  <div className="pill">
                    {it.review.createdAt ? new Date(it.review.createdAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div style={{ marginTop: 10, lineHeight: 1.5, fontWeight: 550 }}>{it.review?.body}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

