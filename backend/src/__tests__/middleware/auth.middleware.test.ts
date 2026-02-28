import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, checkRole } from '../../middleware/auth.middleware';
import User from '../../models/User';

jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    req = {
      headers: {},
      user: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    it('should return 401 if no token provided', async () => {
      req.headers = {};

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if Authorization header is malformed', async () => {
      req.headers = { authorization: 'InvalidFormat' };

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers = { authorization: 'Bearer invalid.token.here' };

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign(
        { id: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      req.headers = { authorization: `Bearer ${token}` };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found or account deactivated',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is deleted', async () => {
      const token = jwt.sign(
        { id: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      req.headers = { authorization: `Bearer ${token}` };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        isDeleted: true,
      });

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not verified', async () => {
      const token = jwt.sign(
        { id: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      req.headers = { authorization: `Bearer ${token}` };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        isDeleted: false,
        isVerified: false,
      });

      await authenticate(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account not verified. Access denied.',
        code: 'ACCOUNT_NOT_VERIFIED',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() with valid token and verified user', async () => {
      const token = jwt.sign(
        { id: '123', email: 'test@example.com', role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      req.headers = { authorization: `Bearer ${token}` };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        isDeleted: false,
        isVerified: true,
      });

      await authenticate(req as Request, res as Response, next);

      expect(req.user).toBeDefined();
      expect(req.user?.id).toBe('123');
      expect(req.user?.email).toBe('test@example.com');
      expect(req.user?.role).toBe('admin');
      expect(next).toHaveBeenCalled();
    });

    it('should extract token from Bearer scheme correctly', async () => {
      const token = jwt.sign(
        { id: '456', email: 'user@example.com', role: 'shifty' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );
      req.headers = { authorization: `Bearer ${token}` };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '456',
        email: 'user@example.com',
        isDeleted: false,
        isVerified: true,
      });

      await authenticate(req as Request, res as Response, next);

      expect(req.user?.id).toBe('456');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkRole middleware', () => {
    it('should return 401 if user is not authenticated', () => {
      req.user = undefined;
      const middleware = checkRole('admin');

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized. Please login.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user role not in allowed roles', () => {
      req.user = { id: '123', email: 'test@example.com', role: 'shifty' };
      const middleware = checkRole('admin');

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. You do not have permission to access this resource.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if user role is in allowed roles', () => {
      req.user = { id: '123', email: 'test@example.com', role: 'admin' };
      const middleware = checkRole('admin');

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow multiple roles', () => {
      req.user = { id: '123', email: 'test@example.com', role: 'shifty' };
      const middleware = checkRole('admin', 'shifty');

      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('should check all allowed roles', () => {
      const roles = ['admin', 'shifty', 'cashier'];
      roles.forEach(role => {
        req.user = { id: '123', email: 'test@example.com', role };
        const middleware = checkRole('admin', 'shifty', 'cashier');

        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
      });
    });

    it('should deny access for roles not in allowed list', () => {
      req.user = { id: '123', email: 'test@example.com', role: 'guest' };
      const middleware = checkRole('admin', 'shifty');

      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
