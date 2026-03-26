const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.get('/execute/:queryId', queryController.executeQuery);

module.exports = router;