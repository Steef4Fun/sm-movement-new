const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/request-password-reset
// router.post('/request-password-reset', authController.requestPasswordReset);

module.exports = router;
