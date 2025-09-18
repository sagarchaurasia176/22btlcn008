const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
};

const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'unknown';
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] [${requestId}] Unhandled error:`, err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    requestId: requestId
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
