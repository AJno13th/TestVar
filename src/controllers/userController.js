const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'f1d61a8e99b7ffbe04b066c935f348177d9c67fc728ed1b7ddf6e2cc65aa26593adffde2bc58b81f2695ac335d688e65a144087769b2838526e29238a0d4daa4';

module.exports = {
    register: (req, res) => {
        const { username, email, password } = req.body;

        console.log('Register endpoint hit:', req.body); // Log request payload

        if (!username || !email || !password) {
            return res.status(400).send('All fields are required.');
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        userModel.registerUser(username, email, hashedPassword, (err, userId) => {
            if (err) {
                console.error('Error during registration:', err.message);
                if (err.message.includes('UNIQUE constraint failed')) {
                    res.status(400).send('Username or email already exists.');
                } else {
                    res.status(500).send('Internal server error.');
                }
            } else {
                console.log('User registered successfully with ID:', userId);
                res.status(201).json({ id: userId });
            }
        });
    },
    login: (req, res) => {
        const { email, password } = req.body;

        console.log('Login attempt with:', email);

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        userModel.authenticateUser(email, password, (err, user) => {
            if (err) {
                console.error('Error during authentication:', err.message);
                res.status(500).send('Internal server error.');
            } else if (!user) {
                console.log('Invalid credentials for:', email);
                res.status(401).send('Invalid credentials.');
            } else {
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
                console.log('Token generated for user:', user.id);
                res.json({ token });
            }
        });
    },
};