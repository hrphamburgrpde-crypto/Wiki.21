const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/wiki.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pages (
            title TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;