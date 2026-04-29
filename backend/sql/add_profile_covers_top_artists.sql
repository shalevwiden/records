-- Profile fields, listening cover art, top artists (run once on existing DBs).

ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(120);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(1000);

ALTER TABLE listenings ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(2000);

CREATE TABLE IF NOT EXISTS user_top_artists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL,
  artist_name VARCHAR(200) NOT NULL,
  CONSTRAINT uq_user_top_slot UNIQUE (user_id, slot)
);

CREATE INDEX IF NOT EXISTS ix_user_top_artists_user_id ON user_top_artists (user_id);
