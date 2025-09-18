
// =======================
// src/middleware/logger.js (FIXED)
// =======================
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';
  const requestId = Math.random().toString(36).substring(7);
  
  // Add request ID for tracking
  req.requestId = requestId;
  
  // Log request
  console.log(`[${timestamp}] [${requestId}] ${method} ${url}`);
  console.log(`[${timestamp}] [${requestId}] IP: ${ip}`);
  console.log(`[${timestamp}] [${requestId}] User-Agent: ${userAgent}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[${timestamp}] [${requestId}] Request Body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Capture response details
  const originalSend = res.send;
  const startTime = Date.now();
  
  res.send = function(body) {
    const responseTime = Date.now() - startTime;
    const statusCode = res.statusCode;
    const responseSize = body ? Buffer.byteLength(body, 'utf8') : 0;
    
    console.log(`[${timestamp}] [${requestId}] Response: ${statusCode}`);
    console.log(`[${timestamp}] [${requestId}] Response Time: ${responseTime}ms`);
    console.log(`[${timestamp}] [${requestId}] Response Size: ${responseSize} bytes`);
    
    if (statusCode >= 400) {
      console.log(`[${timestamp}] [${requestId}] Error Response Body:`, body);
    }
    
    console.log(`[${timestamp}] [${requestId}] Request completed\n`);
    
    originalSend.call(this, body);
  };
  
  next();
};

module.exports = loggingMiddleware;