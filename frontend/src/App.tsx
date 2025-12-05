import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton, darkTheme } from '@rainbow-me/rainbowkit';
import { App as AntApp, ConfigProvider, theme, Card, Typography, Form, InputNumber, Button, Spin, Row, Col, Divider, Badge, Tag, message } from 'antd';
import { LockOutlined, GithubOutlined, RocketOutlined, SafetyOutlined, ThunderboltOutlined, BlockOutlined, ExperimentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { config } from './config/wagmi';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { useFHE } from './hooks/useFHE';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contracts';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import {
  toastTxPending,
  toastTxSuccess,
  toastTxError,
  toastUserRejected,
  toastEncrypting,
  closeEncryptingToast,
  isUserRejection,
} from './utils/toast-utils';
import '@rainbow-me/rainbowkit/styles.css';

const { Title, Text, Paragraph, Link } = Typography;
const queryClient = new QueryClient();

function SubmitProposal() {
  const [form] = Form.useForm();
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState('');
  const { encryptBatch } = useFHE();

  const handleSubmit = async (values: any) => {
    if (!isConnected || !address) {
      message.error('Please connect wallet first');
      return;
    }

    setLoading(true);
    let txHash: `0x${string}` | undefined;

    try {
      // Step 1: Encrypt sensitive data
      setEncryptionStatus('Encrypting your data with FHE...');
      toastEncrypting();
      console.log('[Submit] Starting FHE encryption...');

      const dataToEncrypt = [
        { value: BigInt(values.collateral), type: 'uint64' as const },
        { value: BigInt(values.amount), type: 'uint64' as const },
        { value: values.creditScore, type: 'uint32' as const },
      ];

      const { handles, inputProof } = await encryptBatch(
        CONTRACT_ADDRESS,
        address,
        dataToEncrypt
      );

      console.log('[Submit] Encryption successful:', { handles, inputProof });
      closeEncryptingToast();

      // Step 2: Generate proposal ID
      const proposalId = `0x${Date.now().toString(16).padStart(64, '0')}`;

      // Step 3: Submit to smart contract
      setEncryptionStatus('Submitting to blockchain...');
      console.log('[Submit] Calling smart contract...');

      txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'submitProposal',
        args: [
          proposalId as `0x${string}`,
          handles[0] as `0x${string}`,      // externalEuint64 collateralCt
          inputProof as `0x${string}`,      // collateralProof
          handles[1] as `0x${string}`,      // externalEuint64 requestedCt
          inputProof as `0x${string}`,      // requestedProof
          handles[2] as `0x${string}`,      // externalEuint32 creditScoreCt
          inputProof as `0x${string}`,      // creditScoreProof
        ],
      });

      console.log('[Submit] Transaction submitted:', txHash);

      // Show pending notification with explorer link
      toastTxPending(txHash, 'Submitting Loan Proposal');
      setEncryptionStatus('Waiting for confirmation...');

      // Step 4: Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(config, { hash: txHash });

      console.log('[Submit] Transaction confirmed:', receipt);

      if (receipt.status === 'success') {
        toastTxSuccess(txHash, 'Loan proposal submitted successfully!');
        form.resetFields();
      } else {
        throw new Error('Transaction reverted on-chain');
      }

    } catch (error: any) {
      console.error('[Submit] Error:', error);
      closeEncryptingToast();

      // Handle different error types
      if (isUserRejection(error)) {
        toastUserRejected();
      } else if (error.message?.includes('FHE') || error.message?.includes('encrypt')) {
        toastTxError(undefined, new Error('FHE encryption failed: ' + (error.shortMessage || error.message)));
      } else {
        toastTxError(txHash, error);
      }
    } finally {
      setLoading(false);
      setEncryptionStatus('');
    }
  };

  if (!isConnected) {
    return (
      <Card
        bordered={false}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          padding: '32px 20px'
        }}
      >
        <Title level={3} style={{ color: '#fff', marginBottom: 12, fontSize: '22px' }}>
          Connect Your Wallet
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.65)', marginBottom: 20, fontSize: '14px' }}>
          Connect your wallet to submit a loan proposal with encrypted data
        </Paragraph>
        <ConnectButton />
      </Card>
    );
  }

  return (
    <Card
      bordered={false}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Title level={3} style={{ margin: 0, color: '#fff', marginBottom: 20, fontSize: '22px' }}>
        <LockOutlined /> Submit Loan Proposal
      </Title>

      {encryptionStatus && (
        <Card
          bordered={false}
          style={{
            marginBottom: 20,
            background: 'rgba(0, 82, 255, 0.1)',
            border: '1px solid rgba(0, 82, 255, 0.3)'
          }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Spin size="small" />
            <Text style={{ color: '#0052FF', fontSize: '14px' }}>{encryptionStatus}</Text>
          </div>
        </Card>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label={<span style={{ color: '#fff', fontSize: '14px' }}>Requested Amount (USD)</span>}
          name="amount"
          rules={[{ required: true, message: 'Please enter requested amount' }]}
          style={{ marginBottom: 16 }}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1000}
            max={10000000}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
            placeholder="1,000,000"
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#fff', fontSize: '14px' }}>Collateral Value (USD)</span>}
          name="collateral"
          rules={[{ required: true, message: 'Please enter collateral value' }]}
          style={{ marginBottom: 16 }}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100000000}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
            placeholder="1,500,000"
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: '#fff', fontSize: '14px' }}>Credit Score</span>}
          name="creditScore"
          rules={[
            { required: true, message: 'Please enter credit score' },
            { type: 'number', min: 300, max: 850, message: 'Credit score must be between 300-850' }
          ]}
          style={{ marginBottom: 20 }}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={300}
            max={850}
            placeholder="750"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            icon={<LockOutlined />}
            style={{
              height: 44,
              fontSize: 15,
              background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
              border: 'none'
            }}
          >
            {loading ? 'Processing...' : 'Encrypt & Submit Proposal'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

function HeroSection() {
  const [showSubmit, setShowSubmit] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px 16px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LockOutlined style={{ fontSize: 32, color: '#0052FF' }} />
          <Title level={2} style={{ margin: 0, color: '#fff', fontSize: '24px' }}>
            CipherFi
          </Title>
        </div>
        <ConnectButton />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {!showSubmit ? (
          <>
            {/* Hero Banner */}
            <div style={{ textAlign: 'center', marginBottom: 60, padding: '40px 20px' }}>
              <Badge.Ribbon text="Demo v1.0" color="#0052FF">
                <div>
                  <Title level={1} style={{ color: '#fff', fontSize: '48px', marginBottom: 20, fontWeight: 700 }}>
                    Privacy-Preserving Encrypted Finance
                  </Title>
                  <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 18, maxWidth: 700, margin: '0 auto 30px' }}>
                    Submit financial proposals with <Text strong style={{ color: '#0052FF' }}>fully encrypted</Text> data.
                    Your collateral, loan amount, and credit score remain <Text strong style={{ color: '#00D4FF' }}>private on-chain</Text> using
                    Zama's Fully Homomorphic Encryption (FHE) technology.
                  </Paragraph>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<RocketOutlined />}
                      onClick={() => setShowSubmit(true)}
                      style={{
                        height: 48,
                        fontSize: 16,
                        background: 'linear-gradient(135deg, #0052FF 0%, #00D4FF 100%)',
                        border: 'none',
                        minWidth: 180
                      }}
                    >
                      Launch Demo
                    </Button>
                    <Button
                      size="large"
                      icon={<GithubOutlined />}
                      href="https://github.com/cipherfi/cipherfi"
                      target="_blank"
                      style={{
                        height: 48,
                        fontSize: 16,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        minWidth: 180
                      }}
                    >
                      View on GitHub
                    </Button>
                  </div>
                </div>
              </Badge.Ribbon>
            </div>

            {/* Features Grid */}
            <Row gutter={[24, 24]} style={{ marginBottom: 60 }}>
              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <SafetyOutlined style={{ fontSize: 40, color: '#0052FF', marginBottom: 16 }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: 12 }}>
                    End-to-End Encryption
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                    Your financial data is encrypted on the client side and remains encrypted throughout the entire process.
                    No one can see your sensitive information.
                  </Text>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <BlockOutlined style={{ fontSize: 40, color: '#00D4FF', marginBottom: 16 }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: 12 }}>
                    On-Chain Privacy
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                    Powered by Zama's FHE technology, your data stays encrypted even when stored and computed on the blockchain.
                  </Text>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  bordered={false}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <ThunderboltOutlined style={{ fontSize: 40, color: '#FFD700', marginBottom: 16 }} />
                  <Title level={4} style={{ color: '#fff', marginBottom: 12 }}>
                    Instant Verification
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14 }}>
                    Smart contracts can verify and process your encrypted loan proposal without decrypting your data.
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Tech Stack */}
            <Card
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: 60
              }}
              bodyStyle={{ padding: 32 }}
            >
              <Title level={3} style={{ color: '#fff', marginBottom: 24, textAlign: 'center' }}>
                <ExperimentOutlined /> Technology Stack
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Tag color="blue" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    Zama FHE
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="cyan" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    Solidity
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="geekblue" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    React + Vite
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="purple" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    RainbowKit
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="magenta" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    Hardhat
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="volcano" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    TypeScript
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="orange" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    Ant Design
                  </Tag>
                </Col>
                <Col xs={12} sm={6}>
                  <Tag color="green" style={{ fontSize: 14, padding: '6px 12px', width: '100%', textAlign: 'center' }}>
                    Sepolia
                  </Tag>
                </Col>
              </Row>
            </Card>

            {/* Project Info */}
            <Card
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              bodyStyle={{ padding: 32 }}
            >
              <Title level={4} style={{ color: '#fff', marginBottom: 20 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> About This Demo
              </Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 15, marginBottom: 16 }}>
                <Text strong style={{ color: '#0052FF' }}>CipherFi</Text> is a proof-of-concept demonstration of privacy-preserving finance
                using Fully Homomorphic Encryption. The project showcases how sensitive financial data can be kept encrypted throughout
                the entire lifecycle on the blockchain.
              </Paragraph>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 15, marginBottom: 16 }}>
                <Text strong style={{ color: '#00D4FF' }}>Contract Address:</Text>{' '}
                <Link
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  style={{ color: '#FFD700', fontFamily: 'monospace' }}
                >
                  {CONTRACT_ADDRESS}
                </Link>
              </Paragraph>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 15, marginBottom: 16 }}>
                <Text strong style={{ color: '#FF6B6B' }}>Note:</Text> This is a demonstration project deployed on Sepolia testnet.
                Do not use real financial data or expect production-level security.
              </Paragraph>
              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>
                  Built with ❤️ using Zama's FHE Technology
                </Text>
              </div>
            </Card>
          </>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Button
              type="link"
              onClick={() => setShowSubmit(false)}
              style={{ color: '#0052FF', marginBottom: 20, padding: 0 }}
            >
              ← Back to Home
            </Button>
            <SubmitProposal />
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  return <HeroSection />;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#0052FF',
              },
            }}
          >
            <AntApp>
              <AppContent />
            </AntApp>
          </ConfigProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
