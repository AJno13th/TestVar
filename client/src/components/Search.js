import React, { useState, useEffect, useCallback } from 'react';

const Search = ({ flashcards, onSearchResult }) => {
    const [query, setQuery] = useState('');
    const [originalFlashcards, setOriginalFlashcards] = useState([]);

    useEffect(() => {
        setOriginalFlashcards(flashcards);
    }, [flashcards]);

    const handleSearch = useCallback(() => {
        if (!query.trim()) {
            onSearchResult(originalFlashcards); // Reset to original flashcards if the query is empty
            return;
        }

        const filtered = originalFlashcards.filter(
            (card) =>
                card.title.toLowerCase().includes(query.toLowerCase()) ||
                card.content.toLowerCase().includes(query.toLowerCase())
        );
        onSearchResult(filtered);
    }, [query, originalFlashcards, onSearchResult]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300); // 300ms debounce delay

        return () => clearTimeout(delayDebounceFn);
    }, [query, handleSearch]); // Add handleSearch to the dependency array

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
        </div>
    );
};

export default Search;