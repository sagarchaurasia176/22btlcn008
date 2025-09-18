// src/controllers/redirectController.js (FIXED)
// =======================
const urlService = require('../services/urlService');

const redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;
    
    // Skip if this looks like a favicon request or other assets
    if (shortcode === 'favicon.ico' || shortcode.includes('.')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Resource not found'
      });
    }
    
    // Prepare client info
    const clientInfo = {
      referrer: req.get('Referer'),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Get original URL and record click
    const result = await urlService.getOriginalUrl(shortcode, clientInfo);
    
    // Check if there was an error
    if (result.error) {
      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message
      });
    }
    
    // Redirect to original URL
    res.redirect(302, result.originalUrl);
    
  } catch (error) {
    console.error('Error in redirectToOriginal controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to redirect'
    });
  }
};

module.exports = {
  redirectToOriginal
};