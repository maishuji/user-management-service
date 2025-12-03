const User = require('../../src/models/User');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
        role: 'student',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should fail to create user without required fields', async () => {
      const userData = {
        firstName: 'John',
        // Missing lastName, email, password
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'duplicate@example.com',
        password: 'Password123',
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Password123';
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: plainPassword,
      });

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it('should compare passwords correctly', async () => {
      const plainPassword = 'Password123';
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'compare@example.com',
        password: plainPassword,
      });

      // Fetch user with password field
      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword(plainPassword);
      const isNotMatch = await userWithPassword.comparePassword('WrongPassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('User Virtuals', () => {
    it('should return full name virtual', async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'fullname@example.com',
        password: 'Password123',
      });

      expect(user.fullName).toBe('John Doe');
    });
  });

  describe('User Methods', () => {
    it('should allow deletion of non-admin users', async () => {
      const user = await User.create({
        firstName: 'Student',
        lastName: 'User',
        email: 'student@example.com',
        password: 'Password123',
        role: 'student',
      });

      expect(user.canBeDeleted()).toBe(true);
    });

    it('should prevent deletion of admin users', async () => {
      const user = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin',
      });

      expect(user.canBeDeleted()).toBe(false);
    });
  });

  describe('User Defaults', () => {
    it('should set default values correctly', async () => {
      const user = await User.create({
        firstName: 'Default',
        lastName: 'Test',
        email: 'default@example.com',
        password: 'Password123',
      });

      expect(user.role).toBe('student');
      expect(user.isActive).toBe(true);
      expect(user.isEmailVerified).toBe(false);
      expect(user.preferences.language).toBe('en');
      expect(user.preferences.timezone).toBe('UTC');
    });
  });
});
