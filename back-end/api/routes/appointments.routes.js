const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, controller.getAppointments);
router.post('/', authenticateToken, isAdmin, controller.createAppointment);
router.put('/:id', authenticateToken, isAdmin, controller.updateAppointment);
router.delete('/:id', authenticateToken, isAdmin, controller.deleteAppointment);

module.exports = router;
