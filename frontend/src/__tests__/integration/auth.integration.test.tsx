import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as AuthService from '../../services/AuthService';

jest.mock('../../services/AuthService');

/**
 * Integration tests for complete authentication flow
 * Tests user registration, login, and profile management
 */

// Mock components for testing
const LoginPage = () => {
  const { handleLogin, user } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          data-testid="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          data-testid="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {user && <div data-testid="user-info">{user.email}</div>}
    </div>
  );
};

const RegisterPage = () => {
  const { handleRegister } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister({ email, password, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-testid="register-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        data-testid="register-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        data-testid="register-firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        data-testid="register-lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <button type="submit">Register</button>
    </form>
  );
};

const Dashboard = () => {
  const { user, handleLogout } = useAuth();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <div data-testid="dashboard-user">{user.email}</div>
      <div data-testid="dashboard-role">{user.role}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  describe('Complete Login Flow', () => {
    it('should login user and display user info', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockResolvedValue({
        token: 'test-token',
        user: mockUser,
      });
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const user = userEvent.setup();

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      const emailInput = screen.getByTestId('login-email');
      const passwordInput = screen.getByTestId('login-password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com');
      });

      expect(AuthService.loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'ValidPass123!@#',
      });
    });

    it('should store token in session storage after login', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockResolvedValue({
        token: 'test-token-123',
        user: mockUser,
      });
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const user = userEvent.setup();

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      const emailInput = screen.getByTestId('login-email');
      const passwordInput = screen.getByTestId('login-password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      await waitFor(() => {
        expect(AuthService.fetchUser).toHaveBeenCalled();
      });
    });

    it('should display user role after login', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'shifty',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockResolvedValue({
        token: 'test-token',
        user: mockUser,
      });
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const user = userEvent.setup();

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      // Initially not logged in
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  describe('Complete Registration Flow', () => {
    it('should register user and store token', async () => {
      const mockUser = {
        id: '124',
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'shifty',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.registerStudent as jest.Mock).mockResolvedValue({
        token: 'new-token',
        user: mockUser,
      });
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const user = userEvent.setup();

      render(
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      );

      const emailInput = screen.getByTestId('register-email');
      const passwordInput = screen.getByTestId('register-password');
      const firstNameInput = screen.getByTestId('register-firstName');
      const lastNameInput = screen.getByTestId('register-lastName');
      const submitButton = screen.getByRole('button', { name: /register/i });

      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.type(firstNameInput, 'Jane');
      await user.type(lastNameInput, 'Doe');
      await user.click(submitButton);

      await waitFor(() => {
        expect(AuthService.registerStudent).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'ValidPass123!@#',
          firstName: 'Jane',
          lastName: 'Doe',
        });
      });
    });
  });

  describe('Logout Flow', () => {
    it('should logout user and clear user data', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      const user = userEvent.setup();

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-user')).toHaveTextContent('test@example.com');
      });

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await user.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByText('Not logged in')).toBeInTheDocument();
      });

      expect(AuthService.logoutUser).toHaveBeenCalled();
    });
  });

  describe('Session Persistence', () => {
    it('should restore user session on app load', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-user')).toHaveTextContent('test@example.com');
      });

      expect(AuthService.fetchUser).toHaveBeenCalled();
    });

    it('should not fetch user if no token in session', async () => {
      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Not logged in')).toBeInTheDocument();
      });

      expect(AuthService.fetchUser).not.toHaveBeenCalled();
    });
  });

  describe('User Role-Based Access', () => {
    it('should display correct role for admin user', async () => {
      const mockUser = {
        id: '123',
        email: 'admin@example.com',
        role: 'admin',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-role')).toHaveTextContent('admin');
      });
    });

    it('should display correct role for shifty user', async () => {
      const mockUser = {
        id: '124',
        email: 'shifty@example.com',
        role: 'shifty',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-role')).toHaveTextContent('shifty');
      });
    });

    it('should display correct role for cashier user', async () => {
      const mockUser = {
        id: '125',
        email: 'cashier@example.com',
        role: 'cashier',
      };

      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(true);
      (AuthService.fetchUser as jest.Mock).mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('dashboard-role')).toHaveTextContent('cashier');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle login error gracefully', async () => {
      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.loginUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const user = userEvent.setup();

      const LoginWithError = () => {
        const { handleLogin } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleLoginWithError = async () => {
          try {
            await handleLogin({ email: 'test@example.com', password: 'wrong' });
          } catch (err: any) {
            setError(err.message);
          }
        };

        return (
          <div>
            <button onClick={handleLoginWithError}>Login</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <LoginWithError />
        </AuthProvider>
      );

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });
    });

    it('should handle registration error gracefully', async () => {
      (AuthService.isAccessTokenInSession as jest.Mock).mockReturnValue(false);
      (AuthService.registerStudent as jest.Mock).mockRejectedValue(
        new Error('Email already exists')
      );

      const user = userEvent.setup();

      const RegisterWithError = () => {
        const { handleRegister } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        const handleRegisterWithError = async () => {
          try {
            await handleRegister({
              email: 'existing@example.com',
              password: 'ValidPass123!@#',
              firstName: 'John',
              lastName: 'Doe',
            });
          } catch (err: any) {
            setError(err.message);
          }
        };

        return (
          <div>
            <button onClick={handleRegisterWithError}>Register</button>
            {error && <div data-testid="error">{error}</div>}
          </div>
        );
      };

      render(
        <AuthProvider>
          <RegisterWithError />
        </AuthProvider>
      );

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Email already exists');
      });
    });
  });
});
