import React, { useState, useEffect } from 'react';

const StudyMode = ({ flashcards, currentDeck, onLogTelemetry }) => { 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Reset state when flashcards change
    useEffect(() => {
        setCurrentIndex(0);
        setShowAnswer(false);
        setSessionStartTime(new Date()); // Start the session timer
    }, [flashcards]);

    const handleSessionEnd = async () => {
        const sessionEndTime = new Date();
        const timeTaken = Math.round((sessionEndTime - sessionStartTime) / 1000);
        const score = Math.round((currentIndex / flashcards.length) * 100);
    
        // Ensure deckId is retrieved properly
        const deckId = flashcards.length > 0 ? flashcards[0].deck_id : currentDeck;
    
        console.log('Deck ID:', deckId);
        console.log('Score:', score);
        console.log('Time Taken:', timeTaken);
    
        if (!deckId) {
            console.error('Deck ID is missing. Cannot log telemetry.');
            return;
        }
    
        try {
            await onLogTelemetry(deckId, score, timeTaken);
            alert('Study session logged successfully!');
        } catch (error) {
            console.error('Error logging telemetry:', error);
            alert('Failed to log study session. Please try again.');
        }
    };

    if (flashcards.length === 0) {
        return <div style={styles.message}>No flashcards to study</div>;
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Study Mode</h2>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>{currentCard.title}</h3>
                {showAnswer ? (
                    <p style={styles.cardContent}>{currentCard.content}</p>
                ) : (
                    <p style={styles.cardHint}>Click "Show Answer" to reveal the content.</p>
                )}
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.button}
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                    <button
                        style={styles.nextButton}
                        onClick={() => {
                            if (currentIndex === flashcards.length - 1) {
                                handleSessionEnd(); // Log telemetry when the session ends
                            } else {
                                setCurrentIndex((prev) => (prev + 1) % flashcards.length);
                                setShowAnswer(false);
                            }
                        }}
                    >
                        {currentIndex === flashcards.length - 1 ? 'Finish Session' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        margin: '20px auto',
        padding: '20px',
        maxWidth: '600px',
        borderRadius: '10px',
        background: '#f3f3f3',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    card: {
        padding: '20px',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
        fontSize: '20px',
        marginBottom: '15px',
        color: '#444',
    },
    cardContent: {
        fontSize: '18px',
        color: '#555',
    },
    cardHint: {
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#777',
    },
    buttonContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        background: '#007BFF',
        color: '#fff',
        transition: 'background 0.3s',
    },
    nextButton: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        background: '#28A745',
        color: '#fff',
        transition: 'background 0.3s',
    },
    message: {
        fontSize: '18px',
        color: '#777',
    },
};

export default StudyMode;