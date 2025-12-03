const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { updateUserValidation, changePasswordValidation } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (with pagination and filters)
 * @access  Private (Admin only)
 */
router.get('/', authorize('admin'), userController.getUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', userController.getUserById);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put('/:id', updateUserValidation, userController.updateUser);

/**
 * @route   PUT /api/v1/users/password/change
 * @desc    Change password
 * @access  Private
 */
router.put('/password/change', changePasswordValidation, userController.changePassword);

/**
 * @route   PUT /api/v1/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', userController.updatePreferences);

/**
 * @route   DELETE /api/v1/users/:id/deactivate
 * @desc    Deactivate user account
 * @access  Private (Own account or Admin)
 */
router.delete('/:id/deactivate', userController.deactivateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user permanently
 * @access  Private (Admin only)
 */
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
