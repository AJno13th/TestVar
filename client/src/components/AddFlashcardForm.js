import React, { useState } from 'react';
import { addFlashcard } from '../services/flashcardService';

const AddFlashcardForm = ({ currentDeck, fetchFlashcards }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Submitting flashcard:', { title, content, currentDeck });
            await addFlashcard(title, content, currentDeck);
            setTitle('');
            setContent('');
            fetchFlashcards();
        } catch (error) {
            console.error('Error adding flashcard:', error);
            alert('Failed to add flashcard. Please try again.');
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
            <input
                type="text"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit">Add Flashcard</button>
        </form>
    );
};

export default AddFlashcardForm;