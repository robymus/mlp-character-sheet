-- Character sheets table
CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    origin TEXT,
    cutie_mark TEXT,
    description TEXT,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_characters_user_name ON characters(user_id, name);
CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id);
