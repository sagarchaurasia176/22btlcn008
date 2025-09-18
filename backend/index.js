const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const loggingMiddleware = require('./middleware/logger');
const { redirectToOriginal } = require('./controllers/redirectController');
const router = require('../backend/routes/shortUrls')

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Logging middleware
app.use(loggingMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// URL shortener routes
app.use('/shorturls', router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 URL Shortener API is running on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`🔗 Create short URLs at: http://localhost:${PORT}/shorturls`);
});

module.exports = app;

// Get all clicks for a shortcode
const getClicks = async (shortcode) => {
    return clickDatabase.get(shortcode) || [];
};

// Get all URLs (for debugging)
const getAllUrls = async () => {
    return Array.from(urlDatabase.entries());
};

// Delete URL and its clicks
const deleteUrl = async (shortcode) => {
    const deleted = urlDatabase.delete(shortcode);
    clickDatabase.delete(shortcode);
    return deleted;
};

module.exports = {
    storeUrl,
    getUrl,
    exists,
    initializeClicks,
    recordClick,
    getClicks,
    getAllUrls,
    deleteUrl
};

