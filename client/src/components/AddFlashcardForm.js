import React, { useState, useEffect } from 'react';
import { addFlashcard, getDecks } from '../services/flashcardService';

const AddFlashcardForm = ({ fetchFlashcards, token }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState('');
    const [newDeckName, setNewDeckName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch decks when the component mounts
    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const data = await getDecks(token);
                setDecks(data);
            } catch (error) {
                console.error('Error fetching decks:', error);
            }
        };

        fetchDecks();
    }, [token]);

    // Handles adding a new deck
    const handleAddDeck = async () => {
        if (!newDeckName) {
            setMessage('Please provide a name for the new deck.');
            return;
        }
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost:3000/api/flashcards/decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ name: newDeckName }),
            });
            const newDeck = await response.json();
            setDecks([...decks, newDeck]);
            setSelectedDeck(newDeck.id);
            setNewDeckName('');
            setMessage('Deck added successfully!');
        } catch (error) {
            console.error('Error adding deck:', error);
            setMessage('Failed to add new deck. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handles form submission for adding a new flashcard
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDeck) {
            setMessage('Please select a deck.');
            return;
        }
        setIsLoading(true);
        setMessage('');
        try {
            const response = await addFlashcard(title, content, selectedDeck, token);
            if (response && response.id) {
                setTitle('');
                setContent('');
                fetchFlashcards(); // Refresh the flashcard list
                setMessage('Flashcard added successfully!');
            } else {
                setMessage('Failed to add flashcard. Please try again.');
            }
        } catch (error) {
            console.error('Error adding flashcard:', error);
            setMessage('Failed to add flashcard. Please try again.');
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
            <input
                type="text"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <select
                value={selectedDeck}
                onChange={(e) => setSelectedDeck(e.target.value)}
                required
            >
                <option value="" disabled>Select a deck</option>
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                        {deck.name}
                    </option>
                ))}
            </select>
            <div>
                <input
                    type="text"
                    placeholder="New deck name"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                />
                <button type="button" onClick={handleAddDeck} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add New Deck'}
                </button>
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Flashcard'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default AddFlashcardForm;
