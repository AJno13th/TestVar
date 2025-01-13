const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database/testvar.db');

module.exports = {
    registerUser: (username, email, password, callback) => {
        const role = 'user'; // Default role
        db.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role],
            function (err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, this?.lastID);
                }
            }
        );
    },
    authenticateUser: (email, password, callback) => {
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, user) => {
                if (err) {
                    return callback(err);
                }
                if (user && bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                } else {
                    callback(null, null); // Authentication failed
                }
            }
        );
    },
};