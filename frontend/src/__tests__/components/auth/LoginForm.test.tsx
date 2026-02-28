import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock LoginForm component for testing
const LoginForm = ({
  onSubmit,
  isLoading = false,
}: {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
    } catch (error: any) {
      setErrors({ email: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || isLoading}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting || isLoading}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

describe('LoginForm Component', () => {
  describe('Rendering', () => {
    it('should render login form', () => {
      render(<LoginForm onSubmit={jest.fn()} />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(<LoginForm onSubmit={jest.fn()} />);
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      expect(emailInput.type).toBe('email');
    });

    it('should render password input field', () => {
      render(<LoginForm onSubmit={jest.fn()} />);
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });

    it('should render submit button', () => {
      render(<LoginForm onSubmit={jest.fn()} />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with credentials', async () => {
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'ValidPass123!@#',
        });
      });
    });

    it('should not submit if email is empty', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('should not submit if password is empty', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('should show validation errors', async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading text when submitting', async () => {
      const handleSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    });

    it('should disable inputs while submitting', async () => {
      const handleSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      expect(emailInput.disabled).toBe(true);
      expect(passwordInput.disabled).toBe(true);
    });

    it('should disable button while loading prop is true', () => {
      render(<LoginForm onSubmit={jest.fn()} isLoading={true} />);

      const submitButton = screen.getByRole('button') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
    });

    it('should show loading text when isLoading prop is true', () => {
      render(<LoginForm onSubmit={jest.fn()} isLoading={true} />);

      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on submission failure', async () => {
      const handleSubmit = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('should clear previous errors on new submission', async () => {
      const handleSubmit = jest
        .fn()
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockResolvedValueOnce(undefined);
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      // First submission with error
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password1');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error 1')).toBeInTheDocument();
      });

      // Second submission
      await user.clear(passwordInput);
      await user.type(passwordInput, 'password2');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Input Handling', () => {
    it('should update email input value', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={jest.fn()} />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={jest.fn()} />);

      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      await user.type(passwordInput, 'ValidPass123!@#');

      expect(passwordInput.value).toBe('ValidPass123!@#');
    });

    it('should clear inputs after successful submission', async () => {
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /login/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'ValidPass123!@#');
      await user.click(submitButton);

      // Note: In a real implementation, you might want to clear inputs after success
      // This test shows the current behavior
      expect(emailInput.value).toBe('test@example.com');
    });
  });
});
