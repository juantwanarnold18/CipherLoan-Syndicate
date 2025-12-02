import { bytesToHex, getAddress } from "viem";
import type { Address } from "viem";
import { CONTRACT_ADDRESS } from "@/config/contracts";

declare global {
    interface Window {
        RelayerSDK?: any;
        relayerSDK?: any;
        ethereum?: any;
        okxwallet?: any;
    }
}

let fheInstance: any = null;

const getSDK = () => {
    if (typeof window === "undefined") {
        throw new Error("FHE SDK requires a browser environment");
    }
    const sdk = window.RelayerSDK || window.relayerSDK;
    if (!sdk) {
        throw new Error("Relayer SDK not loaded. Ensure the CDN script tag is present.");
    }
    return sdk;
};

/**
 * Initialize FHE instance using Zama's SDK from CDN (0.3.0-5)
 */
export const initializeFHE = async (provider?: any) => {
    if (fheInstance) return fheInstance;
    if (typeof window === "undefined") {
        throw new Error("FHE SDK requires a browser environment");
    }

    const ethereumProvider =
        provider || window.ethereum || window.okxwallet?.provider || window.okxwallet;
    if (!ethereumProvider) {
        throw new Error("No wallet provider detected. Connect a wallet first.");
    }

    const sdk = getSDK();
    const { initSDK, createInstance, SepoliaConfig } = sdk;
    await initSDK();
    const config = { ...SepoliaConfig, network: ethereumProvider };
    fheInstance = await createInstance(config);
    return fheInstance;
};

// Alias for backwards compatibility
export const initializeFHEVM = initializeFHE;

const getInstance = async (provider?: any) => {
    if (fheInstance) return fheInstance;
    return initializeFHE(provider);
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
 * Check if FHE SDK is loaded and ready
 */
export const isFHEReady = (): boolean => {
    if (typeof window === "undefined") return false;
    return !!(window.RelayerSDK || window.relayerSDK);
};

export const isSDKLoaded = isFHEReady;

/**
 * Wait for FHE SDK to be loaded (with timeout)
 */
export const waitForFHE = async (timeoutMs: number = 10000): Promise<boolean> => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        if (isFHEReady()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
};

/**
 * Encrypt loan proposal values (collateral, requested amount, credit score)
 * @param userAddress - The user's wallet address
 * @param collateral - Collateral amount (uint64)
 * @param requested - Requested loan amount (uint64)
 * @param creditScore - Credit score (uint32)
 * @param provider - Optional ethereum provider
 */
export const encryptLoanProposal = async (
    userAddress: Address,
    collateral: bigint,
    requested: bigint,
    creditScore: number,
    provider?: any
): Promise<{
    collateralHandle: `0x${string}`;
    collateralProof: `0x${string}`;
    requestedHandle: `0x${string}`;
    requestedProof: `0x${string}`;
    creditScoreHandle: `0x${string}`;
    creditScoreProof: `0x${string}`;
}> => {
    console.log('[FHE] Encrypting loan proposal data...');
    const instance = await getInstance(provider);
    const contractAddr = getAddress(CONTRACT_ADDRESS);
    const userAddr = getAddress(userAddress);

    console.log('[FHE] Creating encrypted inputs for:', {
        contract: contractAddr,
        user: userAddr,
    });

    // Encrypt collateral (uint64)
    const collateralInput = instance.createEncryptedInput(contractAddr, userAddr);
    collateralInput.add64(collateral);
    const collateralResult = await collateralInput.encrypt();

    // Encrypt requested amount (uint64)
    const requestedInput = instance.createEncryptedInput(contractAddr, userAddr);
    requestedInput.add64(requested);
    const requestedResult = await requestedInput.encrypt();

    // Encrypt credit score (uint32)
    const creditScoreInput = instance.createEncryptedInput(contractAddr, userAddr);
    creditScoreInput.add32(creditScore);
    const creditScoreResult = await creditScoreInput.encrypt();

    console.log('[FHE] All values encrypted successfully');

    return {
        collateralHandle: bytesToHex(collateralResult.handles[0]) as `0x${string}`,
        collateralProof: bytesToHex(collateralResult.inputProof) as `0x${string}`,
        requestedHandle: bytesToHex(requestedResult.handles[0]) as `0x${string}`,
        requestedProof: bytesToHex(requestedResult.inputProof) as `0x${string}`,
        creditScoreHandle: bytesToHex(creditScoreResult.handles[0]) as `0x${string}`,
        creditScoreProof: bytesToHex(creditScoreResult.inputProof) as `0x${string}`,
    };
};

/**
 * Batch encrypt multiple values - returns handles as bytes32
 */
export const encryptBatch = async (
    contractAddress: string,
    userAddress: string,
    values: Array<{ value: number | bigint; type: 'uint32' | 'uint64' }>,
    provider?: any
): Promise<{ handles: `0x${string}`[]; inputProof: `0x${string}` }> => {
    const instance = await getInstance(provider);
    const contractAddressChecksum = getAddress(contractAddress);
    const userAddressChecksum = getAddress(userAddress);

    console.log('[FHE] Creating encrypted input for batch...');

    const ciphertext = instance.createEncryptedInput(
        contractAddressChecksum,
        userAddressChecksum
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

    console.log('[FHE] Batch encryption successful');
    return {
        handles: handles.map((h: Uint8Array) => bytesToHex(h) as `0x${string}`),
        inputProof: bytesToHex(inputProof) as `0x${string}`
    };
};

/**
 * Get FHE status for debugging
 */
export const getFHEStatus = (): {
    sdkLoaded: boolean;
    instanceReady: boolean;
} => {
    return {
        sdkLoaded: isFHEReady(),
        instanceReady: fheInstance !== null,
    };
};
