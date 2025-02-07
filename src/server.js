const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const deckRoutes = require('./routes/deckRoutes');

const app = express();

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS) for frontend communication
app.use(cors());

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/decks', deckRoutes);

// Serve static files for the frontend React application
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle all other routes by serving the frontend's index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Define the server port and start listening for connections
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
