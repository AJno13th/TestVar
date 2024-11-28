const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flashcardRoutes = require('./routes/flashcardRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Use the flashcard routes for /api/flashcards
app.use('/api/flashcards', flashcardRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});