import axios from 'axios';

const API_URL = 'http://localhost:3000/api/flashcards';

export const getFlashcards = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addFlashcard = async (title, content) => {
    const response = await axios.post(API_URL, { title, content });
    return response.data;
};

export const updateFlashcard = async (id, hidden) => {
    const response = await axios.patch(`${API_URL}/${id}`, { hidden });
    return response.data;
};

export const deleteFlashcard = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};