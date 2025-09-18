



// =======================
// src/storage/urlStorage.js (FIXED)
// =======================
// In-memory databases
const urlDatabase = new Map();
const clickDatabase = new Map();

// Store URL data
const storeUrl = async (shortcode, urlData) => {
    urlDatabase.set(shortcode, urlData);
    return true;
};

// Get URL data
const getUrl = async (shortcode) => {
    return urlDatabase.get(shortcode);
};

// Check if shortcode exists
const exists = async (shortcode) => {
    return urlDatabase.has(shortcode);
};

// Initialize click tracking for a shortcode
const initializeClicks = async (shortcode) => {
    if (!clickDatabase.has(shortcode)) {
        clickDatabase.set(shortcode, []);
    }
    return true;
};

// Record a click
const recordClick = async (shortcode, clickData) => {
    // Update click count in URL data
    const urlData = urlDatabase.get(shortcode);
    if (urlData) {
        urlData.clickCount = (urlData.clickCount || 0) + 1;
        urlDatabase.set(shortcode, urlData);
        
        // Store click details
        if (!clickDatabase.has(shortcode)) {
            clickDatabase.set(shortcode, []);
        }
        clickDatabase.get(shortcode).push(clickData);
        return true;
    }
    return false;
};
