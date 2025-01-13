import React, { useState, useEffect } from 'react';

const Search = ({ flashcards, onSearchResult }) => {
    const [query, setQuery] = useState('');
    const [originalFlashcards, setOriginalFlashcards] = useState([]);

    useEffect(() => {
        // Update original flashcards when the prop changes
        if (flashcards.length > 0) {
            setOriginalFlashcards(flashcards);
        }
    }, [flashcards]);

    const handleSearch = () => {
        const filtered = originalFlashcards.filter(
            (card) =>
                card.title.toLowerCase().includes(query.toLowerCase()) ||
                card.content.toLowerCase().includes(query.toLowerCase())
        );
        onSearchResult(filtered);
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Search flashcards"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '70%',
                    marginRight: '10px',
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#5bc0de',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Search
            </button>
        </div>
    );
};

export default Search;