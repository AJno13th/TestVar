const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/testvar.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
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

module.exports = {
    getAllFlashcards: (callback) => {
        db.all('SELECT * FROM flashcards', [], callback);
    },
    addFlashcard: (title, content, callback) => {
        db.run(
            'INSERT INTO flashcards (title, content) VALUES (?, ?)',
            [title, content],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },
    updateFlashcard: (id, hidden, callback) => {
        db.run(
            'UPDATE flashcards SET hidden = ? WHERE id = ?',
            [hidden, id],
            callback
        );
    },
    deleteFlashcard: (id, callback) => {
        db.run('DELETE FROM flashcards WHERE id = ?', [id], callback);
    },
};