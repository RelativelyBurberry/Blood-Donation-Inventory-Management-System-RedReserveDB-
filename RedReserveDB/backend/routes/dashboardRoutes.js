const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.get('/summary', authMiddleware, requireRole('Admin'), dashboardController.getSummary);

module.exports = router;
