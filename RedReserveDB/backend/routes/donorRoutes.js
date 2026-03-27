const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.get('/', authMiddleware, requireRole('Admin'), donorController.listDonors);
router.get('/:donorId', authMiddleware, requireRole('Admin', 'Donor'), donorController.getDonor);
router.get('/:donorId/history', authMiddleware, requireRole('Admin', 'Donor'), donorController.getDonationHistory);
router.put('/:donorId', authMiddleware, requireRole('Admin'), donorController.updateDonor);
router.delete('/:donorId', authMiddleware, requireRole('Admin'), donorController.deleteDonor);

module.exports = router;
