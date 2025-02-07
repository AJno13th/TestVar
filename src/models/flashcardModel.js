const db = require('/Users/ossai/TestVar/database/initDB.js');

module.exports = {
    // Retrieves all flashcards for a given user, marking hidden flashcards
    getAllFlashcards: (user_id, callback) => {
        db.all(
            `SELECT flashcards.*, user_hidden_cards.card_id IS NOT NULL AS hidden
             FROM flashcards
             LEFT JOIN user_hidden_cards ON flashcards.id = user_hidden_cards.card_id AND user_hidden_cards.user_id = ?
             WHERE flashcards.user_id = ?`,
            [user_id, user_id],
            callback
        );
    },
    
    // Adds a new flashcard to a specific deck or as a standalone flashcard
    addFlashcard: (title, content, deck_id, user_id, callback) => {
        db.run(
            'INSERT INTO flashcards (title, content, deck_id, user_id) VALUES (?, ?, ?, ?)',
            [title, content, deck_id || null, user_id],
            function (err) {
                callback(err, this?.lastID); // Returns the last inserted flashcard ID
            }
        );
    },
    
    // Retrieves flashcards belonging to a specific deck for a given user
    getFlashcardsByDeck: (deck_id, user_id, callback) => {
        db.all(
            `SELECT flashcards.*, user_hidden_cards.card_id IS NOT NULL AS hidden
             FROM flashcards
             LEFT JOIN user_hidden_cards ON flashcards.id = user_hidden_cards.card_id AND user_hidden_cards.user_id = ?
             WHERE flashcards.deck_id = ? AND flashcards.user_id = ?`,
            [user_id, deck_id, user_id],
            callback
        );
    },
    
    // Updates the title and content of an existing flashcard
    updateFlashcard: (id, title, content, user_id, callback) => {
        db.run(
            'UPDATE flashcards SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, id, user_id],
            callback
        );
    },
    
    // Deletes a flashcard owned by the user
    deleteFlashcard: (id, user_id, callback) => {
        db.run(
            'DELETE FROM flashcards WHERE id = ? AND user_id = ?',
            [id, user_id],
            callback
        );
    },
};
