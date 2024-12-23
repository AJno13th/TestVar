import React, { useState } from 'react';

const Search = ({ flashcards, onSearchResult }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        const filtered = flashcards.filter(
            (card) =>
                card.title.toLowerCase().includes(query.toLowerCase()) ||
                card.content.toLowerCase().includes(query.toLowerCase())
        );
        onSearchResult(filtered);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search flashcards"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Search;