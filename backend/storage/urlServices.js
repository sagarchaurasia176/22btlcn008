
// =======================
// src/services/urlService.js (FIXED)
// =======================
const urlStorage = require('../storage/urlStorage');
const { generateShortcode, getExpiryDate, formatDateForResponse } = require('../utils/helpers');

const createShortUrl = async (url, validityMinutes, customShortcode) => {
  try {
    let finalShortcode = customShortcode;
    
    // If custom shortcode is provided, check if it exists
    if (customShortcode) {
      const exists = await urlStorage.exists(customShortcode);
      if (exists) {
        return {
          error: 'Conflict',
          message: 'Shortcode already exists',
          statusCode: 409
        };
      }
    } else {
      // Generate unique shortcode
      do {
        finalShortcode = generateShortcode();
      } while (await urlStorage.exists(finalShortcode));
    }
    
    // Calculate expiry date
    const expiryDate = getExpiryDate(validityMinutes);
    
    // Store URL data
    await urlStorage.storeUrl(finalShortcode, {
      originalUrl: url,
      createdAt: new Date(),
      expiryDate: expiryDate,
      clickCount: 0
    });
    
    // Initialize click tracking
    await urlStorage.initializeClicks(finalShortcode);
    
    return {
      shortLink: `http://localhost:3000/${finalShortcode}`,
      expiry: formatDateForResponse(expiryDate)
    };
    
  } catch (error) {
    console.error('Error in urlService.createShortUrl:', error);
    throw error;
  }
};

const getOriginalUrl = async (shortcode, clientInfo) => {
  try {
    const urlData = await urlStorage.getUrl(shortcode);
    
    if (!urlData) {
      return {
        error: 'Not Found',
        message: 'Shortcode does not exist',
        statusCode: 404
      };
    }
    
    // Check if URL has expired
    if (new Date() > urlData.expiryDate) {
      return {
        error: 'Gone',
        message: 'Short link has expired',
        statusCode: 410
      };
    }
    
    // Record click data
    const clickData = {
      timestamp: new Date(),
      referrer: clientInfo.referrer || 'Direct',
      userAgent: clientInfo.userAgent || 'Unknown',
      ip: clientInfo.ip || 'Unknown',
      location: 'Unknown' // In production, use IP geolocation service
    };
    
    // Update click count and store click data
    await urlStorage.recordClick(shortcode, clickData);
    
    return {
      originalUrl: urlData.originalUrl
    };
    
  } catch (error) {
    console.error('Error in urlService.getOriginalUrl:', error);
    throw error;
  }
};

const getUrlStatistics = async (shortcode) => {
  try {
    const urlData = await urlStorage.getUrl(shortcode);
    
    if (!urlData) {
      return {
        error: 'Not Found',
        message: 'Shortcode does not exist',
        statusCode: 404
      };
    }
    
    const clicks = await urlStorage.getClicks(shortcode);
    
    // Format click data for response
    const detailedClicks = clicks.map(click => ({
      timestamp: click.timestamp.toISOString(),
      referrer: click.referrer,
      userAgent: click.userAgent,
      location: click.location,
      ip: click.ip
    }));
    
    return {
      shortcode: shortcode,
      originalUrl: urlData.originalUrl,
      creationDate: urlData.createdAt.toISOString(),
      expiryDate: urlData.expiryDate.toISOString(),
      totalClicks: urlData.clickCount || 0,
      isExpired: new Date() > urlData.expiryDate,
      clicks: detailedClicks
    };
    
  } catch (error) {
    console.error('Error in urlService.getUrlStatistics:', error);
    throw error;
  }
};

module.exports = {
  createShortUrl,
  getOriginalUrl,
  getUrlStatistics
};