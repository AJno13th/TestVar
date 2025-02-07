import React, { useState } from 'react';
import UpdateFlashcardForm from './UpdateFlashcardForm';

const FlashcardList = ({ flashcards, onDelete, onHide, token, fetchFlashcards }) => {
    const [visibleContent, setVisibleContent] = useState({});
    const [editingFlashcard, setEditingFlashcard] = useState(null);
    const [hiddenCards, setHiddenCards] = useState({}); // Track hidden flashcards

    const handleToggleContent = (id) => {
        setVisibleContent((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const startEditing = (flashcard) => setEditingFlashcard(flashcard);
    const stopEditing = () => setEditingFlashcard(null);

    const handleUpdateSuccess = () => {
        fetchFlashcards(); // Refresh the flashcard list
        stopEditing(); // Stop editing mode
    };

    const handleHide = async (id) => {
        try {
            await onHide(id); // Call the hide/unhide API
            setHiddenCards((prevState) => ({
                ...prevState,
                [id]: !prevState[id], // Toggle hidden state
            }));
        } catch (error) {
            console.error('Error hiding/unhiding flashcard:', error);
        }
    };

    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {flashcards.length === 0 ? (
                    <p>No flashcards available. Please add a new flashcard or select a different deck.</p>
                ) : (
                    [...flashcards].reverse().map((card) => (
                        <li
                            key={card.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '10px',
                                margin: '10px 0',
                                backgroundColor: hiddenCards[card.id] ? '#fff' : '#f9f9f9', // White out if hidden
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                opacity: hiddenCards[card.id] ? 0.5 : 1, // Reduce opacity if hidden
                            }}
                        >
                            {!hiddenCards[card.id] && ( // Only show content if not hidden
                                <>
                                    <strong style={{ fontSize: '18px', color: '#333' }}>{card.title}</strong>
                                    {visibleContent[card.id] && (
                                        <p style={{ marginTop: '10px', color: '#555' }}>{card.content}</p>
                                    )}
                                </>
                            )}
                            <div>
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
                                        backgroundColor: '#f0ad4e',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => startEditing(card)}
                                >
                                    Edit
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
                                <button
                                    style={{
                                        margin: '5px',
                                        padding: '5px 10px',
                                        backgroundColor: hiddenCards[card.id] ? '#28a745' : '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleHide(card.id)}
                                >
                                    {hiddenCards[card.id] ? 'Unhide' : 'Hide'}
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            {editingFlashcard && (
                <div
                    style={{
                        marginTop: '20px',
                        borderTop: '1px solid #ccc',
                        paddingTop: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        padding: '10px',
                    }}
                >
                    <h3 style={{ marginBottom: '10px', color: '#333' }}>Editing Flashcard</h3>
                    <UpdateFlashcardForm
                        flashcard={editingFlashcard}
                        token={token}
                        fetchFlashcards={handleUpdateSuccess} // Pass the success handler
                    />
                    <button
                        onClick={stopEditing}
                        style={{
                            marginTop: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#d9534f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlashcardList;