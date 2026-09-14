CREATE TABLE IF NOT EXISTS nominations (
  id TEXT PRIMARY KEY NOT NULL,
  nominator_name TEXT NOT NULL,
  movie_one TEXT NOT NULL,
  movie_two TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_nominations_created_at ON nominations(created_at);
