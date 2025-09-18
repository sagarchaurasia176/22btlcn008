
// =======================
// src/controllers/statsController.js (FIXED)
// =======================
const urlService = require('../services/urlService');

const getUrlStatistics = async (req, res) => {
  try {
    const { shortcode } = req.params;
    
    // Get statistics from service
    const result = await urlService.getUrlStatistics(shortcode);
    
    // Check if there was an error
    if (result.error) {
      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message
      });
    }
    
    // Return statistics
    res.json(result);
    
  } catch (error) {
    console.error('Error in getUrlStatistics controller:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve statistics'
    });
  }
};

module.exports = {
  getUrlStatistics
};
