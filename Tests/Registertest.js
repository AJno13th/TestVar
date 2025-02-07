const request = require('supertest');
const app = require('../server'); 

test("Should register a new user", async () => {
    const response = await request(app)
        .post("/api/users/register")
        .send({ username: "anthony3", email: "Anthony3@gmail.com", password: "London123" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully.");
});

