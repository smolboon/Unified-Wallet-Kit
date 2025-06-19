// Unified Login UI (Web2 + Web3)
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const UnifiedLogin = () => {
  const [loading, setLoading] = useState(false);

  // Web2: Next-Auth sign in
  const handleWeb2SignIn = () => {
    signIn(); // Shows Next-Auth default sign-in
  };

  // Web3: Wallet connect and sign (prioritizing Solana wallets like Phantom)
  const handleWeb3SignIn = async () => {
    setLoading(true);
    try {
      // Import Solana wallet adapters to prioritize Solana wallets
      const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-wallets');
      const phantomAdapter = new PhantomWalletAdapter();
      
      // 1. Attempt to connect with Phantom wallet first
      let address: string | null = null;
      try {
        await phantomAdapter.connect();
        address = phantomAdapter.publicKey?.toString() || null;
      } catch (phantomErr) {
        console.error('Phantom connection failed:', phantomErr);
        // Fallback to Ethereum if Phantom connection fails
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          address = accounts[0] || null;
        }
      }
      
      if (!address) throw new Error('No wallet address');
      // 2. Request nonce from backend
      const nonceRes = await fetch('/api/auth/web3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const { nonce } = await nonceRes.json();
      // 3. Sign nonce (use appropriate signing method based on wallet)
      let signature;
      if (phantomAdapter.connected) {
        const message = new TextEncoder().encode(nonce);
        signature = await phantomAdapter.signMessage(message);
        signature = Buffer.from(signature).toString('base64');
      } else {
        signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [nonce, address],
        });
      }
      // 4. Send signature to backend
      const verifyRes = await fetch('/api/auth/web3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        // Store the JWT token in localStorage for session management
        if (verifyData.token) {
          localStorage.setItem('auth_token', verifyData.token);
        }
        // Optionally, refresh session or redirect
        window.location.reload();
      } else {
        alert('Web3 sign-in failed: ' + (verifyData.error || 'Unknown error'));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Web3 sign-in error: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign in to Unified Wallet</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={handleWeb2SignIn} style={{ padding: '0.75rem 1.5rem', fontWeight: 600, borderRadius: 8, background: '#fff', color: '#222', border: '1px solid #eee' }}>
          Sign in with Email / Google (Web2)
        </button>
        <button onClick={handleWeb3SignIn} style={{ padding: '0.75rem 1.5rem', fontWeight: 600, borderRadius: 8, background: '#222', color: '#fff', border: '1px solid #222' }} disabled={loading}>
          {loading ? 'Connecting...' : 'Sign in with Wallet (Web3)'}
        </button>
      </div>
    </div>
  );
};

export default UnifiedLogin;
