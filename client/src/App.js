import React, { useState, useEffect } from 'react';
import FlashcardList from './components/FlashcardList';
import AddFlashcardForm from './components/AddFlashcardForm';
import DecksList from './components/DecksList';
import QuizMode from './components/QuizMode';
import StudyMode from './components/StudyMode';
import Search from './components/Search';
import { getFlashcards, getFlashcardsByDeck, getDecks } from './services/flashcardService';
import './App.css';

const App = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [decks, setDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [mode, setMode] = useState('default'); // 'default', 'study', 'quiz'

    useEffect(() => {
        fetchDecks();
        fetchFlashcards();
    }, [currentDeck]);

    const fetchDecks = async () => {
        const data = await getDecks();
        setDecks(data);
    };

    const fetchFlashcards = async () => {
        if (currentDeck) {
            const data = await getFlashcardsByDeck(currentDeck);
            setFlashcards(data);
        } else {
            const data = await getFlashcards();
            setFlashcards(data);
        }
    };

    const handleDeckChange = (deckId) => {
        setCurrentDeck(deckId);
    };

    return (
        <div className="App">
            <h1>Flashcard Study APP</h1>
            <DecksList decks={decks} onDeckChange={handleDeckChange} />
            <Search flashcards={flashcards} onSearchResult={setFlashcards} />
            {mode === 'default' && (
                <>
                    <AddFlashcardForm currentDeck={currentDeck} fetchFlashcards={fetchFlashcards} />
                    <FlashcardList flashcards={flashcards} />
                </>
            )}
            {mode === 'study' && <StudyMode flashcards={flashcards} />}
            {mode === 'quiz' && <QuizMode flashcards={flashcards} />}
            <button onClick={() => setMode('default')}>Default Mode</button>
            <button onClick={() => setMode('study')}>Study Mode</button>
            <button onClick={() => setMode('quiz')}>Quiz Mode</button>
        </div>
    );
};

export default App;