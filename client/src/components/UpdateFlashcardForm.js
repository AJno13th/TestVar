import React, { useState } from 'react';
import { updateFlashcard } from '../services/flashcardService';

const UpdateFlashcardForm = ({ flashcard, fetchFlashcards, token }) => {
    const [title, setTitle] = useState(flashcard.title);
    const [content, setContent] = useState(flashcard.content);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handles form submission to update a flashcard
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await updateFlashcard(flashcard.id, title, content, token);
            if (response && response.message === 'Flashcard updated successfully.') {
                setMessage({ type: 'success', text: 'Flashcard updated successfully!' });
                fetchFlashcards(); // Refresh the flashcard list
            } else {
                setMessage({ type: 'error', text: 'Failed to update flashcard. Please try again.' });
            }
        } catch (error) {
            console.error('Error updating flashcard:', error.response || error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Flashcard'}
            </button>
            {message && (
                <div style={{ color: message.type === 'success' ? 'green' : 'red', marginTop: '10px' }}>
                    {message.text}
                </div>
            )}
        </form>
    );
};

export default UpdateFlashcardForm;
