-- BIWOR D1 schema
-- npx wrangler d1 execute biwor-db --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS buyers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  country TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  moq TEXT DEFAULT '',
  leadTime TEXT DEFAULT '',
  image TEXT DEFAULT '',
  featured INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT DEFAULT '',
  category TEXT DEFAULT '',
  image TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT DEFAULT '',
  type TEXT DEFAULT 'media',
  size INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT DEFAULT 'virtual',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  createdAt TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  purpose TEXT DEFAULT '',
  logo TEXT DEFAULT '',
  logoHeight INTEGER DEFAULT 48,
  "order" INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS theme (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL
);
