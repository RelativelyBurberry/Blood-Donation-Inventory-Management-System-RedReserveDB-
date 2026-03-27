const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.get('/', authMiddleware, requireRole('Admin'), hospitalController.listHospitals);
router.put('/:hospitalId', authMiddleware, requireRole('Admin'), hospitalController.updateHospital);
router.delete('/:hospitalId', authMiddleware, requireRole('Admin'), hospitalController.deleteHospital);

module.exports = router;
