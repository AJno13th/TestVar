import React, { useState, useEffect, useCallback } from 'react';
import FlashcardList from './components/FlashcardList';
import AddFlashcardForm from './components/AddFlashcardForm';
import DecksList from './components/DecksList';
import QuizMode from './components/QuizMode';
import StudyMode from './components/StudyMode';
import Search from './components/Search';
import Register from './components/Register';
import Login from './components/Login';
import TelemetryStats from './components/TelemetryStats'; // New component for telemetry
import AdminPanel from './components/AdminPanel'; // New component for admin features
import {
    getFlashcards,
    getDecks,
    getFlashcardsByDeck,
    deleteFlashcard,
    hideFlashcard,
    rateDeck,
    logTelemetry,
    getTelemetryForDeck,
    getTelemetryForUser,
    getSystemStats,
    updateUserRole,
    updateDailyLimit,
} from './services/flashcardService'; // Updated service functions
import './App.css';

const App = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [originalFlashcards, setOriginalFlashcards] = useState([]); // Store the unfiltered flashcards
    const [decks, setDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState(null); // Currently selected deck
    const [mode, setMode] = useState('default');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAdmin, setIsAdmin] = useState(false); // New state for admin role
    const [telemetryData, setTelemetryData] = useState([]); // New state for telemetry data
    const [systemStats, setSystemStats] = useState(null); // New state for system stats

    // Fetch decks
    const fetchDecks = useCallback(async () => {
        if (!token) return;
        try {
            const data = await getDecks(token);
            setDecks(data);
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }, [token]);

    // Fetch flashcards dynamically based on the current deck
    const fetchFlashcards = useCallback(async () => {
        if (!token) return;
        try {
            let data;
            if (currentDeck) {
                data = await getFlashcardsByDeck(currentDeck, token);
            } else {
                data = await getFlashcards(token);
            }
            setFlashcards(data);
            setOriginalFlashcards(data); // Save the original flashcards for search reset
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }, [token, currentDeck]);

    // Fetch telemetry data for the current deck
    const fetchTelemetryForDeck = useCallback(async () => {
        if (!token || !currentDeck) return;
        try {
            const data = await getTelemetryForDeck(currentDeck, token);
            setTelemetryData(data || []); // Ensure data is an array
        } catch (error) {
            console.error('Error fetching telemetry data:', error);
            setTelemetryData([]); // Reset to empty array on error
        }
    }, [token, currentDeck]);

    // Fetch system statistics (admin only)
    const fetchSystemStats = useCallback(async () => {
        if (!token || !isAdmin) return;
        try {
            const data = await getSystemStats(token);
            setSystemStats(data);
        } catch (error) {
            console.error('Error fetching system stats:', error);
        }
    }, [token, isAdmin]);

    // Check if the user is an admin
    const checkAdminStatus = useCallback(async () => {
        if (!token) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setIsAdmin(user?.role === 'admin');
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchDecks();
        fetchFlashcards();
        fetchTelemetryForDeck();
        checkAdminStatus();
        if (isAdmin) {
            fetchSystemStats();
        }
    }, [fetchDecks, fetchFlashcards, fetchTelemetryForDeck, checkAdminStatus, isAdmin, fetchSystemStats]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setIsAdmin(false);
    };

    const handleDeleteFlashcard = async (id) => {
        try {
            await deleteFlashcard(id, token);
            fetchFlashcards(); // Refresh the flashcards after deletion
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    };

    const handleHideFlashcard = async (id) => {
        try {
            await hideFlashcard(id, token);
            fetchFlashcards(); // Refresh the flashcards after hiding
        } catch (error) {
            console.error('Error hiding flashcard:', error);
        }
    };

    const handleRateDeck = async (deckId, rating) => {
        try {
            await rateDeck(deckId, rating, token);
            fetchDecks(); // Refresh the decks after rating
        } catch (error) {
            console.error('Error rating deck:', error);
        }
    };

    const handleLogTelemetry = async (deckId, score, timeTaken) => {
        if (!token) {
            console.error("No token found, cannot log telemetry.");
            alert("You need to log in to track progress.");
            return;
        }
    
        try {
            await logTelemetry(deckId, score, timeTaken, token);
            fetchTelemetryForDeck(); // Refresh telemetry data after logging
        } catch (error) {
            console.error('Error logging telemetry:', error);
        }
    };

    const handleSearchResult = (results) => {
        setFlashcards(results); // Update flashcards with search results
    };

    return (
        <div className="App">
            <h1>Flashcard Study App</h1>
            {!token ? (
                <>
                    <Login onLogin={(token, user) => {
                        setToken(token);
                        setIsAdmin(user?.role === 'admin');
                    }} />
                    <Register />
                </>
            ) : (
                <>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                    <DecksList
                        decks={decks}
                        onDeckChange={(deckId) => {
                            setCurrentDeck(deckId);
                            setFlashcards([]); // Clear flashcards briefly while fetching
                            fetchFlashcards(); // Fetch new flashcards for the selected deck
                        }}
                        onRateDeck={handleRateDeck} // Pass rateDeck handler
                    />
                    <Search flashcards={originalFlashcards} onSearchResult={handleSearchResult} />
                    {mode === 'default' && (
                        <>
                            <AddFlashcardForm
                                currentDeck={currentDeck}
                                token={token}
                                fetchFlashcards={fetchFlashcards}
                            />
                            <FlashcardList
                                flashcards={flashcards}
                                token={token}
                                fetchFlashcards={fetchFlashcards}
                                onDelete={handleDeleteFlashcard}
                                onHide={handleHideFlashcard} // Pass hideFlashcard handler
                            />
                        </>
                    )}
                    {mode === 'study' && <StudyMode flashcards={flashcards} currentDeck={currentDeck} onLogTelemetry={handleLogTelemetry} />}
                    {mode === 'quiz' && <QuizMode flashcards={flashcards} currentDeck={currentDeck} onLogTelemetry={handleLogTelemetry} />}
                    <div className="mode-buttons">
                        <button onClick={() => setMode('default')}>Default Mode</button>
                        <button onClick={() => setMode('study')}>Study Mode</button>
                        <button onClick={() => setMode('quiz')}>Quiz Mode</button>
                    </div>
                    {isAdmin && <AdminPanel stats={systemStats} onUpdateLimit={updateDailyLimit} onUpdateRole={updateUserRole} />}
                    <TelemetryStats data={telemetryData} />
                </>
            )}
        </div>
    );
};

export default App;