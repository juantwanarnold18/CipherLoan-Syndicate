import { useState, useEffect } from 'react';
import { initializeFHEVM, getFHEVMInstance, resetFheInstance, encryptBatch, isFheInitialized } from '../utils/fhe';

export const useFHE = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (isFheInitialized()) {
        setIsInitialized(true);
        return;
      }

      setIsInitializing(true);
      try {
        await initializeFHEVM();
        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        console.error('[useFHE] Initialization error:', err);
        setError(err.message || 'FHE initialization failed');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  return {
    isInitialized,
    isInitializing,
    error,
    encryptBatch,
    resetFheInstance,
    getFHEVMInstance
  };
};
