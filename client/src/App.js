import React, { useState, useEffect, useContext, useCallback } from 'react';
import FlashcardList from './components/FlashcardList';
import AddFlashcardForm from './components/AddFlashcardForm';
import DecksList from './components/DecksList';
import QuizMode from './components/QuizMode';
import StudyMode from './components/StudyMode';
import Search from './components/Search';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './context/AuthContext';
import axiosInstance from './utils/axiosInstance';
import './App.css';

const App = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [originalFlashcards, setOriginalFlashcards] = useState([]);
    const [decks, setDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [mode, setMode] = useState('default');
    const [isRegistering, setIsRegistering] = useState(false);
    const { token, logout } = useContext(AuthContext);

    const fetchDecks = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/decks');
            setDecks(res.data);
        } catch (err) {
            console.error('Error fetching decks:', err);
            logout();
        }
    }, [logout]);

    const fetchFlashcards = useCallback(async () => {
        try {
            const res = currentDeck
                ? await axiosInstance.get(`/flashcards/deck/${currentDeck}`)
                : await axiosInstance.get('/flashcards');
            setFlashcards(res.data);
            setOriginalFlashcards(res.data);
        } catch (err) {
            console.error('Error fetching flashcards:', err);
            logout();
        }
    }, [currentDeck, logout]);

    useEffect(() => {
        if (token) {
            fetchDecks();
            fetchFlashcards();
        }
    }, [fetchDecks, fetchFlashcards, token]);

    const handleLogout = () => {
        logout(); // Clear token and authentication state
        setIsRegistering(false); // Ensure the app is ready for login
        setMode('default'); // Reset the mode to default
    };

    return (
        <div className="App">
            <h1>Flashcard Study APP</h1>
            {token ? (
                <>
                    <DecksList decks={decks} onDeckChange={(deckId) => setCurrentDeck(deckId)} />
                    <Search flashcards={originalFlashcards} onSearchResult={setFlashcards} />
                    <button
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setFlashcards(originalFlashcards)}
                    >
                        Reset
                    </button>
                    {mode === 'default' && (
                        <>
                            <AddFlashcardForm currentDeck={currentDeck} fetchFlashcards={fetchFlashcards} />
                            <FlashcardList flashcards={flashcards} />
                        </>
                    )}
                    {mode === 'study' && <StudyMode flashcards={flashcards} />}
                    {mode === 'quiz' && <QuizMode flashcards={flashcards} />}
                    <button
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setMode('default')}
                    >
                        Default Mode
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setMode('study')}
                    >
                        Study Mode
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#ffc107',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setMode('quiz')}
                    >
                        Quiz Mode
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </>
            ) : (
                isRegistering ? (
                    <>
                        <Register />
                        <button
                            style={{
                                padding: '10px 20px',
                                margin: '10px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsRegistering(false)}
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <Login />
                        <button
                            style={{
                                padding: '10px 20px',
                                margin: '10px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsRegistering(true)}
                        >
                            Register
                        </button>
                    </>
                )
            )}
        </div>
    );
};

export default App;