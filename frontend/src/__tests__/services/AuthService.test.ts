import * as AuthService from '../../services/AuthService';
import { auth } from '../../lib/api';

jest.mock('../../lib/api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  describe('loginUser', () => {
    it('should login user and store token', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'ValidPass123!@#',
      };

      const mockResponse = {
        data: {
          token: 'test-token-123',
          user: {
            id: '123',
            email: 'test@example.com',
            role: 'admin',
          },
        },
      };

      (auth.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.loginUser(credentials);

      expect(auth.post).toHaveBeenCalledWith('/login', credentials);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('accessToken', 'test-token-123');
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      (auth.post as jest.Mock).mockRejectedValue(error);

      await expect(AuthService.loginUser(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should not store token if response is empty', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'ValidPass123!@#',
      };

      const mockResponse = {
        data: {
          user: {
            id: '123',
            email: 'test@example.com',
          },
        },
      };

      (auth.post as jest.Mock).mockResolvedValue(mockResponse);

      await AuthService.loginUser(credentials);

      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    it('should remove token from session storage', async () => {
      sessionStorage.setItem('accessToken', 'test-token');

      await AuthService.logoutUser();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('accessToken');
    });
  });

  describe('registerStudent', () => {
    it('should register new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse = {
        data: {
          message: 'User registered successfully',
          token: 'new-token-123',
          user: {
            id: '124',
            email: 'newuser@example.com',
            role: 'shifty',
          },
        },
      };

      (auth.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.registerStudent(userData);

      expect(auth.post).toHaveBeenCalledWith('/register', userData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration error', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'ValidPass123!@#',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const error = new Error('Email already exists');
      (auth.post as jest.Mock).mockRejectedValue(error);

      await expect(AuthService.registerStudent(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('fetchUser', () => {
    it('should fetch current user data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      const mockResponse = {
        data: mockUser,
      };

      (auth.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.fetchUser();

      expect(auth.get).toHaveBeenCalledWith('/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Unauthorized');
      (auth.get as jest.Mock).mockRejectedValue(error);

      await expect(AuthService.fetchUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('isAccessTokenInSession', () => {
    it('should return true if token exists', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue('test-token');

      const result = AuthService.isAccessTokenInSession();

      expect(result).toBe(true);
      expect(sessionStorage.getItem).toHaveBeenCalledWith('accessToken');
    });

    it('should return false if token does not exist', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = AuthService.isAccessTokenInSession();

      expect(result).toBe(false);
    });
  });

  describe('updateSelf', () => {
    it('should update user profile', async () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John Updated',
        lastName: 'Doe',
        role: 'admin',
      };

      const mockResponse = {
        data: {
          message: 'Profile updated successfully',
          user: userData,
        },
      };

      (auth.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.updateSelf(userData, '', '');

      expect(auth.put).toHaveBeenCalledWith('/me/update/', expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });

    it('should include password in update if provided', async () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      const mockResponse = {
        data: {
          message: 'Profile updated successfully',
        },
      };

      (auth.put as jest.Mock).mockResolvedValue(mockResponse);

      await AuthService.updateSelf(userData, 'NewPass123!@#', 'NewPass123!@#');

      expect(auth.put).toHaveBeenCalledWith(
        '/me/update/',
        expect.objectContaining({
          Password: 'NewPass123!@#',
          ConfirmPassword: 'NewPass123!@#',
        })
      );
    });

    it('should handle update error', async () => {
      const userData = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      const error = new Error('Update failed');
      (auth.put as jest.Mock).mockRejectedValue(error);

      await expect(AuthService.updateSelf(userData, '', '')).rejects.toThrow('Update failed');
    });
  });

  describe('getActiveMembersCount', () => {
    it('should return count of shifty members', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', role: 'shifty' },
        { id: '2', email: 'user2@example.com', role: 'shifty' },
        { id: '3', email: 'user3@example.com', role: 'admin' },
        { id: '4', email: 'user4@example.com', role: 'cashier' },
      ];

      (auth.get as jest.Mock).mockResolvedValue({
        data: mockUsers,
      });

      const result = await AuthService.getActiveMembersCount();

      expect(result).toBe(2);
    });

    it('should be case-insensitive when filtering shifty role', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', role: 'Shifty' },
        { id: '2', email: 'user2@example.com', role: 'SHIFTY' },
        { id: '3', email: 'user3@example.com', role: 'shifty' },
      ];

      (auth.get as jest.Mock).mockResolvedValue({
        data: mockUsers,
      });

      const result = await AuthService.getActiveMembersCount();

      expect(result).toBe(3);
    });

    it('should return 0 on error', async () => {
      (auth.get as jest.Mock).mockRejectedValue(new Error('API Error'));

      const result = await AuthService.getActiveMembersCount();

      expect(result).toBe(0);
    });

    it('should return 0 if no shifty members', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', role: 'admin' },
        { id: '2', email: 'user2@example.com', role: 'cashier' },
      ];

      (auth.get as jest.Mock).mockResolvedValue({
        data: mockUsers,
      });

      const result = await AuthService.getActiveMembersCount();

      expect(result).toBe(0);
    });
  });
});
