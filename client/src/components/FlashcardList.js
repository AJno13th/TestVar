import React, { useState } from 'react';

const FlashcardList = ({ flashcards, onToggleHidden, onDelete }) => {
    // State to manage which flashcard's content is visible
    const [visibleContent, setVisibleContent] = useState({});

    const handleToggleContent = (id) => {
        // Toggle visibility of the flashcard content
        setVisibleContent((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {flashcards.map((card) => (
                <li
                    key={card.id}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <strong>{card.title}</strong>
                    {visibleContent[card.id] && (
                        <p style={{ marginTop: '10px', color: '#555' }}>{card.content}</p>
                    )}
                    <button
                        style={{
                            margin: '5px',
                            padding: '5px 10px',
                            backgroundColor: visibleContent[card.id] ? '#d9534f' : '#5bc0de',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleToggleContent(card.id)}
                    >
                        {visibleContent[card.id] ? 'Hide' : 'Show'}
                    </button>
                    <button
                        style={{
                            margin: '5px',
                            padding: '5px 10px',
                            backgroundColor: '#d9534f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={() => onDelete(card.id)}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default FlashcardList;