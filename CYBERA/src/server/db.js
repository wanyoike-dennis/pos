const sqlite3 = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'pos.db');
const db = new sqlite3(dbPath);

// Table creation
db.prepare(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    total REAL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    computer TEXT,
    duration INTEGER,
    charge REAL,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    name TEXT,
    price REAL,
    category TEXT,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    category TEXT,
    price REAL,
    quantity INTEGER
  )
`).run();

module.exports = db;