import React, { useState } from 'react';

const QuizMode = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);

    if (flashcards.length === 0) {
        return <div>No flashcards for the quiz</div>;
    }

    const handleNextCard = () => {
        setShowAnswer(false); // Hide the answer for the next card
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length); // Cycle through cards
    };

    const handleAnswer = (correct) => {
        if (correct) setScore(score + 1); // Update the score for a correct answer
        handleNextCard(); // Move to the next card
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div>
            <h2>Quiz Mode</h2>
            <div>
                <strong>{currentCard.title}</strong>
                {!showAnswer && <p>Click "Show Answer" to reveal the answer.</p>}
                {showAnswer && <p>{currentCard.content}</p>}
                <button onClick={() => setShowAnswer(true)}>Show Answer</button>
            </div>
            {showAnswer && (
                <div>
                    <button onClick={() => handleAnswer(true)}>Correct</button>
                    <button onClick={() => handleAnswer(false)}>Incorrect</button>
                </div>
            )}
            <div>
                <p>Score: {score}</p>
            </div>
        </div>
    );
};

export default QuizMode;