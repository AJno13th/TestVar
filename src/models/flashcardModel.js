const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/testvar.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        // Flashcards table
        db.run(`
            CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                hidden BOOLEAN DEFAULT 0,
                deck_id INTEGER,
                user_id INTEGER,
                FOREIGN KEY (deck_id) REFERENCES decks(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        // Decks table
        db.run(`
            CREATE TABLE IF NOT EXISTS decks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);
    }
});

module.exports = {
    getAllFlashcards: (callback) => {
        db.all('SELECT * FROM flashcards', [], callback);
    },
    addFlashcard: (title, content, deck_id, user_id, callback) => {
        db.run(
            'INSERT INTO flashcards (title, content, deck_id, user_id) VALUES (?, ?, ?, ?)',
            [title, content, deck_id || null, user_id || null],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },
    getFlashcardsByDeck: (deck_id, callback) => {
        db.all('SELECT * FROM flashcards WHERE deck_id = ?', [deck_id], callback);
    },
    addDeck: (name, user_id, callback) => {
        db.run(
            'INSERT INTO decks (name, user_id) VALUES (?, ?)',
            [name, user_id],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },
    getAllDecks: (user_id, callback) => {
        db.all('SELECT * FROM decks WHERE user_id = ?', [user_id], callback);
    },

};