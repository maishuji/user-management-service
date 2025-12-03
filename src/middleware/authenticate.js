const authService = require('../services/authService');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = authService.verifyToken(token, false);

  // Attach user info to request
  req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

  next();
});

module.exports = authenticate;
