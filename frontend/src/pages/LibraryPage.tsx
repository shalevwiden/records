import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addListening,
  getLibrary,
  patchListeningCover,
  toggleFavorite,
  upsertReview,
  uploadImage,
  type ListeningEntryType,
} from "../api";

type LibraryItem = {
  listenedAt: string | null;
  type: ListeningEntryType;
  coverImageUrl: string | null;
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
  const [entryType, setEntryType] = useState<ListeningEntryType>("album");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [reviewDrafts, setReviewDrafts] = useState<Record<number, string>>({});
  const [coverEdits, setCoverEdits] = useState<Record<number, string>>({});

  const canUse = useMemo(() => Boolean(token), [token]);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getLibrary(token);
      const nextItems = (res.items || []).map((it) => ({
        ...it,
        type: it.type === "song" ? "song" : "album",
        coverImageUrl: it.coverImageUrl ?? null,
      })) as LibraryItem[];
      setItems(nextItems);
      const ce: Record<number, string> = {};
      for (const it of nextItems) {
        ce[it.album.id] = it.coverImageUrl ?? "";
      }
      setCoverEdits(ce);
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
      let cover: string | null = coverImageUrl.trim() || null;
      if (coverFile) {
        const up = await uploadImage(token, coverFile);
        cover = up.url;
      }
      await addListening(token, { artist, title, type: entryType, coverImageUrl: cover });
      setArtist("");
      setTitle("");
      setCoverImageUrl("");
      setCoverFile(null);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not add entry");
    }
  }

  async function onUpdateCover(albumId: number, file?: File | null) {
    if (!token) return;
    setError(null);
    try {
      let url: string | null = (coverEdits[albumId] ?? "").trim() || null;
      if (file) {
        const up = await uploadImage(token, file);
        url = up.url;
      }
      await patchListeningCover(token, albumId, url);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Could not update cover");
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

  const titleLabel = entryType === "album" ? "Album title" : "Song title";
  const titlePlaceholder = entryType === "album" ? "e.g. OK Computer" : "e.g. Creep";

  return (
    <div style={{ marginTop: 8 }}>
      <div className="grid-2">
        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Add something you listened to</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            Choose album or song, then enter artist and title.
          </div>
          <div className="hr" />
          <form onSubmit={onAddListening}>
            <div className="field">
              <label>Entry type</label>
              <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="entryType"
                    checked={entryType === "album"}
                    onChange={() => setEntryType("album")}
                  />
                  Album
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="entryType"
                    checked={entryType === "song"}
                    onChange={() => setEntryType("song")}
                  />
                  Song
                </label>
              </div>
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>Artist</label>
              <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Radiohead" required />
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>{titleLabel}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={titlePlaceholder}
                required
              />
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>Cover image (optional)</label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                />
                <input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="Or paste URL (/uploads/… or https://…)"
                  style={{ flex: "1 1 200px", minWidth: 0 }}
                />
              </div>
            </div>
            {error ? <div className="error" style={{ marginTop: 12 }}>{error}</div> : null}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={!artist || !title || loading}>
                {loading ? "Working..." : "Add to library"}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div style={{ fontWeight: 900, fontSize: 18 }}>Your library</div>
          <div className="muted" style={{ marginTop: 6, fontWeight: 600, fontSize: 13 }}>
            {items.length} entr{items.length === 1 ? "y" : "ies"} in your listening history.
          </div>
          <div className="hr" />

          {loading ? <div className="muted">Loading...</div> : null}
          {items.length === 0 && !loading ? (
            <div className="muted" style={{ marginTop: 10 }}>
              Nothing here yet. Add your first listen to get started.
            </div>
          ) : null}

          <div className="list" style={{ marginTop: 12 }}>
            {items.map((it) => (
              <div key={it.album.id} className="item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "var(--border, #e5e5e5)",
                        flexShrink: 0,
                      }}
                    >
                      {it.coverImageUrl ? (
                        <img
                          src={it.coverImageUrl}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : null}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0 }}>
                          {it.album.artist} — {it.album.title}
                        </h3>
                        <span className="pill" style={{ fontSize: 12, textTransform: "capitalize" }}>
                          {it.type === "song" ? "Song" : "Album"}
                        </span>
                      </div>
                      <div className="muted" style={{ fontSize: 13, fontWeight: 650 }}>
                        {it.listenedAt ? `Listened: ${new Date(it.listenedAt).toLocaleString()}` : ""}
                      </div>
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

                <div style={{ marginTop: 12 }} className="field">
                  <label>Cover image</label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUpdateCover(it.album.id, f);
                        e.target.value = "";
                      }}
                    />
                    <input
                      value={coverEdits[it.album.id] ?? ""}
                      onChange={(e) =>
                        setCoverEdits((prev) => ({ ...prev, [it.album.id]: e.target.value }))
                      }
                      placeholder="Image URL"
                      style={{ flex: "1 1 160px", minWidth: 0 }}
                    />
                    <button className="btn" type="button" onClick={() => onUpdateCover(it.album.id)}>
                      Save cover
                    </button>
                  </div>
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
