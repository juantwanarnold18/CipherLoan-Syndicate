import { getAddress, hexlify } from 'ethers';

let fheInstance: any = null;

/**
 * Initialize FHE instance using Zama's SDK from CDN
 */
export const initializeFHEVM = async (): Promise<any> => {
  if (fheInstance) {
    console.log('[FHE] Instance already initialized');
    return fheInstance;
  }

  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask.');
  }

  try {
    console.log('[FHE] Loading SDK from CDN 0.2.0...');
    const sdk: any = await import(
      'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.js'
    );
    const { initSDK, createInstance, SepoliaConfig } = sdk;

    console.log('[FHE] Initializing WASM...');
    await initSDK();

    const config = {
      ...SepoliaConfig,
      network: window.ethereum
    };

    console.log('[FHE] Creating instance...');
    fheInstance = await createInstance(config);
    console.log('[FHE] ✅ Instance initialized successfully');

    return fheInstance;
  } catch (error) {
    console.error('[FHE] ❌ Initialization failed:', error);
    throw new Error(`FHE initialization failed: ${error}`);
  }
};

export const getFHEVMInstance = (): any => {
  return fheInstance;
};

export const resetFheInstance = (): void => {
  fheInstance = null;
  console.log('[FHE] Instance reset');
};

export const isFheInitialized = (): boolean => {
  return fheInstance !== null;
};

/**
 * Batch encrypt multiple values - returns handles as bytes32
 */
export const encryptBatch = async (
  contractAddress: string,
  userAddress: string,
  values: Array<{ value: number | bigint; type: 'uint32' | 'uint64' }>
): Promise<{ handles: string[]; inputProof: string }> => {
  let fhe = getFHEVMInstance();
  if (!fhe) {
    fhe = await initializeFHEVM();
  }
  if (!fhe) throw new Error('Failed to initialize FHE instance');

  const contractAddressChecksum = getAddress(contractAddress);
  console.log('[FHE] Creating encrypted input for batch...');

  const ciphertext = await fhe.createEncryptedInput(
    contractAddressChecksum,
    userAddress
  );

  // Add all values
  for (const { value, type } of values) {
    if (type === 'uint32') {
      ciphertext.add32(Number(value));
    } else if (type === 'uint64') {
      ciphertext.add64(BigInt(value));
    }
  }

  console.log('[FHE] Encrypting batch values...');
  const { handles, inputProof } = await ciphertext.encrypt();

  console.log('[FHE] ✅ Batch encryption successful');
  return {
    handles: handles.map((h: any) => hexlify(h)),
    inputProof: hexlify(inputProof)
  };
};
