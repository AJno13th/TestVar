const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for registering a new user
router.post('/register', userController.registerUser);

// Route for logging in a user
router.post('/login', userController.loginUser);

module.exports = router;