import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as AuthService from '../../services/AuthService';

jest.mock('../../services/AuthService');

// Test component that uses the AuthContext
const TestComponent = () => {
  const { user, isLoading, handleLogin, handleLogout, handleRegister } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="user-role">{user?.role || 'No role'}</div>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  describe('AuthProvider', () => {
    it('should provide auth context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-email')).toBeInTheDocument();
    });

    it('should initialize with no user when no token', async () => {
      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    });

    it('should fetch user when token exists', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        isVerified: true,
        isDeleted: false,
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      expect(AuthService.fetchUser).toHaveBeenCalled();
    });

    it('should transform user data correctly', async () => {
      const mockUserData = {
        _id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'shifty',
        membershipType: 'Premium',
        membershipStatus: 'Active',
        isVerified: true,
        isDeleted: false,
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        expect(screen.getByTestId('user-role')).toHaveTextContent('shifty');
      });
    });

    it('should handle _id to id transformation', async () => {
      const mockUserData = {
        _id: 'mongodb-id-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });
    });

    it('should set loading to false after initialization', async () => {
      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const TestComponentWithoutProvider = () => {
        useAuth();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should return auth context when used within provider', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-email')).toBeInTheDocument();
    });
  });

  describe('handleLogin', () => {
    it('should login user and fetch user data', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'ValidPass123!@#',
      };

      const mockLoginResponse = {
        token: 'test-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'admin',
        },
      };

      const mockUserData = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockResolvedValue(mockLoginResponse);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

      const LoginTestComponent = () => {
        const { handleLogin, user } = useAuth();
        return (
          <div>
            <button onClick={() => handleLogin(credentials)}>Login</button>
            <div data-testid="user-email">{user?.email || 'No user'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginTestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      expect(AuthService.loginUser).toHaveBeenCalledWith(credentials);
      expect(AuthService.fetchUser).toHaveBeenCalled();
    });

    it('should handle login error', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const LoginTestComponent = () => {
        const { handleLogin } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLoginWithError = async () => {
          try {
            await handleLogin(credentials);
          } catch (err: any) {
            setError(err.message);
          }
        };

        return (
          <div>
            <button onClick={handleLoginWithError}>Login</button>
            <div data-testid="error">{error}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginTestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });
    });
  });

  describe('handleLogout', () => {
    it('should logout user and clear user data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const LogoutTestComponent = () => {
        const { handleLogout, user } = useAuth();
        return (
          <div>
            <button onClick={handleLogout}>Logout</button>
            <div data-testid="user-email">{user?.email || 'No user'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <LogoutTestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      });

      const logoutButton = screen.getByText('Logout');
      logoutButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      });

      expect(AuthService.logoutUser).toHaveBeenCalled();
    });
  });

  describe('handleRegister', () => {
    it('should register user and fetch user data', async () => {
      const credentials = {
        email: 'newuser@example.com',
        password: 'ValidPass123!@#',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockRegisterResponse = {
        token: 'new-token',
        user: {
          id: '124',
          email: 'newuser@example.com',
          role: 'shifty',
        },
      };

      const mockUserData = {
        id: '124',
        email: 'newuser@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'shifty',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.registerStudent as jest.Mock).mockResolvedValue(mockRegisterResponse);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

      const RegisterTestComponent = () => {
        const { handleRegister, user } = useAuth();
        return (
          <div>
            <button onClick={() => handleRegister(credentials)}>Register</button>
            <div data-testid="user-email">{user?.email || 'No user'}</div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <RegisterTestComponent />
        </AuthProvider>
      );

      const registerButton = screen.getByText('Register');
      registerButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('user-email')).toHaveTextContent('newuser@example.com');
      });

      expect(AuthService.registerStudent).toHaveBeenCalledWith(credentials);
    });
  });
});
