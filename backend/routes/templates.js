const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');

// Get all templates
router.get('/', templatesController.getTemplates);

// Get template by name
router.get('/:name', templatesController.getTemplateByName);

// Apply template
router.post('/apply', templatesController.applyTemplate);

module.exports = router;