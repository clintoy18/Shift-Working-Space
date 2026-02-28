import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Button component for testing
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with label', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render button with children', () => {
      render(
        <Button>
          <span>Child content</span>
        </Button>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should have button role', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText('Click me');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick handler multiple times', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText('Click me');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByText('Click me');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      expect(screen.getByText('Disabled Button')).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<Button disabled={false}>Enabled Button</Button>);
      expect(screen.getByText('Enabled Button')).not.toBeDisabled();
    });

    it('should be enabled by default', () => {
      render(<Button>Default Button</Button>);
      expect(screen.getByText('Default Button')).not.toBeDisabled();
    });

    it('should have disabled attribute when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe('Variants', () => {
    it('should render primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render primary variant when specified', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('bg-blue-600');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByText('Secondary');
      expect(button).toHaveClass('bg-gray-200');
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByText('Danger');
      expect(button).toHaveClass('bg-red-600');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Styled</Button>);
      const button = screen.getByText('Styled');
      expect(button).toHaveClass('custom-class');
    });

    it('should combine base styles with custom className', () => {
      render(<Button className="custom-class">Styled</Button>);
      const button = screen.getByText('Styled');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard Button</Button>);

      const button = screen.getByText('Keyboard Button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });

    it('should have proper button semantics', () => {
      render(<Button>Semantic Button</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Content Types', () => {
    it('should render text content', () => {
      render(<Button>Text Button</Button>);
      expect(screen.getByText('Text Button')).toBeInTheDocument();
    });

    it('should render element content', () => {
      render(
        <Button>
          <span data-testid="icon">🎉</span> Celebrate
        </Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });
});
