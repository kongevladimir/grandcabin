CREATE TABLE IF NOT EXISTS snapshots (snapshot TEXT PRIMARY KEY, chunks INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS snapshot_chunks (snapshot TEXT NOT NULL, part INTEGER NOT NULL, content TEXT NOT NULL, PRIMARY KEY (snapshot, part));
