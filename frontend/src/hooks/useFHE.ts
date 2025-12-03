import { useState, useEffect, useCallback } from 'react';
import {
  initializeFHE,
  getFHEVMInstance,
  resetFheInstance,
  encryptBatch,
  encryptLoanProposal,
  isFheInitialized,
  isFHEReady,
  waitForFHE,
  getFHEStatus
} from '../utils/fhe';

export const useFHE = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if SDK is loaded
  useEffect(() => {
    const checkSDK = () => {
      const loaded = isFHEReady();
      setSdkLoaded(loaded);
      return loaded;
    };

    // Check immediately
    if (checkSDK()) return;

    // Poll for SDK load
    const interval = setInterval(() => {
      if (checkSDK()) {
        clearInterval(interval);
      }
    }, 100);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Initialize FHE when SDK is loaded
  const initialize = useCallback(async (provider?: any) => {
    if (isFheInitialized()) {
      setIsInitialized(true);
      return getFHEVMInstance();
    }

    if (!isFHEReady()) {
      const loaded = await waitForFHE(10000);
      if (!loaded) {
        setError('FHE SDK failed to load');
        return null;
      }
    }

    setIsInitializing(true);
    setError(null);

    try {
      const instance = await initializeFHE(provider);
      setIsInitialized(true);
      return instance;
    } catch (err: any) {
      console.error('[useFHE] Initialization error:', err);
      setError(err.message || 'FHE initialization failed');
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return {
    isInitialized,
    isInitializing,
    sdkLoaded,
    error,
    initialize,
    encryptBatch,
    encryptLoanProposal,
    resetFheInstance,
    getFHEVMInstance,
    getFHEStatus
  };
};
