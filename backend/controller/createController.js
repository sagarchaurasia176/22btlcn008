const { validationResult } = require('express-validator');
const urlService = require('../services/urlService');

const createShortUrl = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Validation failed',
        details: errors.array()
      });
    }

    const { url, validity, shortcode } = req.body;
    
    // Set validity (default to 30 minutes)
    const validityMinutes = validity || 30;
    
    // Call service to create short URL
    const result = await urlService.createShortUrl(url, validityMinutes, shortcode);
    
    // Check if there was an error (like conflict)
    if (result.error) {
      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message
      });
    }
    
    // Return success response
    res.status(201).json(result);
    
  } catch (error) {
    console.error('Error in createShortUrl controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create short URL'
    });
  }
};

module.exports = {
  createShortUrl
};
