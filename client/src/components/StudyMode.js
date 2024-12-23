import React, { useState } from 'react';

const StudyMode = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    if (flashcards.length === 0) {
        return <div>No flashcards to study</div>;
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div>
            <h2>{currentCard.title}</h2>
            {showAnswer ? <p>{currentCard.content}</p> : <p>Click "Show Answer"</p>}
            <button onClick={() => setShowAnswer(!showAnswer)}>Show Answer</button>
            <button
                onClick={() => {
                    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
                    setShowAnswer(false);
                }}
            >
                Next
            </button>
        </div>
    );
};

export default StudyMode;