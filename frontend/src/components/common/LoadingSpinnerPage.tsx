import Loader from '@/components/ui/loader';

/**
 * Full-screen spinner for page-level loading states
 * @deprecated Use Loader component directly with fullScreen prop
 * @example <FullPageSpinner text="Loading..." />
 */
export const FullPageSpinner = ({ text = "Loading..." }: { text?: string }) => {
  return <Loader fullScreen variant="spinner" size="lg" text={text} />;
};

/**
 * Inline/compact spinner for cards, buttons, tables, etc.
 * @deprecated Use Loader component directly
 * @example <InlineSpinner />
 */
export const InlineSpinner = ({ size = 'md', color = 'primary' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) => {
  return <Loader variant="spinner" size={size} color={color} />;
};

// Default export remains the full-page version for backward compatibility
export default FullPageSpinner;
