import axios from 'axios';

const API_URL = 'http://localhost:3000/api/flashcards';

export const getFlashcards = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addFlashcard = async (title, content, deckId) => {
    const response = await axios.post(API_URL, { title, content, deck_id: deckId });
    return response.data;
};

export const getFlashcardsByDeck = async (deckId) => {
    const response = await axios.get(`${API_URL}/deck/${deckId}`);
    return response.data;
};

export const getDecks = async () => {
    const response = await axios.get(`${API_URL}/decks`);
    return response.data;
};