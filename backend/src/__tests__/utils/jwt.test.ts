import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwt';

describe('JWT Utilities', () => {
  const testPayload = {
    id: 123,
    email: 'test@example.com',
    role: 'admin',
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should create a token with correct payload', () => {
      const token = generateToken(testPayload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      expect(decoded.id).toBe(testPayload.id);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should set token expiration to 24 hours', () => {
      const token = generateToken(testPayload);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      // exp - iat should be approximately 24 hours (86400 seconds)
      const expirationTime = decoded.exp - decoded.iat;
      expect(expirationTime).toBe(86400);
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken(testPayload);
      const token2 = generateToken({
        ...testPayload,
        email: 'different@example.com',
      });

      expect(token1).not.toBe(token2);
    });

    it('should handle different roles correctly', () => {
      const adminToken = generateToken({ ...testPayload, role: 'admin' });
      const shiftyToken = generateToken({ ...testPayload, role: 'shifty' });
      const cashierToken = generateToken({ ...testPayload, role: 'cashier' });

      const adminDecoded = jwt.verify(adminToken, process.env.JWT_SECRET!) as any;
      const shiftyDecoded = jwt.verify(shiftyToken, process.env.JWT_SECRET!) as any;
      const cashierDecoded = jwt.verify(cashierToken, process.env.JWT_SECRET!) as any;

      expect(adminDecoded.role).toBe('admin');
      expect(shiftyDecoded.role).toBe('shifty');
      expect(cashierDecoded.role).toBe('cashier');
    });

    it('should generate token with configured JWT_SECRET', () => {
      expect(process.env.JWT_SECRET).toBe('test-secret-key');
      const token = generateToken(testPayload);
      expect(token).toBeDefined();
    });
  });

  describe('Token Verification', () => {
    it('should verify a valid token', () => {
      const token = generateToken(testPayload);
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testPayload.id);
    });

    it('should reject an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      expect(() => {
        jwt.verify(invalidToken, process.env.JWT_SECRET!);
      }).toThrow();
    });

    it('should reject a token signed with different secret', () => {
      const token = generateToken(testPayload);
      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });
  });
});
