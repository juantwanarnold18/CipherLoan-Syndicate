import React from 'react';
import { notification } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, ExportOutlined } from '@ant-design/icons';

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx";

// Store notification keys for management
const notificationKeys: Map<string, string> = new Map();

/**
 * Create explorer link component
 */
const ExplorerLink: React.FC<{ hash: string; text?: string }> = ({ hash, text = "View on Etherscan" }) => (
  <a
    href={`${SEPOLIA_EXPLORER}/${hash}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: '#00D4FF',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {text}
    <ExportOutlined style={{ fontSize: 11 }} />
  </a>
);

/**
 * Show transaction pending notification
 */
export const toastTxPending = (hash: `0x${string}`, message?: string) => {
  const key = `tx-${hash}`;
  notificationKeys.set(hash, key);

  notification.open({
    key,
    message: message || 'Transaction Submitted',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          Waiting for confirmation...
        </span>
        <ExplorerLink hash={hash} />
      </div>
    ),
    icon: <LoadingOutlined style={{ color: '#0052FF' }} spin />,
    duration: 0, // Don't auto close
    placement: 'topRight',
    style: {
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 82, 255, 0.3)',
      borderRadius: 8,
    },
  });
};

/**
 * Show transaction success notification
 */
export const toastTxSuccess = (hash: `0x${string}`, message: string) => {
  const key = notificationKeys.get(hash) || `tx-${hash}`;

  notification.success({
    key,
    message: 'Transaction Confirmed',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          {message}
        </span>
        <ExplorerLink hash={hash} />
      </div>
    ),
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    duration: 6,
    placement: 'topRight',
    style: {
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(82, 196, 26, 0.3)',
      borderRadius: 8,
    },
  });

  notificationKeys.delete(hash);
};

/**
 * Show transaction error notification
 */
export const toastTxError = (hash: `0x${string}` | undefined, error: Error | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Transaction failed';
  const key = hash ? (notificationKeys.get(hash) || `tx-${hash}`) : `error-${Date.now()}`;

  notification.error({
    key,
    message: 'Transaction Failed',
    description: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 13 }}>
          {errorMessage.length > 100 ? errorMessage.substring(0, 100) + '...' : errorMessage}
        </span>
        {hash && <ExplorerLink hash={hash} />}
      </div>
    ),
    icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    duration: 8,
    placement: 'topRight',
    style: {
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 77, 79, 0.3)',
      borderRadius: 8,
    },
  });

  if (hash) {
    notificationKeys.delete(hash);
  }
};

/**
 * Show user rejected notification
 */
export const toastUserRejected = () => {
  notification.warning({
    message: 'Transaction Cancelled',
    description: 'You rejected the transaction in your wallet.',
    duration: 4,
    placement: 'topRight',
    style: {
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(250, 173, 20, 0.3)',
      borderRadius: 8,
    },
  });
};

/**
 * Show encryption status notification
 */
export const toastEncrypting = () => {
  const key = 'encrypting';
  notification.open({
    key,
    message: 'Encrypting Data',
    description: 'Encrypting your sensitive data using FHE...',
    icon: <LoadingOutlined style={{ color: '#00D4FF' }} spin />,
    duration: 0,
    placement: 'topRight',
    style: {
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: 8,
    },
  });
  return key;
};

/**
 * Close encryption notification
 */
export const closeEncryptingToast = () => {
  notification.destroy('encrypting');
};

/**
 * Dismiss specific notification by hash
 */
export const dismissTxToast = (hash: `0x${string}`) => {
  const key = notificationKeys.get(hash);
  if (key) {
    notification.destroy(key);
    notificationKeys.delete(hash);
  }
};

/**
 * Check if error is user rejection
 */
export const isUserRejection = (error: Error | any): boolean => {
  const message = error?.message || String(error);
  return (
    message.includes('User rejected') ||
    message.includes('user rejected') ||
    message.includes('User denied') ||
    message.includes('rejected the request') ||
    message.includes('ACTION_REJECTED')
  );
};
