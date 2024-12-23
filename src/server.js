const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const flashcardRoutes = require('./routes/flashcardRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api/flashcards', flashcardRoutes);

// Fallback to serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});