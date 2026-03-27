const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register/donor', authController.registerDonor);
router.post('/register/hospital', authController.registerHospital);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
