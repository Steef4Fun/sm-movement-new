const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listings.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.post('/', authenticateToken, isAdmin, listingController.createListing);
router.put('/:id', authenticateToken, isAdmin, listingController.updateListing);
router.delete('/:id', authenticateToken, isAdmin, listingController.deleteListing);

module.exports = router;
