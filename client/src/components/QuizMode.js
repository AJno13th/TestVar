import React, { useState, useEffect, useCallback } from 'react';
import { logTelemetry } from '../services/flashcardService';

const QuizMode = ({ flashcards, currentDeck, onLogTelemetry }) => { 
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [questionType, setQuestionType] = useState('content-to-name'); // 'content-to-name' or 'name-to-content'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Wrap the generateQuestion function in useCallback to memoize it
    const generateQuestion = useCallback((type) => {
        const isContentToName = type === 'content-to-name';
        const correctFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)];
        const incorrectFlashcards = flashcards
            .filter((fc) => fc.id !== correctFlashcard.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

        const options = [...incorrectFlashcards, correctFlashcard].sort(() => 0.5 - Math.random());

        return {
            question: isContentToName ? correctFlashcard.content : correctFlashcard.title,
            options: options.map((fc) => (isContentToName ? fc.title : fc.content)),
            correctAnswer: isContentToName ? correctFlashcard.title : correctFlashcard.content,
        };
    }, [flashcards]); // Depend on flashcards to memoize the function

    // Reset state when flashcards change
    useEffect(() => {
        if (flashcards.length >= 3) {
            setScore(0);
            setGameOver(false);
            setCurrentQuestion(generateQuestion(questionType));
            setSessionStartTime(new Date()); // Start the session timer
        }
    }, [flashcards, questionType, generateQuestion]);  // Added generateQuestion to dependencies

    const handleSessionEnd = async () => {
        const sessionEndTime = new Date();
        const timeTaken = Math.round((sessionEndTime - sessionStartTime) / 1000);
        const scorePercentage = Math.round((score / flashcards.length) * 100);
    
        // Ensure deckId is retrieved properly
        const deckId = flashcards.length > 0 ? flashcards[0].deck_id : currentDeck;
        
        console.log('Deck ID:', deckId);
        console.log('Score:', scorePercentage);
        console.log('Time Taken:', timeTaken);
    
        if (!deckId) {
            console.error('Deck ID is missing. Cannot log telemetry.');
            return;
        }
    
        try {
            await onLogTelemetry(deckId, scorePercentage, timeTaken);
            alert('Quiz session logged successfully!');
        } catch (error) {
            console.error('Error logging telemetry:', error);
            alert('Failed to log quiz session. Please try again.');
        }
    };

    if (flashcards.length < 3) {
        return <div style={styles.message}>You need at least 3 flashcards to play the quiz.</div>;
    }

    const handleAnswer = (selectedOption) => {
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + 1);
            alert('Correct!');
        } else {
            alert('Incorrect!');
        }
        setCurrentQuestion(generateQuestion(questionType));
    };

    const handleSwitchMode = (type) => {
        setQuestionType(type);
        setCurrentQuestion(generateQuestion(type)); // Regenerate question for the new mode
    };

    const handleEndGame = () => {
        setGameOver(true);
        handleSessionEnd(); // Log telemetry when the game ends
    };

    const handleRestartGame = () => {
        setScore(0);
        setGameOver(false);
        setCurrentQuestion(generateQuestion(questionType));
        setSessionStartTime(new Date()); // Reset the session timer
    };

    if (!currentQuestion) {
        return <div>Loading quiz...</div>;
    }

    return (
        <div style={styles.container}>
            {gameOver ? (
                <div style={styles.messageBox}>
                    <h2 style={styles.heading}>Game Over</h2>
                    <p style={styles.scoreText}>Your final score: {score}</p>
                    <button style={styles.button} onClick={handleRestartGame}>Restart Game</button>
                </div>
            ) : (
                <div>
                    <h2 style={styles.heading}>Quiz Mode</h2>
                    <p style={styles.scoreText}>Score: {score}</p>
                    <p style={styles.subheading}>
                        {questionType === 'content-to-name'
                            ? 'Match the content to the name:'
                            : 'Match the name to the content:'}
                    </p>
                    <div style={styles.questionBox}>
                        <h3 style={styles.question}>{currentQuestion.question}</h3>
                        <div style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    style={styles.optionButton}
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={styles.modeSwitch}>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(questionType === 'content-to-name' ? styles.activeMode : {}),
                            }}
                            onClick={() => handleSwitchMode('content-to-name')}
                        >
                            Content to Name
                        </button>
                        <button
                            style={{
                                ...styles.modeButton,
                                ...(questionType === 'name-to-content' ? styles.activeMode : {}),
                            }}
                            onClick={() => handleSwitchMode('name-to-content')}
                        >
                            Name to Content
                        </button>
                    </div>
                    <button style={styles.endGameButton} onClick={handleEndGame}>
                        End Game
                    </button>
                </div>
            )}
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
        background: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '10px',
        color: '#333',
    },
    subheading: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#555',
    },
    scoreText: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#777',
    },
    questionBox: {
        marginBottom: '20px',
        padding: '15px',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    question: {
        fontSize: '20px',
        marginBottom: '20px',
    },
    optionsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    optionButton: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        background: '#007BFF',
        color: '#fff',
        transition: 'background 0.3s',
    },
    modeSwitch: {
        marginTop: '20px',
    },
    modeButton: {
        margin: '5px',
        padding: '10px 15px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        cursor: 'pointer',
        background: '#f0f0f0',
        transition: 'background 0.3s',
    },
    activeMode: {
        background: '#007BFF',
        color: '#fff',
        border: 'none',
    },
    endGameButton: {
        marginTop: '20px',
        padding: '10px 15px',
        fontSize: '14px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        background: '#FF4136',
        color: '#fff',
        transition: 'background 0.3s',
    },
    messageBox: {
        padding: '20px',
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    message: {
        fontSize: '18px',
        color: '#777',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        background: '#007BFF',
        color: '#fff',
        transition: 'background 0.3s',
    },
};

export default QuizMode;