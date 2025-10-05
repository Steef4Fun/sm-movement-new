const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quotes.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// GET /api/quotes -> Haalt offertes op (logica voor admin/klant zit in controller)
router.get('/', authenticateToken, quoteController.getQuotes);

// POST /api/quotes -> Maakt een nieuwe offerte (Admin)
router.post('/', authenticateToken, isAdmin, quoteController.createQuote);

// PUT /api/quotes/:id -> Werkt een offerte bij (Admin)
router.put('/:id', authenticateToken, isAdmin, quoteController.updateQuote);

// PATCH /api/quotes/:id/status -> Klant accepteert/weigert offerte
router.patch('/:id/status', authenticateToken, quoteController.updateQuoteStatus);

// DELETE /api/quotes/:id -> Verwijdert een offerte (Admin)
router.delete('/:id', authenticateToken, isAdmin, quoteController.deleteQuote);

module.exports = router;
