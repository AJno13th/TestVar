const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registration endpoint
router.post('/register', userController.register);

// Login endpoint
router.post('/login', userController.login);

module.exports = router;