const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

// Load secret key from environment variable or use fallback
const SECRET_KEY =
    process.env.JWT_SECRET_KEY || 'f1d61a8e99b7ffbe04b066c935f348177d9c67fc728ed1b7ddf6e2cc65aa26593adffde2bc58b81f2695ac335d688e65a144087769b2838526e29238a0d4daa4';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.userId = user.userId; // Attach user ID to the request
        next();
    });
};

module.exports = authenticateToken;