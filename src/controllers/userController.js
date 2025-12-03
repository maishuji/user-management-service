const userService = require('../services/userService');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class UserController {
  /**
   * Get all users
   */
  getUsers = catchAsync(async (req, res) => {
    const { page, limit, sortBy, sortOrder, role, search } = req.query;

    const filters = { role, search };
    const pagination = { page, limit, sortBy, sortOrder };

    const result = await userService.getUsers(filters, pagination);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  /**
   * Get user by ID
   */
  getUserById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  });

  /**
   * Update user
   */
  updateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only allow users to update their own profile, or admins to update any profile
    if (id !== userId && userRole !== 'admin') {
      throw new AppError('You are not authorized to update this user', 403);
    }

    const user = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user },
    });
  });

  /**
   * Change password
   */
  changePassword = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    const result = await userService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Deactivate user
   */
  deactivateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only allow users to deactivate their own account, or admins to deactivate any account
    if (id !== userId && userRole !== 'admin') {
      throw new AppError('You are not authorized to deactivate this user', 403);
    }

    const result = await userService.deactivateUser(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Delete user permanently
   */
  deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  });

  /**
   * Update user preferences
   */
  updatePreferences = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const user = await userService.updatePreferences(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user },
    });
  });
}

module.exports = new UserController();
