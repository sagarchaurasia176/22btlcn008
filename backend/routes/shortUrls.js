const express = require('express');
const { body } = require('express-validator');
const { createShortUrl } = require('../controllers/createController');
const { getUrlStatistics } = require('../controllers/statsController');

const router = express.Router();

// Validation middleware for URL creation
const validateUrlCreation = [
  body('url')
    .isURL({ require_protocol: true })
    .withMessage('Invalid URL format. URL must include protocol (http:// or https://)'),
  body('validity')
    .optional()
    .isInt({ min: 1, max: 525600 })
    .withMessage('Validity must be between 1 and 525600 minutes (1 year)'),
  body('shortcode')
    .optional()
    .isLength({ min: 4, max: 20 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Shortcode must be 4-20 characters long and contain only letters, numbers, hyphens, and underscores')
];

// POST /shorturls - Create short URL
router.post('/', validateUrlCreation, createShortUrl);

// GET /shorturls/:shortcode/stats - Get statistics
router.get('/:shortcode/stats', getUrlStatistics);

module.exports = router;