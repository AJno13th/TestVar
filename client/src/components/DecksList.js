import React from 'react';

const DecksList = ({ decks, onDeckChange }) => {
    return (
        <div>
            <h2>Decks</h2>
            <select onChange={(e) => onDeckChange(e.target.value)}>
                <option value="">All Flashcards</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DecksList;