// import urlService from '../storage/urlServices';

// const createShortUrl = async (req, res) => {
//   try {
//     const { url, validity, shortcode } = req.body;
    
//     // Set validity (default to 30 minutes)
//     const validityMinutes = validity || 30;
    
//     // Call service to create short URL
//     const result = await urlService.createShortUrl(url, validityMinutes, shortcode);
    
//     // Check if there was an error (like conflict)
//     if (result.error) {
//       return res.status(result.statusCode).json({
//         error: result.error,
//         message: result.message
//       });
//     }
    
//     // Return success response
//     res.status(201).json(result);
    
//   } catch (error) {
//     console.error('Error in createShortUrl controller:', error);
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'Failed to create short URL'
//     });
//   }
// };

// module.exports = {
//   createShortUrl
// };

// // ================================
// // src/controllers/redirectController.js (UPDATED)
// // ================================

// const urlService = require('../services/urlService');

// const redirectToOriginal = async (req, res) => {
//   try {
//     const { shortcode } = req.params;
    
//     // Prepare client info
//     const clientInfo = {
//       referrer: req.get('Referer'),
//       userAgent: req.get('User-Agent'),
//       ip: req.ip || req.connection.remoteAddress
//     };
    
//     // Get original URL and record click
//     const result = await urlService.getOriginalUrl(shortcode, clientInfo);
    
//     // Check if there was an error
//     if (result.error) {
//       return res.status(result.statusCode).json({
//         error: result.error,
//         message: result.message
//       });
//     }
    
//     // Redirect to original URL
//     res.redirect(302, result.originalUrl);
    
//   } catch (error) {
//     console.error('Error in redirectToOriginal controller:', error);
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'Failed to redirect'
//     });
//   }
// };

// module.exports = {
//   redirectToOriginal
// };

// // ================================
// // src/controllers/statsController.js (UPDATED)
// // ================================

// const urlService = require('../services/urlService');

// const getUrlStatistics = async (req, res) => {
//   try {
//     const { shortcode } = req.params;
    
//     // Get statistics from service
//     const result = await urlService.getUrlStatistics(shortcode);
    
//     // Check if there was an error
//     if (result.error) {
//       return res.status(result.statusCode).json({
//         error: result.error,
//         message: result.message
//       });
//     }
    
//     // Return statistics
//     res.json(result);
    
//   } catch (error) {
//     console.error('Error in getUrlStatistics controller:', error);
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'Failed to retrieve statistics'
//     });
//   }
// };

// module.exports = {
//   getUrlStatistics
// }