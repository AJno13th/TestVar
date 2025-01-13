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
    // Fetch all flashcards for a specific user
    getAllFlashcards: (user_id, callback) => {
        db.all('SELECT * FROM flashcards WHERE user_id = ?', [user_id], callback);
    },

    // Add a new flashcard with optional deck and user association
    addFlashcard: (title, content, deck_id, user_id, callback) => {
        db.run(
            'INSERT INTO flashcards (title, content, deck_id, user_id) VALUES (?, ?, ?, ?)',
            [title, content, deck_id || null, user_id || null],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    // Fetch flashcards filtered by a specific deck for a user
    getFlashcardsByDeck: (deck_id, user_id, callback) => {
        db.all(
            'SELECT * FROM flashcards WHERE deck_id = ? AND user_id = ?',
            [deck_id, user_id],
            callback
        );
    },

    // Add a new deck associated with a user
    addDeck: (name, user_id, callback) => {
        db.run(
            'INSERT INTO decks (name, user_id) VALUES (?, ?)',
            [name, user_id],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    // Fetch all decks for a specific user
    getAllDecks: (user_id, callback) => {
        db.all('SELECT * FROM decks WHERE user_id = ?', [user_id], callback);
    },
};