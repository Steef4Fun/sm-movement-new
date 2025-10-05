const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// GET /api/users/profile -> Haal eigen profiel op
router.get('/profile', authenticateToken, userController.getProfile);

// PUT /api/users/profile -> Werk eigen profiel bij
router.put('/profile', authenticateToken, userController.updateProfile);

// GET /api/users -> Haal alle gebruikers op (Admin)
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

// PUT /api/users/:userId/role -> Werk rol bij (Admin)
router.put('/:userId/role', authenticateToken, isAdmin, userController.updateUserRole);

// DELETE /api/users/:userId -> Verwijder gebruiker (Admin)
router.delete('/:userId', authenticateToken, isAdmin, userController.deleteUser);

// GET /api/users/:id -> Haal specifieke gebruiker op (Admin)
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);

module.exports = router;
