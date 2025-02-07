import React from 'react'; // Import React
import { render, screen, waitFor } from '@testing-library/react';
import App from '../client/src/App'; // Ensure the correct path to App.js

describe("App Component Tests", () => {
    test("renders Flashcard Study App title", async () => {
        render(<App />);
        const titleElement = await screen.findByText(/Flashcard Study App/i);
        expect(titleElement).toBeInTheDocument();
    });

    test("renders login form when not authenticated", async () => {
        render(<App />);
        const loginForm = await screen.findByText(/Login/i);
        expect(loginForm).toBeInTheDocument();
    });

    test("renders logout button when authenticated", async () => {
        // Mock the token in localStorage to simulate an authenticated user
        localStorage.setItem("token", "mock-token");

        render(<App />);
        const logoutButton = await screen.findByText(/Logout/i);
        expect(logoutButton).toBeInTheDocument();

        // Clean up localStorage
        localStorage.removeItem("token");
    });

    test("renders decks list when authenticated", async () => {
        // Mock the token in localStorage to simulate an authenticated user
        localStorage.setItem("token", "mock-token");

        render(<App />);
        const decksList = await screen.findByText(/Decks/i);
        expect(decksList).toBeInTheDocument();

        // Clean up localStorage
        localStorage.removeItem("token");
    });
});