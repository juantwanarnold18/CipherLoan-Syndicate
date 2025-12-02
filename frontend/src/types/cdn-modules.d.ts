// Type declarations for Zama Relayer SDK loaded from CDN
// The SDK is loaded via script tag in index.html and exposed on window object

interface RelayerSDK {
  initSDK(): Promise<void>;
  createInstance(config: any): Promise<any>;
  SepoliaConfig: {
    network?: any;
    gatewayUrl?: string;
    [key: string]: any;
  };
}

declare global {
  interface Window {
    RelayerSDK?: RelayerSDK;
    relayerSDK?: RelayerSDK;
  }
}

export {};
