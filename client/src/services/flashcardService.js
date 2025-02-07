import axios from 'axios';

const API_URL = 'http://localhost:3000/api/flashcards';
const TELEMETRY_URL = 'http://localhost:3000/api/telemetry'; // New URL for telemetry
const ADMIN_URL = 'http://localhost:3000/api/admin'; // New URL for admin

const createHeaders = (token) => ({
    headers: { Authorization: token },
});

// Fetch all flashcards
export const getFlashcards = async (token) => {
    const response = await axios.get(API_URL, createHeaders(token));
    return response.data;
};

// Add a new flashcard
export const addFlashcard = async (title, content, deckId, token) => {
    const response = await axios.post(API_URL, { title, content, deck_id: deckId }, createHeaders(token));
    return response.data;
};

// Update an existing flashcard
export const updateFlashcard = async (id, title, content, token) => {
    const response = await axios.put(`${API_URL}/${id}`, { title, content }, createHeaders(token));
    return response.data;
};

// Delete a flashcard
export const deleteFlashcard = async (id, token) => {
    const response = await axios.delete(`${API_URL}/${id}`, createHeaders(token));
    return response.data;
};

// Fetch flashcards by deck ID
export const getFlashcardsByDeck = async (deckId, token) => {
    const response = await axios.get(`${API_URL}/deck/${deckId}`, createHeaders(token));
    return response.data;
};

// Fetch all decks
export const getDecks = async (token) => {
    const response = await axios.get(`${API_URL}/decks`, createHeaders(token));
    return response.data;
};

// Add a new deck
export const addDeck = async (name, token) => {
    const response = await axios.post(`${API_URL}/decks`, { name }, createHeaders(token));
    return response.data;
};

// Hide or unhide a flashcard
export const hideFlashcard = async (id, token) => {
    const response = await axios.post(`${API_URL}/${id}/hide`, {}, createHeaders(token));
    return response.data;
};

// Rate a deck
export const rateDeck = async (deckId, rating, token) => {
    try {
        console.log(`Sending request to rate deck: ${deckId} with rating: ${rating}`);
        const response = await axios.post(
            `http://localhost:3000/api/decks/${deckId}/rate`,
            { rating },
            createHeaders(token)
        );
        console.log('Response from rating API:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error rating deck:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fetch deck ratings
export const getDeckRatings = async (token) => {
    const response = await axios.get(`${API_URL}/ratings`, createHeaders(token));
    return response.data;
};

// Log telemetry data
export const logTelemetry = async (deckId, score, timeTaken, token) => {
    const response = await axios.post(TELEMETRY_URL + '/log', { deckId, score, timeTaken }, createHeaders(token));
    return response.data;
};

// Fetch telemetry data for a specific deck
export const getTelemetryForDeck = async (deckId, token) => {
    const response = await axios.get(`${TELEMETRY_URL}/deck/${deckId}`, createHeaders(token));
    return response.data;
};

// Fetch telemetry data for the user
export const getTelemetryForUser = async (token) => {
    const response = await axios.get(`${TELEMETRY_URL}/user`, createHeaders(token));
    return response.data;
};

// Fetch system statistics (admin only)
export const getSystemStats = async (token) => {
    const response = await axios.get(`${ADMIN_URL}/stats`, createHeaders(token));
    return response.data;
};

// Update a user's role (admin only)
export const updateUserRole = async (userId, role, token) => {
    const response = await axios.put(`${ADMIN_URL}/users/${userId}/role`, { role }, createHeaders(token));
    return response.data;
};

// Update daily limit for decks (admin only)
export const updateDailyLimit = async (limit, token) => {
    const response = await axios.post(`${ADMIN_URL}/limit`, { limit }, createHeaders(token));
    return response.data;
};
