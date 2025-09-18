
// =======================
// src/utils/helpers.js (NEW)
// =======================
// Generate a random shortcode
const generateShortcode = (length = 6) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Calculate expiry date based on validity in minutes
const getExpiryDate = (validityMinutes) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);
  return expiryDate;
};

// Format date for API response
const formatDateForResponse = (date) => {
  return date.toISOString().replace('T', ' ').substring(0, 19) + '+00';
};

// Validate URL format
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

module.exports = {
  generateShortcode,
  getExpiryDate,
  formatDateForResponse,
  isValidUrl
};