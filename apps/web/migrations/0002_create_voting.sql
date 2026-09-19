CREATE TABLE IF NOT EXISTS vote_candidates (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY NOT NULL,
  voter_name TEXT NOT NULL,
  voter_name_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vote_choices (
  vote_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  rank INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 3),
  PRIMARY KEY (vote_id, candidate_id),
  UNIQUE (vote_id, rank),
  FOREIGN KEY (vote_id) REFERENCES votes(id),
  FOREIGN KEY (candidate_id) REFERENCES vote_candidates(id)
);

INSERT OR IGNORE INTO vote_candidates (id, title) VALUES
  ('bring-her-back', 'Bring Her Back'),
  ('scary-movie-2026', 'Scary Movie (2026)'),
  ('sixth-sense', 'The Sixth Sense'),
  ('get-out', 'Get Out'),
  ('28-years-later', '28 Years Later'),
  ('28-years-later-bone-temple', '28 Years Later: The Bone Temple'),
  ('shaun-of-the-dead', 'Shaun of the Dead'),
  ('trick-r-treat', 'Trick ''r Treat'),
  ('send-help', 'Send Help'),
  ('hokum', 'Hokum'),
  ('the-witch', 'The Witch'),
  ('the-birds', 'The Birds'),
  ('backrooms', 'Backrooms'),
  ('barbarian-2022', 'Barbarian (2022)'),
  ('gremlins-1984', 'Gremlins (1984)'),
  ('practical-magic', 'Practical Magic'),
  ('practical-magic-2', 'Practical Magic 2'),
  ('buddy', 'Buddy'),
  ('resident-evil-2026', 'Resident Evil (2026)'),
  ('talk-to-me', 'Talk to Me'),
  ('scream', 'Scream'),
  ('american-werewolf-in-london', 'An American Werewolf in London'),
  ('alien', 'Alien'),
  ('the-dead-zone', 'The Dead Zone'),
  ('sinners', 'Sinners'),
  ('together', 'Together'),
  ('the-dark-and-the-wicked', 'The Dark and the Wicked'),
  ('resident-evil-original', 'Resident Evil (Original)');
