const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/testvar.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create users table
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user'
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table ready.');
                }
            }
        );

        // Create decks table
        db.run(
            `CREATE TABLE IF NOT EXISTS decks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating decks table:', err.message);
                } else {
                    console.log('Decks table ready.');
                }
            }
        );

        // Create flashcards table
        db.run(
            `CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                hidden BOOLEAN DEFAULT 0,
                deck_id INTEGER,
                user_id INTEGER,
                FOREIGN KEY (deck_id) REFERENCES decks (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating flashcards table:', err.message);
                } else {
                    console.log('Flashcards table ready.');
                }
            }
        );
    }
});

module.exports = db;