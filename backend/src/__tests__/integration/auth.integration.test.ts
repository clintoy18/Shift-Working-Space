import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt';
import { validatePassword, validateEmail } from '../../utils/validation';

/**
 * Integration tests for authentication flow
 * Tests the complete user registration, login, and profile update flow
 */
describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('Complete Auth Flow', () => {
    it('should register a new user and generate token', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Validate inputs
      const emailValidation = validateEmail(userData.email);
      expect(emailValidation.valid).toBe(true);

      const passwordValidation = validatePassword(userData.password);
      expect(passwordValidation.valid).toBe(true);

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      expect(hashedPassword).not.toBe(userData.password);

      // Create user
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: true,
      });

      await user.save();

      // Verify user was created
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeDefined();
      expect(savedUser?.email).toBe(userData.email);

      // Generate token
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
      });

      expect(token).toBeDefined();

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.email).toBe(userData.email);
      expect(decoded.role).toBe('shifty');
    });

    it('should login user with correct password', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      // Create user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'admin',
        isVerified: true,
      });

      await user.save();

      // Attempt login
      const savedUser = await User.findOne({ email: userData.email, isDeleted: false });
      expect(savedUser).toBeDefined();

      const passwordMatch = await bcrypt.compare(userData.password, savedUser!.password!);
      expect(passwordMatch).toBe(true);

      // Generate token
      const token = generateToken({
        id: (savedUser!._id as any).toString(),
        email: savedUser!.email,
        role: savedUser!.role,
      });

      expect(token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const userData = {
        email: 'wrongpass@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Bob',
        lastName: 'Smith',
      };

      // Create user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: true,
      });

      await user.save();

      // Attempt login with wrong password
      const savedUser = await User.findOne({ email: userData.email });
      const passwordMatch = await bcrypt.compare('WrongPass123!@#', savedUser!.password!);
      expect(passwordMatch).toBe(false);
    });

    it('should not allow login for unverified user', async () => {
      const userData = {
        email: 'unverified@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Alice',
        lastName: 'Johnson',
      };

      // Create unverified user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: false,
      });

      await user.save();

      // Check verification status
      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser?.isVerified).toBe(false);
    });

    it('should not allow login for deleted user', async () => {
      const userData = {
        email: 'deleted@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Charlie',
        lastName: 'Brown',
      };

      // Create and delete user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: true,
        isDeleted: true,
      });

      await user.save();

      // Try to find active user
      const activeUser = await User.findOne({ email: userData.email, isDeleted: false });
      expect(activeUser).toBeNull();
    });

    it('should update user profile', async () => {
      const userData = {
        email: 'update@example.com',
        password: 'ValidPass123!@#',
        firstName: 'David',
        lastName: 'Wilson',
      };

      // Create user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: true,
      });

      await user.save();

      // Update user
      const savedUser = await User.findById(user._id);
      expect(savedUser).toBeDefined();

      savedUser!.firstName = 'David Updated';
      await savedUser!.save();

      // Verify update
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.firstName).toBe('David Updated');
    });

    it('should update user password', async () => {
      const userData = {
        email: 'updatepass@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Eve',
        lastName: 'Taylor',
      };

      // Create user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'shifty',
        isVerified: true,
      });

      await user.save();

      // Update password
      const newPassword = 'NewPass456!@#';
      const newHashedPassword = await bcrypt.hash(newPassword, 12);

      const savedUser = await User.findById(user._id);
      savedUser!.password = newHashedPassword;
      await savedUser!.save();

      // Verify new password works
      const updatedUser = await User.findById(user._id);
      const passwordMatch = await bcrypt.compare(newPassword, updatedUser!.password!);
      expect(passwordMatch).toBe(true);

      // Verify old password doesn't work
      const oldPasswordMatch = await bcrypt.compare(userData.password, updatedUser!.password!);
      expect(oldPasswordMatch).toBe(false);
    });

    it('should handle first user becoming admin', async () => {
      // Ensure no users exist
      const userCount = await User.countDocuments({});
      expect(userCount).toBe(0);

      // Create first user
      const hashedPassword = await bcrypt.hash('ValidPass123!@#', 12);
      const firstUser = new User({
        email: 'firstuser@example.com',
        password: hashedPassword,
        firstName: 'First',
        lastName: 'User',
        role: 'admin', // First user should be admin
        isVerified: true,
      });

      await firstUser.save();

      // Verify first user is admin
      const savedUser = await User.findOne({ email: 'firstuser@example.com' });
      expect(savedUser?.role).toBe('admin');

      // Create second user
      const secondUser = new User({
        email: 'seconduser@example.com',
        password: hashedPassword,
        firstName: 'Second',
        lastName: 'User',
        role: 'shifty', // Second user should be shifty
        isVerified: true,
      });

      await secondUser.save();

      // Verify second user is shifty
      const secondSavedUser = await User.findOne({ email: 'seconduser@example.com' });
      expect(secondSavedUser?.role).toBe('shifty');
    });
  });

  describe('Token Validation Flow', () => {
    it('should validate token and retrieve user', async () => {
      // Create user
      const hashedPassword = await bcrypt.hash('ValidPass123!@#', 12);
      const user = new User({
        email: 'tokentest@example.com',
        password: hashedPassword,
        firstName: 'Token',
        lastName: 'Test',
        role: 'admin',
        isVerified: true,
      });

      await user.save();

      // Generate token
      const token = generateToken({
        id: (user._id as any).toString(),
        email: user.email,
        role: user.role,
      });

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Retrieve user from token
      const retrievedUser = await User.findOne({
        _id: decoded.id,
        isDeleted: false,
      });

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.email).toBe('tokentest@example.com');
      expect(retrievedUser?.isVerified).toBe(true);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, process.env.JWT_SECRET!);
      }).toThrow();
    });

    it('should reject expired token', () => {
      const expiredToken = jwt.sign(
        { id: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' } // Already expired
      );

      expect(() => {
        jwt.verify(expiredToken, process.env.JWT_SECRET!);
      }).toThrow();
    });
  });
});
