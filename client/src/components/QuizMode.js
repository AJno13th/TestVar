import React, { useState } from 'react';

const QuizMode = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);

    if (flashcards.length === 0) {
        return <div>No flashcards for the quiz</div>;
    }

    const handleAnswer = (correct) => {
        if (correct) setScore(score + 1);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    return (
        <div>
            <h2>{flashcards[currentIndex].title}</h2>
            <p>{flashcards[currentIndex].content}</p>
            <button onClick={() => handleAnswer(true)}>Correct</button>
            <button onClick={() => handleAnswer(false)}>Incorrect</button>
            <p>Score: {score}</p>
        </div>
    );
};

export default QuizMode;