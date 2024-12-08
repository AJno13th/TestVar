const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const flashcardRoutes = require('./routes/flashcardRoutes');

const app = express(); // This initializes the app

app.use(bodyParser.json());
app.use(cors());

// This serves static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes for flashcards
app.use('/api/flashcards', flashcardRoutes);

// This is a fallback route to serve the React app for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// This starts the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

