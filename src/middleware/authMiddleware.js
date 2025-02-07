const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate users using JWT
module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied.');

    try {
        // Verify the provided token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).send('Invalid token.');
    }
};
