-- Run once against an existing database (new installs get this column from SQLAlchemy create_all).
ALTER TABLE listenings
  ADD COLUMN IF NOT EXISTS entry_type VARCHAR(16) NOT NULL DEFAULT 'album';

CREATE INDEX IF NOT EXISTS ix_listenings_entry_type ON listenings (entry_type);
