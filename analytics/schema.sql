CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  path TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('view','booking','phone','email','navigation')),
  visit INTEGER NOT NULL CHECK (visit IN (0,1))
);
CREATE INDEX IF NOT EXISTS analytics_events_day ON analytics_events(day);
