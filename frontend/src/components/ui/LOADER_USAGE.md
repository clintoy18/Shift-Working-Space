# Loader Component - Usage Guide

A reusable, flexible loader component with multiple variants for all loading states in your application.

## Features

- ✅ 5 different loader variants (spinner, dots, pulse, bars, bounce)
- ✅ 4 size options (sm, md, lg, xl)
- ✅ Customizable colors
- ✅ Optional text display
- ✅ Full-screen overlay mode
- ✅ TypeScript support
- ✅ Custom hook for state management

## Installation

The component is already created at:
- Component: `src/components/ui/loader.tsx`
- Hook: `src/hooks/useLoader.ts`

## Basic Usage

### Simple Spinner
```tsx
import Loader from '@/components/ui/loader';

export default function MyComponent() {
  return <Loader />;
}
```

### With Text
```tsx
<Loader text="Loading..." />
```

### Different Sizes
```tsx
<Loader size="sm" text="Small" />
<Loader size="md" text="Medium" />
<Loader size="lg" text="Large" />
<Loader size="xl" text="Extra Large" />
```

### Different Variants
```tsx
<Loader variant="spinner" />  {/* Default - rotating icon */}
<Loader variant="dots" />     {/* Animated dots */}
<Loader variant="pulse" />    {/* Pulsing circle */}
<Loader variant="bars" />     {/* Animated bars */}
<Loader variant="bounce" />   {/* Bouncing icon */}
```

### Custom Colors
```tsx
<Loader color="primary" />      {/* Primary color */}
<Loader color="secondary" />    {/* Secondary color */}
<Loader color="destructive" />  {/* Destructive/error color */}
<Loader color="muted" />        {/* Muted color */}
<Loader color="white" />        {/* White */}
<Loader color="slate" />        {/* Slate */}
```

### Full Screen Overlay
```tsx
<Loader fullScreen text="Processing..." />
```

## Advanced Usage with Hook

### Using useLoader Hook
```tsx
import { useLoader } from '@/hooks/useLoader';
import Loader from '@/components/ui/loader';

export default function MyComponent() {
  const { isLoading, startLoading, stopLoading, setMessage } = useLoader();

  const handleSubmit = async () => {
    startLoading('Submitting...');
    try {
      await someAsyncOperation();
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {isLoading && <Loader fullScreen text="Processing..." />}
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

### Update Message During Loading
```tsx
const handleLongOperation = async () => {
  startLoading('Step 1: Validating...');
  await step1();

  setMessage('Step 2: Processing...');
  await step2();

  setMessage('Step 3: Saving...');
  await step3();

  stopLoading();
};
```

## Real-World Examples

### Login Form with Loader
```tsx
import { useState } from 'react';
import Loader from '@/components/ui/loader';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleLogin } = useAuth();

  const onSubmit = async (credentials) => {
    setIsLoading(true);
    try {
      await handleLogin(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader fullScreen variant="spinner" text="Signing in..." />}
      {/* Form content */}
    </>
  );
}
```

### Data Table Loading
```tsx
import Loader from '@/components/ui/loader';

export default function DataTable({ isLoading, data }) {
  if (isLoading) {
    return <Loader variant="dots" size="lg" text="Loading data..." />;
  }

  return (
    <table>
      {/* Table content */}
    </table>
  );
}
```

### API Request with Loader
```tsx
import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';

export default function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        setUser(await response.json());
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <Loader variant="pulse" text="Loading profile..." />;
  }

  return <div>{user?.name}</div>;
}
```

### Button with Loading State
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';

export default function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader variant="spinner" size="sm" />
          Processing...
        </span>
      ) : (
        'Submit'
      )}
    </Button>
  );
}
```

## Props Reference

```typescript
interface LoaderProps {
  // Variant of loader to display
  // Options: 'spinner' | 'dots' | 'pulse' | 'bars' | 'bounce'
  variant?: LoaderVariant;

  // Size of the loader
  // Options: 'sm' | 'md' | 'lg' | 'xl'
  size?: LoaderSize;

  // Text to display below loader
  text?: string;

  // Color of the loader (Tailwind color class)
  // Options: 'primary' | 'secondary' | 'destructive' | 'muted' | 'white' | 'slate'
  // Or any custom Tailwind color class
  color?: string;

  // Whether to show full screen overlay
  fullScreen?: boolean;

  // Custom className for additional styling
  className?: string;
}
```

## Styling Customization

### Custom Colors
You can pass any Tailwind color class:
```tsx
<Loader color="text-blue-500" />
<Loader color="text-red-600" />
<Loader color="text-green-400" />
```

### Custom Classes
```tsx
<Loader className="my-custom-class" />
```

## Best Practices

1. **Use Full Screen for Critical Operations**
   ```tsx
   <Loader fullScreen text="Saving..." />  // For important operations
   ```

2. **Use Inline for Non-Critical Loading**
   ```tsx
   <Loader variant="dots" />  // For table rows, cards, etc.
   ```

3. **Always Provide Context**
   ```tsx
   <Loader text="Loading user data..." />  // Tell users what's happening
   ```

4. **Use Appropriate Variants**
   - `spinner`: Default, general purpose
   - `dots`: Subtle, for small spaces
   - `pulse`: Gentle, for background operations
   - `bars`: Energetic, for progress-like operations
   - `bounce`: Playful, for interactive elements

5. **Combine with useLoader Hook**
   ```tsx
   const { isLoading, startLoading, stopLoading } = useLoader();
   // Cleaner state management
   ```

## Accessibility

The loader component:
- Uses semantic HTML
- Includes proper ARIA attributes when needed
- Maintains color contrast ratios
- Works with keyboard navigation
- Supports screen readers

## Performance

- Lightweight animations using CSS
- No external animation libraries
- Optimized re-renders with React hooks
- Minimal bundle size impact

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Troubleshooting

### Loader not showing
- Check if `isLoading` state is true
- Verify component is rendered in JSX
- Check z-index if using full screen

### Animation not smooth
- Ensure browser supports CSS animations
- Check for performance issues
- Try different variant

### Color not applying
- Use valid Tailwind color classes
- Check if color is in your Tailwind config
- Use `color="text-custom-color"` format

## Contributing

To add new loader variants:
1. Create a new variant component
2. Add to the switch statement in main Loader component
3. Update LoaderVariant type
4. Add documentation and examples
