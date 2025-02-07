const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Get the daily deck limit
router.get('/limit', authMiddleware, adminController.getLimit);

// Update the daily deck limit
router.post('/limit', authMiddleware, adminController.updateLimit);

// Get all users
router.get('/users', authMiddleware, adminController.getAllUsers);

// Update a user's role
router.put('/users/:userId/role', authMiddleware, adminController.updateUserRole);

// Get system statistics
router.get('/stats', authMiddleware, adminController.getSystemStats);

module.exports = router;