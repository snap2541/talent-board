const Database = require('better-sqlite3');
const path = require('path');
const { randomUUID } = require('crypto');

const DB_PATH = path.join(__dirname, 'data', 'talent.db');
const db = new Database(DB_PATH);

// WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    name_ko    TEXT NOT NULL,
    slug       TEXT NOT NULL UNIQUE,
    qr_token   TEXT NOT NULL UNIQUE,
    theme      TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS points_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    delta      INTEGER NOT NULL,
    note       TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE VIEW IF NOT EXISTS user_totals AS
    SELECT u.id, u.name, u.name_ko, u.slug, u.theme, u.qr_token,
           COALESCE(SUM(p.delta), 0) AS total_points
    FROM users u
    LEFT JOIN points_log p ON p.user_id = u.id
    GROUP BY u.id;
`);

// Seed users if not exists
const seedUsers = [
  {
    name: 'Sophie Ruby',
    name_ko: '소피루비',
    slug: 'sophie',
    qr_token: `tok_sophie_${randomUUID().replace(/-/g, '').slice(0, 12)}`,
    theme: 'pink',
  },
  {
    name: 'Cinnamoroll',
    name_ko: '시나모롤',
    slug: 'cinnamoroll',
    qr_token: `tok_cinna_${randomUUID().replace(/-/g, '').slice(0, 12)}`,
    theme: 'blue',
  },
];

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, name_ko, slug, qr_token, theme)
  VALUES (@name, @name_ko, @slug, @qr_token, @theme)
`);

const seedAll = db.transaction(() => {
  for (const user of seedUsers) {
    insertUser.run(user);
  }
});

seedAll();

module.exports = db;
