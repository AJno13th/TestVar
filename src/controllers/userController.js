const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('/Users/ossai/TestVar/database/initDB.js'); // Update path if necessary

module.exports = {
    // Registers a new user in the database
    registerUser: async (req, res) => {
        const { username, email, password } = req.body;

        // Check if the email is already registered
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (user) {
                    return res.status(400).send({ message: 'Email already exists.' });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Insert new user into the database
                    db.run(
                        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                        [username, email, hashedPassword],
                        function (err) {
                            if (err) return res.status(500).send(err.message);
                            res.status(201).send({ message: 'User registered successfully.' });
                        }
                    );
                } catch (error) {
                    res.status(500).send('Error during registration.');
                }
            }
        );
    },

    // Authenticates a user and returns a JWT token
    loginUser: (req, res) => {
        const { email, password } = req.body;

        // Retrieve user details by email
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (!user) {
                return res.status(400).send({ message: 'Invalid email or password.' });
            }

            try {
                // Compare input password with stored hashed password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).send({ message: 'Invalid email or password.' });
                }

                // Generate JWT token for authenticated user
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                });

                res.status(200).json({ message: 'Login successful.', token });
            } catch (error) {
                res.status(500).send('Error during login.');
            }
        });
    },
};
