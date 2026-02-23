# Loader Component - Quick Reference

## 🚀 Quick Start

### Import
```tsx
import Loader from '@/components/ui/loader';
import { useLoader } from '@/hooks/useLoader';
```

### Basic Usage
```tsx
<Loader />
<Loader text="Loading..." />
<Loader fullScreen text="Processing..." />
```

## 📋 Variants

| Variant | Use Case | Example |
|---------|----------|---------|
| `spinner` | Default, general purpose | `<Loader variant="spinner" />` |
| `dots` | Subtle, small spaces | `<Loader variant="dots" />` |
| `pulse` | Gentle, background ops | `<Loader variant="pulse" />` |
| `bars` | Energetic, progress-like | `<Loader variant="bars" />` |
| `bounce` | Playful, interactive | `<Loader variant="bounce" />` |

## 📏 Sizes

| Size | Use Case |
|------|----------|
| `sm` | Small inline loaders |
| `md` | Default, most common |
| `lg` | Large, prominent loaders |
| `xl` | Extra large, full screen |

## 🎨 Colors

```tsx
<Loader color="primary" />      // Primary brand color
<Loader color="secondary" />    // Secondary color
<Loader color="destructive" />  // Error/destructive
<Loader color="muted" />        // Subtle gray
<Loader color="white" />        // White
<Loader color="slate" />        // Slate gray
```

## 🪝 Using the Hook

```tsx
const { isLoading, startLoading, stopLoading, setMessage } = useLoader();

// Start loading
startLoading('Processing...');

// Update message
setMessage('Step 2 of 3...');

// Stop loading
stopLoading();
```

## 💡 Common Patterns

### Login Form
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (credentials) => {
  setIsLoading(true);
  try {
    await loginUser(credentials);
  } finally {
    setIsLoading(false);
  }
};

return (
  <>
    {isLoading && <Loader fullScreen text="Signing in..." />}
    {/* Form */}
  </>
);
```

### Data Table
```tsx
{isLoading ? (
  <Loader variant="dots" size="lg" text="Loading data..." />
) : (
  <Table data={data} />
)}
```

### Button with Loading
```tsx
<Button disabled={isLoading}>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <Loader variant="spinner" size="sm" />
      Processing...
    </span>
  ) : (
    'Submit'
  )}
</Button>
```

### Multi-Step Process
```tsx
const { isLoading, startLoading, setMessage, stopLoading } = useLoader();

const handleMultiStep = async () => {
  startLoading('Step 1: Validating...');
  await step1();

  setMessage('Step 2: Processing...');
  await step2();

  setMessage('Step 3: Saving...');
  await step3();

  stopLoading();
};
```

## 📁 File Locations

- **Component**: `frontend/src/components/ui/loader.tsx`
- **Hook**: `frontend/src/hooks/useLoader.ts`
- **Documentation**: `frontend/src/components/ui/LOADER_USAGE.md`
- **Showcase**: `frontend/src/components/examples/LoaderShowcase.tsx`

## 🔧 Props

```typescript
interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'bounce';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  color?: string;
  fullScreen?: boolean;
  className?: string;
}
```

## ✨ Features

- ✅ 5 animation variants
- ✅ 4 size options
- ✅ Customizable colors
- ✅ Full-screen overlay mode
- ✅ Optional text display
- ✅ TypeScript support
- ✅ Custom hook for state management
- ✅ Lightweight (CSS animations only)
- ✅ No external dependencies
- ✅ Accessible and performant

## 🎯 Best Practices

1. **Use full screen for critical operations**
   ```tsx
   <Loader fullScreen text="Saving..." />
   ```

2. **Provide descriptive text**
   ```tsx
   <Loader text="Loading user profile..." />
   ```

3. **Use appropriate variants**
   - Spinner: General purpose
   - Dots: Subtle, non-intrusive
   - Pulse: Background operations
   - Bars: Progress-like operations
   - Bounce: Interactive elements

4. **Use the hook for cleaner code**
   ```tsx
   const { isLoading, startLoading, stopLoading } = useLoader();
   ```

5. **Always stop loading in finally block**
   ```tsx
   try {
     await operation();
   } finally {
     stopLoading();
   }
   ```

## 🧪 Testing

View all variants and configurations:
1. Import `LoaderShowcase` component
2. Add to your routes
3. Visit the showcase page to see all options

```tsx
import LoaderShowcase from '@/components/examples/LoaderShowcase';

// In your routes
<Route path="/loader-showcase" element={<LoaderShowcase />} />
```

## 📚 More Examples

See `frontend/src/components/ui/LOADER_USAGE.md` for:
- Detailed usage examples
- Real-world use cases
- Styling customization
- Accessibility features
- Troubleshooting guide

## 🚀 Ready to Use!

The Loader component is production-ready and can be used throughout your application immediately.

```tsx
// Just import and use!
import Loader from '@/components/ui/loader';

<Loader text="Loading..." />
```
