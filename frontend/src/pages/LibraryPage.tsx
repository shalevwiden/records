import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getLibrary, listenAlbum, toggleFavorite, upsertReview } from "../api";

type LibraryItem = {
  listenedAt: string | null;
  album: { id: number; artist: string; title: string };
  review: { id: number; body: string } | null;
  isFavorite: boolean;
};

export default function LibraryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  const [reviewDrafts, setReviewDrafts] = useState<Record<number, string>>({});

  const canUse = useMemo(() => Boolean(token), [token]);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getLibrary(token);
      const nextItems = (res.items || []) as LibraryItem[];
      setItems(nextItems);
      const drafts: Record<number, string> = {};
      for (const it of nextItems) {
        drafts[it.album.id] = it.review?.body ?? "";
      }
      setReviewDrafts(drafts);
    } catch (err: any) {
      setError(err?.message || "Failed to load library");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canUse) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUse]);

  async function onAddListening(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    try {
      await listenAlbum(token, { artist, title });
      setArtist("");
      setTitle("");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not add album");
    }
  }

  async function onToggleFavorite(albumId: number, isFavorite: boolean) {
    if (!token) return;
    setError(null);
    try {
      await toggleFavorite(token, { albumId, favorite: !isFavorite });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not update favorite");
    }
  }

  async function onSaveReview(albumId: number) {
    if (!token) return;
    const body = (reviewDrafts[albumId] || "").trim();
    if (!body) {
      setError("Write a review before saving.");
      return;
    }
    setError(null);
    try {
      await upsertReview(token, { albumId, body });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not save review");
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div className="grid-2">
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Add an album you listened to</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            Enter artist + title, then write a review and favorite it.
          </div>
          <div className="hr" />
          <form onSubmit={onAddListening}>
            <div className="field">
              <label>Artist</label>
              <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Radiohead" required />
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>Album title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. OK Computer" required />
            </div>
            {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={!artist || !title || loading}>
                {loading ? "Working..." : "Add album"}
              </button>
            </div>
          </form>
        </div>
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Add an album you listened to</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            Enter artist + title, then write a review and favorite it.
          </div>
          <div className="hr" />
          <form onSubmit={onAddListening}>
            <div className="field">
              <label>Artist</label>
              <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Radiohead" required />
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>Album title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. OK Computer" required />
            </div>
            {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={!artist || !title || loading}>
                {loading ? "Working..." : "Add album"}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Your library</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            {items.length} album{items.length === 1 ? "" : "s"} in your listening history.
          </div>
          <div className="hr" />

          {loading ? <div className="muted">Loading...</div> : null}
          {items.length === 0 && !loading ? (
            <div className="muted" style={{ marginTop: 10 }}>
              No albums yet. Add your first listen to get started.
            </div>
          ) : null}

          <div className="list" style={{ marginTop: 12 }}>
            {items.map((it) => (
              <div key={it.album.id} className="item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <h3>
                      {it.album.artist} — {it.album.title}
                    </h3>
                    <div className="muted" style={{ fontSize: 13, fontWeight: 650 }}>
                      {it.listenedAt ? `Listened: ${new Date(it.listenedAt).toLocaleString()}` : ""}
                    </div>
                  </div>
                  <button
                    className={`btn ${it.isFavorite ? "btn-danger" : "btn-primary"}`}
                    type="button"
                    onClick={() => onToggleFavorite(it.album.id, it.isFavorite)}
                  >
                    {it.isFavorite ? "Unfavorite" : "Favorite"}
                  </button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="field">
                    <label>Your review</label>
                    <textarea
                      value={reviewDrafts[it.album.id] ?? ""}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [it.album.id]: e.target.value }))}
                      placeholder="What did you think? Favorite tracks? Highlights?"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" type="button" onClick={() => onSaveReview(it.album.id)}>
                    Save review
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

