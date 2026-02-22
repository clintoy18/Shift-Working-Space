import React, { useState } from 'react';
import Loader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Showcase component demonstrating all Loader variants and configurations
 * This is for development/documentation purposes
 */
const LoaderShowcase: React.FC = () => {
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  const variants = ['spinner', 'dots', 'pulse', 'bars', 'bounce'] as const;
  const sizes = ['sm', 'md', 'lg', 'xl'] as const;
  const colors = ['primary', 'secondary', 'destructive', 'muted', 'white', 'slate'] as const;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Loader Component Showcase</h1>
          <p className="text-muted-foreground">
            Explore all variants, sizes, and configurations of the reusable Loader component
          </p>
        </div>

        {/* Full Screen Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Full Screen Loader</CardTitle>
            <CardDescription>Overlay loader for critical operations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setFullScreenLoading(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Show Full Screen Loader
            </Button>
            {fullScreenLoading && (
              <Loader
                fullScreen
                variant="spinner"
                size="lg"
                text="Processing your request..."
              />
            )}
            {fullScreenLoading && (
              <Button
                onClick={() => setFullScreenLoading(false)}
                variant="outline"
                className="ml-2"
              >
                Close
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Loader Variants</CardTitle>
            <CardDescription>Different animation styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {variants.map((variant) => (
                <div key={variant} className="flex flex-col items-center gap-4">
                  <Loader
                    variant={variant}
                    size="md"
                    text={variant}
                  />
                  <p className="text-xs text-muted-foreground capitalize">{variant}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Loader Sizes</CardTitle>
            <CardDescription>Small, Medium, Large, and Extra Large</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-4">
                  <Loader
                    variant="spinner"
                    size={size}
                    text={size}
                  />
                  <p className="text-xs text-muted-foreground capitalize">{size}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Loader Colors</CardTitle>
            <CardDescription>Different color options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-4">
                  <Loader
                    variant="spinner"
                    size="md"
                    color={color}
                    text={color}
                  />
                  <p className="text-xs text-muted-foreground capitalize">{color}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Combinations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Combinations</CardTitle>
            <CardDescription>Common use cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Login Loading */}
              <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
                <Loader
                  variant="spinner"
                  size="lg"
                  color="primary"
                  text="Signing in..."
                />
                <p className="text-xs text-muted-foreground">Login Form</p>
              </div>

              {/* Data Loading */}
              <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
                <Loader
                  variant="dots"
                  size="md"
                  color="primary"
                  text="Loading data..."
                />
                <p className="text-xs text-muted-foreground">Data Table</p>
              </div>

              {/* Processing */}
              <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
                <Loader
                  variant="bars"
                  size="md"
                  color="primary"
                  text="Processing..."
                />
                <p className="text-xs text-muted-foreground">File Upload</p>
              </div>

              {/* Subtle Loading */}
              <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
                <Loader
                  variant="pulse"
                  size="sm"
                  color="muted"
                  text="Loading..."
                />
                <p className="text-xs text-muted-foreground">Background Task</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>Copy and paste ready code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Spinner</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`<Loader />`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">With Text</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`<Loader text="Loading..." size="lg" />`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Full Screen</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`<Loader fullScreen text="Processing..." />`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">With Hook</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`const { isLoading, startLoading, stopLoading } = useLoader();

const handleSubmit = async () => {
  startLoading('Submitting...');
  try {
    await someAsyncOperation();
  } finally {
    stopLoading();
  }
};`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Tips</CardTitle>
            <CardDescription>Best practices for using the Loader component</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Use <code className="bg-muted px-2 py-1 rounded">fullScreen</code> for critical operations like form submission</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Use inline loaders for non-blocking operations like data table loading</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Always provide descriptive text to inform users what's happening</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Use <code className="bg-muted px-2 py-1 rounded">useLoader</code> hook for cleaner state management</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Choose appropriate variants based on context (spinner for general, dots for subtle, bars for progress)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoaderShowcase;
