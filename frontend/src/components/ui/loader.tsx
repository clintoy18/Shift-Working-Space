import React from 'react';
import { Loader2, Zap } from 'lucide-react';

type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'bars' | 'bounce';
type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
  /**
   * Variant of loader to display
   * @default 'spinner'
   */
  variant?: LoaderVariant;

  /**
   * Size of the loader
   * @default 'md'
   */
  size?: LoaderSize;

  /**
   * Text to display below loader
   */
  text?: string;

  /**
   * Color of the loader (Tailwind color class)
   * @default 'primary'
   */
  color?: string;

  /**
   * Whether to show full screen overlay
   * @default false
   */
  fullScreen?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;
}

const sizeMap = {
  sm: {
    icon: 'w-4 h-4',
    text: 'text-xs',
    container: 'gap-2'
  },
  md: {
    icon: 'w-6 h-6',
    text: 'text-sm',
    container: 'gap-3'
  },
  lg: {
    icon: 'w-8 h-8',
    text: 'text-base',
    container: 'gap-4'
  },
  xl: {
    icon: 'w-10 h-10',
    text: 'text-lg',
    container: 'gap-4'
  }
};

const colorMap: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
  white: 'text-white',
  slate: 'text-slate-600'
};

/**
 * Spinner variant - rotating icon
 */
const SpinnerVariant: React.FC<{ size: LoaderSize; color: string }> = ({ size, color }) => (
  <Loader2 className={`${sizeMap[size].icon} ${colorMap[color] || color} animate-spin`} />
);

/**
 * Dots variant - animated dots
 */
const DotsVariant: React.FC<{ size: LoaderSize; color: string }> = ({ size, color }) => {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${dotSize} ${colorMap[color] || color} rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Pulse variant - pulsing circle
 */
const PulseVariant: React.FC<{ size: LoaderSize; color: string }> = ({ size, color }) => (
  <div className={`${sizeMap[size].icon} ${colorMap[color] || color} rounded-full animate-pulse bg-current opacity-75`} />
);

/**
 * Bars variant - animated bars
 */
const BarsVariant: React.FC<{ size: LoaderSize; color: string }> = ({ size, color }) => {
  const barHeight = size === 'sm' ? 'h-3' : size === 'md' ? 'h-4' : size === 'lg' ? 'h-5' : 'h-6';
  const barWidth = size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-2.5';

  return (
    <div className="flex gap-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${barWidth} ${barHeight} ${colorMap[color] || color} rounded-sm`}
          style={{
            animation: `bars 0.8s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <style>{`
        @keyframes bars {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/**
 * Bounce variant - bouncing icon
 */
const BounceVariant: React.FC<{ size: LoaderSize; color: string }> = ({ size, color }) => (
  <Zap className={`${sizeMap[size].icon} ${colorMap[color] || color} animate-bounce`} />
);

/**
 * Main Loader Component
 *
 * @example
 * // Basic usage
 * <Loader />
 *
 * @example
 * // With text
 * <Loader text="Loading..." size="lg" />
 *
 * @example
 * // Full screen overlay
 * <Loader fullScreen text="Please wait..." />
 *
 * @example
 * // Different variants
 * <Loader variant="dots" size="md" color="primary" />
 */
const Loader: React.FC<LoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  color = 'primary',
  fullScreen = false,
  className = ''
}) => {
  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant size={size} color={color} />;
      case 'pulse':
        return <PulseVariant size={size} color={color} />;
      case 'bars':
        return <BarsVariant size={size} color={color} />;
      case 'bounce':
        return <BounceVariant size={size} color={color} />;
      case 'spinner':
      default:
        return <SpinnerVariant size={size} color={color} />;
    }
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${sizeMap[size].container} ${className}`}>
      {renderVariant()}
      {text && (
        <p className={`${sizeMap[size].text} text-muted-foreground font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
export type { LoaderProps, LoaderVariant, LoaderSize };
