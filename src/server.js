const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const flashcardRoutes = require('./routes/flashcardRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Load secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'f1d61a8e99b7ffbe04b066c935f348177d9c67fc728ed1b7ddf6e2cc65aa26593adffde2bc58b81f2695ac335d688e65a144087769b2838526e29238a0d4daa4';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/flashcards', flashcardRoutes);

// Fallback to serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`JWT Secret Key Loaded: ${SECRET_KEY ? 'Yes' : 'No'}`); // Confirm secret key is loaded
});