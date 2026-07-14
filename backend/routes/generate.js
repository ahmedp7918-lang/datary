const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');

// Generate data endpoint
router.post('/', generateController.generateData);

// Preview endpoint (first 10 rows)
router.post('/preview', generateController.previewData);

// Validate schema
router.post('/validate', generateController.validateSchema);

module.exports = router;