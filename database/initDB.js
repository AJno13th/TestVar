const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/testvar.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
        return;
    }

    console.log('Connected to the SQLite database.');

    const createTables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            hidden BOOLEAN DEFAULT 0,
            deck_id INTEGER,
            user_id INTEGER,
            FOREIGN KEY (deck_id) REFERENCES decks(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS user_hidden_cards (
            user_id INTEGER,
            card_id INTEGER,
            PRIMARY KEY(user_id, card_id),
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(card_id) REFERENCES flashcards(id)
        )`,
        `CREATE TABLE IF NOT EXISTS ratings (
            deck_id INTEGER,
            user_id INTEGER,
            rating INTEGER CHECK(rating BETWEEN 1 AND 5),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(deck_id, user_id),
            FOREIGN KEY(deck_id) REFERENCES decks(id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`,
        `CREATE TABLE IF NOT EXISTS telemetry (
            user_id INTEGER,
            deck_id INTEGER,
            score INTEGER,
            time_taken INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(deck_id) REFERENCES decks(id)
        )`
    ];

    // Run table creation synchronously
    createTables.forEach((query) => {
        db.run(query, (err) => {
            if (err) console.error('Error creating table:', err.message);
        });
    });

    // Create the settings table first, then insert default settings
    db.run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`, (err) => {
        if (err) {
            console.error('Error creating settings table:', err.message);
        } else {
            // Ensure the settings table exists before inserting the default setting
            db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('daily_deck_limit', '20')`, (err) => {
                if (err) console.error('Error inserting default setting:', err.message);
            });
        }
    });

    // Alter decks table to add is_public column
    db.run(`ALTER TABLE decks ADD COLUMN is_public BOOLEAN DEFAULT 0`, (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error('Error adding is_public column:', err.message);
        }
    });
});

module.exports = db;