const request = require("supertest");
const app = require("../src/server");

describe("API Tests", () => {
    let token; // To store the authentication token

    beforeAll(async () => {
        // Clean up any existing test user to avoid conflicts
        await request(app)
            .delete("/api/users/cleanup")
            .send({ email: "testuser@example.com" });

        // Register a new user
        const registerResponse = await request(app)
            .post("/api/users/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                password: "password123",
            });

        if (registerResponse.statusCode !== 201) {
            console.log("User may already exist. Proceeding with login...");
        }

        // Log in to get the token
        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "testuser@example.com",
                password: "password123",
            });

        if (loginResponse.statusCode !== 200) {
            throw new Error("Login failed: " + JSON.stringify(loginResponse.body));
        }

        token = loginResponse.body.token;
        console.log("Generated Token:", token);
    });

    describe("Flashcards Endpoints", () => {
        let flashcardId; // To store the ID of the created flashcard

        test("Should create a flashcard", async () => {
            const res = await request(app)
                .post("/api/flashcards")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Sample Flashcard",
                    content: "This is a test flashcard.",
                    deck_id: 1,
                });
            expect(res.statusCode).toBe(201);
            expect(res.body.id).toBeDefined();
            flashcardId = res.body.id; // Save the flashcard ID for later tests
        });

        test("Should retrieve all flashcards", async () => {
            const res = await request(app)
                .get("/api/flashcards")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        test("Should delete the created flashcard", async () => {
            const res = await request(app)
                .delete(`/api/flashcards/${flashcardId}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
        });
    });

    describe("Deck Endpoints", () => {
        let deckId; // To store the ID of the created deck

        test("Should create a deck", async () => {
            const res = await request(app)
                .post("/api/decks")
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Test Deck" });
            expect(res.statusCode).toBe(201);
            expect(res.body.id).toBeDefined();
            deckId = res.body.id; // Save the deck ID for later tests
            console.log("Created Deck ID:", deckId);
        });

        test("Should retrieve all decks", async () => {
            const res = await request(app)
                .get("/api/decks")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        test("Should delete the created deck", async () => {
            const res = await request(app)
                .delete(`/api/decks/${deckId}`)
                .set("Authorization", `Bearer ${token}`);
            console.log("Delete Deck Response:", res.statusCode, res.body); // Add logging for debugging
            expect(res.statusCode).toBe(200);
        });
    });

    afterAll(async () => {
        console.log("Tests completed.");
    });
});