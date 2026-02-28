import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { register, login, getMe, updateMe } from '../../controllers/auth.controller';
import User from '../../models/User';
import * as jwtUtils from '../../utils/jwt';

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = { email: 'test@example.com' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Required fields are missing',
      });
    });

    it('should return 400 for invalid email', async () => {
      req.body = {
        email: 'invalid-email',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for weak password', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Password does not meet requirements',
        })
      );
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should create first user as admin', async () => {
      req.body = {
        email: 'first@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.countDocuments as jest.Mock).mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      const mockUser = {
        _id: '123',
        email: 'first@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        save: jest.fn().mockResolvedValue(true),
      };
      (User as any).mockImplementation(() => mockUser);

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
          token: 'test-token',
        })
      );
    });

    it('should create subsequent users as shifty', async () => {
      req.body = {
        email: 'second@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Jane',
        lastName: 'Doe',
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.countDocuments as jest.Mock).mockResolvedValue(1);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      const mockUser = {
        _id: '124',
        email: 'second@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'shifty',
        save: jest.fn().mockResolvedValue(true),
      };
      (User as any).mockImplementation(() => mockUser);

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should hash password with bcrypt', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.countDocuments as jest.Mock).mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      const mockUser = {
        _id: '123',
        save: jest.fn().mockResolvedValue(true),
      };
      (User as any).mockImplementation(() => mockUser);

      await register(req as Request, res as Response);

      expect(bcrypt.hash).toHaveBeenCalledWith('ValidPass123!@#', 12);
    });
  });

  describe('login', () => {
    it('should return 400 if email or password missing', async () => {
      req.body = { email: 'test@example.com' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return 403 if user not verified', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: false,
      });

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'ACCOUNT_NOT_VERIFIED',
        })
      );
    });

    it('should return 400 if password does not match', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });

    it('should return token on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'ValidPass123!@#' };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: true,
        role: 'admin',
        fullName: 'John Doe',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'test-token',
        })
      );
    });

    it('should return user info on successful login', async () => {
      req.body = { email: 'test@example.com', password: 'ValidPass123!@#' };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        isVerified: true,
        role: 'admin',
        fullName: 'John Doe',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      await login(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            role: 'admin',
          }),
        })
      );
    });
  });

  describe('getMe', () => {
    it('should return 404 if user not found', async () => {
      req.user = { id: '123' };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await getMe(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return 404 if user is deleted', async () => {
      req.user = { id: '123' };
      (User.findById as jest.Mock).mockResolvedValue({
        _id: '123',
        isDeleted: true,
      });

      await getMe(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return user data on success', async () => {
      req.user = { id: '123' };
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        isDeleted: false,
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await getMe(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateMe', () => {
    it('should return 404 if user not found', async () => {
      req.user = { id: '123' };
      req.body = { firstName: 'Jane' };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await updateMe(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update firstName', async () => {
      req.user = { id: '123' };
      req.body = { firstName: 'Jane' };
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        save: jest.fn().mockResolvedValue(true),
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await updateMe(req as Request, res as Response);

      expect(mockUser.firstName).toBe('Jane');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update password', async () => {
      req.user = { id: '123' };
      req.body = { password: 'NewPass123!@#' };
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        password: 'oldHash',
        save: jest.fn().mockResolvedValue(true),
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');

      await updateMe(req as Request, res as Response);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123!@#', 12);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should reject invalid password', async () => {
      req.user = { id: '123' };
      req.body = { password: 'weak' };
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        save: jest.fn(),
      };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await updateMe(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockUser.save).not.toHaveBeenCalled();
    });
  });
});
