const authService = require('../services/authService');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class AuthController {
  /**
   * Register new user
   */
  register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  /**
   * Login user
   */
  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  /**
   * Refresh access token
   */
  refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  /**
   * Logout user
   */
  logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    await authService.logout(userId, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  /**
   * Logout from all devices
   */
  logoutAll = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    await authService.logoutAll(userId);

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  });

  /**
   * Get current user profile
   */
  getProfile = catchAsync(async (req, res) => {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  });
}

module.exports = new AuthController();
