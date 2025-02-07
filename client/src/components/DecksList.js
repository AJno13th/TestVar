import React, { useState, useEffect } from 'react';
import { rateDeck, getDeckRatings } from '../services/flashcardService';

const DecksList = ({ decks, onDeckChange, token }) => {
    const [ratings, setRatings] = useState({});

    // Fetch ratings when the component mounts
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const data = await getDeckRatings(token);
                const ratingsMap = data.reduce((acc, rating) => {
                    acc[rating.deck_id] = rating.rating;
                    return acc;
                }, {});
                setRatings(ratingsMap);
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, [token]);

    // Handles deck rating selection
    const handleRateDeck = async (deckId, rating) => {
        try {
            console.log(`Clicked rating button for deck ${deckId} with rating ${rating}`);
    
            // Send rating request to backend
            const response = await rateDeck(deckId, rating, token);
            console.log('API Response:', response);
    
            if (response.message === 'Deck rated successfully.') {
                setRatings((prevRatings) => ({
                    ...prevRatings,
                    [deckId]: rating, // Update UI rating state
                }));
            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error rating deck:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2>Decks</h2>
            {/* Dropdown for selecting a deck */}
            <select onChange={(e) => onDeckChange(e.target.value)}>
                <option value="">All Flashcards</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name} (Rating: {ratings[deck.id] || 'Not rated'})
                    </option>
                ))}
            </select>
            
            {/* Display deck names and rating buttons */}
            <div>
                {decks.map((deck) => (
                    <div key={deck.id} style={{ margin: '10px 0' }}>
                        <span>{deck.name}</span>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    style={{
                                        margin: '2px',
                                        padding: '5px',
                                        backgroundColor: ratings[deck.id] >= star ? '#ffc107' : '#e9ecef',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRateDeck(deck.id, star)}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DecksList;
