import { render, fireEvent, screen, act } from "@testing-library/react";
import Search from "../components/Search";

describe("Search Component", () => {
    let mockOnSearchResult;
    const flashcards = [
        { title: "React", content: "JavaScript library" },
        { title: "Node.js", content: "Server-side JavaScript runtime" },
        { title: "Express", content: "Web framework for Node.js" },
    ];

    beforeEach(() => {
        mockOnSearchResult = jest.fn();
        render(<Search flashcards={flashcards} onSearchResult={mockOnSearchResult} />);
    });

    test("Should filter flashcards based on user input", async () => {
        fireEvent.change(screen.getByPlaceholderText("Search flashcards"), {
            target: { value: "React" },
        });

        // Wait for debounce effect
        await act(() => new Promise((resolve) => setTimeout(resolve, 350)));

        expect(mockOnSearchResult).toHaveBeenCalledWith([
            { title: "React", content: "JavaScript library" },
        ]);
    });

    test("Should handle case-insensitive search", async () => {
        fireEvent.change(screen.getByPlaceholderText("Search flashcards"), {
            target: { value: "react" }, // Lowercase input
        });

        // Wait for debounce effect
        await act(() => new Promise((resolve) => setTimeout(resolve, 350)));

        expect(mockOnSearchResult).toHaveBeenCalledWith([
            { title: "React", content: "JavaScript library" },
        ]);
    });

    test("Should show no results when no matches are found", async () => {
        fireEvent.change(screen.getByPlaceholderText("Search flashcards"), {
            target: { value: "Python" }, // No matching flashcards
        });

        // Wait for debounce effect
        await act(() => new Promise((resolve) => setTimeout(resolve, 350)));

        expect(mockOnSearchResult).toHaveBeenCalledWith([]);
    });

    test("Should show all flashcards when input is cleared", async () => {
        fireEvent.change(screen.getByPlaceholderText("Search flashcards"), {
            target: { value: "React" },
        });

        await act(() => new Promise((resolve) => setTimeout(resolve, 350)));

        fireEvent.change(screen.getByPlaceholderText("Search flashcards"), {
            target: { value: "" },
        });

        await act(() => new Promise((resolve) => setTimeout(resolve, 350)));

        expect(mockOnSearchResult).toHaveBeenCalledWith(flashcards);
    });
});