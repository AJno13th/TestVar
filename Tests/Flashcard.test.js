const request = require("supertest");
const app = require("/Users/ossai/TestVar/src/server.js"); // Import your Express app

describe("User Authentication and Flashcard API", () => {
    let token;
    let cardId;

    test("Should register a new user", async () => {
        const response = await request(app)
            .post("/api/users/register") //can be modified for new tests
            .send({ 
                username: "anthony3",  
                email: "Anthony3@gmail.com", 
                password: "London123" 
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully.");
    });

    test("Should log in and retrieve JWT token", async () => {
        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({ 
                email: "Anthony3@gmail.com", 
                password: "London123" 
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.token).toBeDefined();

        token = loginResponse.body.token; // Store the token for authentication
    });

    test("Should create, retrieve, update, and delete a flashcard", async () => {
        // Create a new flashcard
        const newCardRes = await request(app)
            .post("/api/flashcards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Card", content: "Definition" });

        expect(newCardRes.status).toBe(201);
        cardId = newCardRes.body.id;
        expect(cardId).toBeDefined();

        // Retrieve the created flashcard
        const retrievedCardRes = await request(app)
            .get(`/api/flashcards/${cardId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(retrievedCardRes.status).toBe(200);
        expect(retrievedCardRes.body.title).toBe("Test Card");

        // Update the flashcard
        await request(app)
            .put(`/api/flashcards/${cardId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Title", content: "Updated Definition" });

        // Retrieve updated flashcard
        const updatedCardRes = await request(app)
            .get(`/api/flashcards/${cardId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(updatedCardRes.status).toBe(200);
        expect(updatedCardRes.body.title).toBe("Updated Title");

        // Delete the flashcard
        const deleteRes = await request(app)
            .delete(`/api/flashcards/${cardId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);

        // Verify deletion
        const deletedCardRes = await request(app)
            .get(`/api/flashcards/${cardId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deletedCardRes.status).toBe(404);
    });
});