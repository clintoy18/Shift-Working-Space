import { useState, useCallback } from 'react';

interface LoaderState {
  isLoading: boolean;
  message?: string;
}

/**
 * Custom hook for managing loader state
 *
 * @example
 * const { isLoading, startLoading, stopLoading, setMessage } = useLoader();
 *
 * const handleSubmit = async () => {
 *   startLoading('Processing...');
 *   try {
 *     await someAsyncOperation();
 *   } finally {
 *     stopLoading();
 *   }
 * };
 */
export const useLoader = () => {
  const [state, setState] = useState<LoaderState>({
    isLoading: false,
    message: undefined
  });

  const startLoading = useCallback((message?: string) => {
    setState({
      isLoading: true,
      message
    });
  }, []);

  const stopLoading = useCallback(() => {
    setState({
      isLoading: false,
      message: undefined
    });
  }, []);

  const setMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      message
    }));
  }, []);

  return {
    isLoading: state.isLoading,
    message: state.message,
    startLoading,
    stopLoading,
    setMessage
  };
};

export default useLoader;
