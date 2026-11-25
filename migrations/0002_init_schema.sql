-- Migration number: 0002 	 2026-11-19T13:35:26.150Z
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tg_id INTEGER NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE CHECK (length(username) BETWEEN 8 AND 24 AND username NOT GLOB '*[^a-z0-9]*'),
  recovery_code_hash TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  state TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE tg_id_history (
  id TEXT PRIMARY KEY,
  tg_id INTEGER NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_tg_id_history_user ON tg_id_history(user_id);

CREATE TABLE moods (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  cause TEXT,
  description TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_moods_user_date ON moods(user_id, created_at);

CREATE TABLE reminders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  local_time TEXT NOT NULL,
  fire_time INTEGER NOT NULL,
  last_sent_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_reminders_fire_time ON reminders(fire_time);
