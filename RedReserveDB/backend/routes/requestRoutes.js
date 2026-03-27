const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/roles');

router.get('/', authMiddleware, requireRole('Admin'), requestController.listRequests);
router.get('/hospital', authMiddleware, requireRole('Hospital'), requestController.listRequests);
router.post('/', authMiddleware, requireRole('Hospital'), requestController.createRequest);
router.post('/:requestId/approve', authMiddleware, requireRole('Admin'), requestController.approveRequest);
router.post('/:requestId/reject', authMiddleware, requireRole('Admin'), requestController.rejectRequest);
router.post('/:requestId/fulfill', authMiddleware, requireRole('Admin'), requestController.fulfillRequest);

module.exports = router;
