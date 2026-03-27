const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.get('/', authMiddleware, requireRole('Admin', 'Hospital'), inventoryController.listUnits);
router.get('/summary', authMiddleware, requireRole('Admin', 'Hospital'), inventoryController.summary);
router.post('/', authMiddleware, requireRole('Admin'), inventoryController.createUnits);
router.put('/:unitNumber', authMiddleware, requireRole('Admin'), inventoryController.updateUnit);
router.delete('/:unitNumber', authMiddleware, requireRole('Admin'), inventoryController.deleteUnit);

module.exports = router;
