const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/testvar.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                hidden BOOLEAN DEFAULT 0
            )`
        );
    }
});

module.exports = db;