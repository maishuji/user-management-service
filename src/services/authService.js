const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const User = require('../models/User');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Generate JWT access token
   */
  generateAccessToken(userId, role) {
    return jwt.sign({ userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(userId) {
    const tokenId = uuidv4();
    return {
      token: jwt.sign({ userId, tokenId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
      }),
      tokenId,
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token, isRefreshToken = false) {
    try {
      const secret = isRefreshToken ? config.jwt.refreshSecret : config.jwt.secret;
      return jwt.verify(token, secret);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user._id, user.role);
      const { token: refreshToken, tokenId } = this.generateRefreshToken(user._id);

      // Save refresh token
      user.refreshTokens.push({ token: tokenId, createdAt: new Date() });
      await user.save();

      logger.info(`User registered: ${user.email}`);

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user with password field
      const user = await User.findOne({ email, isActive: true }).select('+password');
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const accessToken = this.generateAccessToken(user._id, user.role);
      const { token: refreshToken, tokenId } = this.generateRefreshToken(user._id);

      // Save refresh token (limit to 5 active tokens)
      user.refreshTokens.push({ token: tokenId, createdAt: new Date() });
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }
      await user.save();

      logger.info(`User logged in: ${user.email}`);

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.verifyToken(refreshToken, true);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 404);
      }

      // Check if token exists in user's refresh tokens
      const tokenExists = user.refreshTokens.some((t) => t.token === decoded.tokenId);
      if (!tokenExists) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user._id, user.role);

      return { accessToken };
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(userId, refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken, true);
      const user = await User.findById(userId);

      if (user) {
        // Remove the specific refresh token
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== decoded.tokenId);
        await user.save();
      }

      logger.info(`User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.refreshTokens = [];
        await user.save();
      }

      logger.info(`User logged out from all devices: ${userId}`);
    } catch (error) {
      logger.error('Logout all error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
