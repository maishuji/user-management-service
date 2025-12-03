const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiter middleware
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests in development
  skip: (req) => config.nodeEnv === 'development' && req.method === 'GET',
});

module.exports = rateLimiter;
