// Web3 Wallet Authentication API handler template
// Use this for nonce challenge and signature verification
// Integrate with your Next.js API routes (e.g., /pages/api/auth/web3.ts)

// Example: Express/Next.js handler for Web3 login
// 1. Generate nonce for wallet address
// 2. Verify signature
// 3. Link or create user in DB
// 4. Issue session

// This is a placeholder for your Web3 auth logic

import { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';

// In-memory nonce store for demo (replace with DB in production)
const nonces: Record<string, string> = {};

export default async function web3AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, signature } = req.body;
    if (!address) return res.status(400).json({ error: 'Missing address' });

    // Step 1: Nonce challenge
    if (!signature) {
      const nonce = randomBytes(16).toString('hex');
      nonces[address] = nonce;
      return res.status(200).json({ nonce });
    }

        // Step 2: Signature verification using ethers.js
    const nonce = nonces[address];
    if (!nonce) return res.status(400).json({ error: 'No nonce for address' });
    try {
      const { ethers } = require('ethers');
      const signerAddress = ethers.verifyMessage(nonce, signature);
      const isValid = signerAddress.toLowerCase() === address.toLowerCase();
      if (!isValid) return res.status(401).json({ error: 'Invalid signature' });
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(500).json({ error: 'Signature verification failed' });
    }

    // Step 3: Link or create user in DB (placeholder for actual implementation)
    // TODO: Implement user lookup or creation in your database
    const user = { id: address, walletAddress: address };

    // Step 4: Issue session (using a simple JWT token for demonstration)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    return res.status(200).json({ success: true, token });
  }
  res.status(405).end();
}
