// Unified User Model for Web2 and Web3
export interface User {
  id: string;
  email?: string;
  passwordHash?: string;
  oauthProvider?: string;
  walletAddress?: string;
  walletType?: string;
  createdAt: Date;
  updatedAt: Date;
}
