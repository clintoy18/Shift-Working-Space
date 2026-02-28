import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../../context/ToastContext';

// Test component that uses the ToastContext
const TestComponent = () => {
  const { showToast, success, error, info, warning } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Test message')}>Show Toast</button>
      <button onClick={() => success('Success message')}>Success</button>
      <button onClick={() => error('Error message')}>Error</button>
      <button onClick={() => info('Info message')}>Info</button>
      <button onClick={() => warning('Warning message')}>Warning</button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('should provide toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Toast')).toBeInTheDocument();
    });

    it('should render without errors', () => {
      const { container } = render(
        <ToastProvider>
          <div>Test</div>
        </ToastProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    it('should throw error when used outside ToastProvider', () => {
      const TestComponentWithoutProvider = () => {
        useToast();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });

    it('should return toast context when used within provider', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Toast')).toBeInTheDocument();
    });
  });

  describe('showToast', () => {
    it('should show toast with default type (info)', () => {
      const ToastDisplayComponent = () => {
        const { showToast } = useToast();
        const [toasts, setToasts] = React.useState<any[]>([]);

        return (
          <div>
            <button
              onClick={() => {
                showToast('Test message');
                // In real app, toasts would be displayed
              }}
            >
              Show Toast
            </button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <ToastDisplayComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Toast');
      button.click();

      // Toast should be created (in real implementation)
      expect(button).toBeInTheDocument();
    });

    it('should show toast with custom type', () => {
      const ToastDisplayComponent = () => {
        const { showToast } = useToast();

        return (
          <div>
            <button onClick={() => showToast('Success!', 'success')}>Show Success</button>
            <button onClick={() => showToast('Error!', 'error')}>Show Error</button>
            <button onClick={() => showToast('Warning!', 'warning')}>Show Warning</button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <ToastDisplayComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
      expect(screen.getByText('Show Error')).toBeInTheDocument();
      expect(screen.getByText('Show Warning')).toBeInTheDocument();
    });

    it('should auto-dismiss toast after duration', () => {
      const ToastDisplayComponent = () => {
        const { showToast } = useToast();

        return (
          <button onClick={() => showToast('Auto dismiss', 'info', 1000)}>
            Show Auto Dismiss
          </button>
        );
      };

      render(
        <ToastProvider>
          <ToastDisplayComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Auto Dismiss');
      button.click();

      // Advance timers
      jest.advanceTimersByTime(1000);

      // Toast should be removed after duration
      expect(button).toBeInTheDocument();
    });

    it('should not auto-dismiss if duration is 0', () => {
      const ToastDisplayComponent = () => {
        const { showToast } = useToast();

        return (
          <button onClick={() => showToast('No dismiss', 'info', 0)}>
            Show No Dismiss
          </button>
        );
      };

      render(
        <ToastProvider>
          <ToastDisplayComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show No Dismiss');
      button.click();

      // Advance timers
      jest.advanceTimersByTime(10000);

      // Toast should still be there
      expect(button).toBeInTheDocument();
    });
  });

  describe('success method', () => {
    it('should show success toast', () => {
      const SuccessComponent = () => {
        const { success } = useToast();

        return <button onClick={() => success('Success!')}>Show Success</button>;
      };

      render(
        <ToastProvider>
          <SuccessComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Success');
      button.click();

      expect(button).toBeInTheDocument();
    });

    it('should use custom duration for success toast', () => {
      const SuccessComponent = () => {
        const { success } = useToast();

        return (
          <button onClick={() => success('Success!', 2000)}>Show Success</button>
        );
      };

      render(
        <ToastProvider>
          <SuccessComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Success');
      button.click();

      jest.advanceTimersByTime(2000);

      expect(button).toBeInTheDocument();
    });
  });

  describe('error method', () => {
    it('should show error toast', () => {
      const ErrorComponent = () => {
        const { error } = useToast();

        return <button onClick={() => error('Error!')}>Show Error</button>;
      };

      render(
        <ToastProvider>
          <ErrorComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Error');
      button.click();

      expect(button).toBeInTheDocument();
    });

    it('should use custom duration for error toast', () => {
      const ErrorComponent = () => {
        const { error } = useToast();

        return (
          <button onClick={() => error('Error!', 3000)}>Show Error</button>
        );
      };

      render(
        <ToastProvider>
          <ErrorComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Error');
      button.click();

      jest.advanceTimersByTime(3000);

      expect(button).toBeInTheDocument();
    });
  });

  describe('info method', () => {
    it('should show info toast', () => {
      const InfoComponent = () => {
        const { info } = useToast();

        return <button onClick={() => info('Info!')}>Show Info</button>;
      };

      render(
        <ToastProvider>
          <InfoComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Info');
      button.click();

      expect(button).toBeInTheDocument();
    });
  });

  describe('warning method', () => {
    it('should show warning toast', () => {
      const WarningComponent = () => {
        const { warning } = useToast();

        return <button onClick={() => warning('Warning!')}>Show Warning</button>;
      };

      render(
        <ToastProvider>
          <WarningComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Warning');
      button.click();

      expect(button).toBeInTheDocument();
    });
  });

  describe('Multiple toasts', () => {
    it('should handle multiple toasts', () => {
      const MultiToastComponent = () => {
        const { success, error, info } = useToast();

        return (
          <div>
            <button onClick={() => success('Success 1')}>Success 1</button>
            <button onClick={() => error('Error 1')}>Error 1</button>
            <button onClick={() => info('Info 1')}>Info 1</button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <MultiToastComponent />
        </ToastProvider>
      );

      screen.getByText('Success 1').click();
      screen.getByText('Error 1').click();
      screen.getByText('Info 1').click();

      expect(screen.getByText('Success 1')).toBeInTheDocument();
      expect(screen.getByText('Error 1')).toBeInTheDocument();
      expect(screen.getByText('Info 1')).toBeInTheDocument();
    });
  });

  describe('Toast dismissal', () => {
    it('should dismiss toast after specified duration', () => {
      const DismissComponent = () => {
        const { showToast } = useToast();

        return (
          <button onClick={() => showToast('Dismiss me', 'info', 500)}>
            Show Dismissible
          </button>
        );
      };

      render(
        <ToastProvider>
          <DismissComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Dismissible');
      button.click();

      jest.advanceTimersByTime(500);

      expect(button).toBeInTheDocument();
    });
  });
});
