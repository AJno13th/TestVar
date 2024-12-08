import React, { useState, useEffect } from 'react';
import FlashcardList from './components/FlashcardList';
import AddFlashcardForm from './components/AddFlashcardForm';
import { getFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from './services/flashcardService';
import './App.css';

const App = () => {
    const [flashcards, setFlashcards] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getFlashcards();
            setFlashcards(data);
        }
        fetchData();
    }, []);

    const handleAddFlashcard = async (title, content) => {
        const newCard = await addFlashcard(title, content);
        setFlashcards([...flashcards, { id: newCard.id, title, content, hidden: false }]);
    };

    const handleToggleHidden = async (id, hidden) => {
        await updateFlashcard(id, !hidden);
        setFlashcards(
            flashcards.map((card) =>
                card.id === id ? { ...card, hidden: !hidden } : card
            )
        );
    };

    const handleDeleteFlashcard = async (id) => {
        await deleteFlashcard(id);
        setFlashcards(flashcards.filter((card) => card.id !== id));
    };

    return (
        <div className="App">
            <h1>Flashcard Study APP</h1>
            <AddFlashcardForm onAdd={handleAddFlashcard} />
            <FlashcardList
                flashcards={flashcards}
                onToggleHidden={handleToggleHidden}
                onDelete={handleDeleteFlashcard}
            />
        </div>
    );
};

export default App;