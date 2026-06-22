import { useEffect } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useGameStore } from '../store/useGameStore';

export default function AirdropPage() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { userId } = useGameStore();

  // Safely format long hexadecimal raw hex addresses to neat user-facing text
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  // Automatically back up wallet details to the backend upon validation
  useEffect(() => {
    if (wallet?.account?.address) {
      const saveWalletToCloud = async () => {
        try {
          const API_BASE_URL = "https://bonusbyte-4hj6x7hfr-lucid-s-projects6.vercel.app";
          await fetch(`${API_BASE_URL}/api/user/${userId}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              walletAddress: wallet.account.address,
              deviceInfo: `${wallet.device.appName} (${wallet.device.platform})`
            })
          });
          console.log("🔒 TON wallet parameters successfully synchronized to database.");
        } catch (err) {
          console.error("Failed to link wallet profile to cloud maps:", err);
        }
      };
      saveWalletToCloud();
    }
  }, [wallet, userId]);

  return (
    <div style={{
      padding: '10px 0',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '55vh',
      gap: '20px'
    }}>
      <div style={{ 
        fontSize: '56px',
        textShadow: wallet ? '0 0 20px rgba(0, 229, 255, 0.2)' : 'none'
      }}>
        {wallet ? '💎' : '🎁'}
      </div>
      
      <div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '700', color: '#FFF' }}>
          {wallet ? 'Wallet Verified' : 'Web3 Distribution'}
        </h2>
        <p style={{ 
          fontSize: '13px', 
          opacity: 0.5, 
          maxWidth: '300px', 
          margin: '0 auto', 
          lineHeight: '1.6',
          color: '#FFF'
        }}>
          {wallet 
            ? 'Your verified hardware parameter footprint is registered for snapshots.'
            : 'Connect your decentralized TON network wallet to establish cross-chain tracking data verification.'
          }
        </p>
      </div>

      {wallet && (
        <div style={{
          background: 'rgba(0, 229, 255, 0.04)',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '320px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '4px', letterSpacing: '0.5px', color: '#FFF' }}>CONNECTED ACCOUNT</div>
          <div style={{ fontSize: '14px', fontFamily: 'monospace', color: '#00E5FF', fontWeight: 'bold' }}>
            {formatAddress(wallet.account.address)}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px', color: '#A0A5B0' }}>
            Device: {wallet.device.appName} ({wallet.device.platform})
          </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '0 10px' }}>
        {!wallet ? (
          <button 
            onClick={() => tonConnectUI.openModal()}
            style={{ 
              background: 'linear-gradient(135deg, #00E5FF 0%, #0099FF 100%)', 
              color: '#000000', 
              border: 'none', 
              fontWeight: '700', 
              padding: '16px', 
              borderRadius: '14px', 
              fontSize: '14px', 
              width: '100%', 
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 229, 255, 0.2)',
              outline: 'none'
            }}
          >
            Link TON Wallet
          </button>
        ) : (
          <button 
            onClick={() => tonConnectUI.disconnect()}
            style={{ 
              background: 'rgba(255, 59, 92, 0.06)', 
              color: '#FF3B5C', 
              border: '1px solid rgba(255, 59, 92, 0.15)', 
              fontWeight: '600', 
              padding: '14px', 
              borderRadius: '14px', 
              fontSize: '13px', 
              width: '100%', 
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Disconnect Network Wallet
          </button>
        )}
      </div>
    </div>
  );
}