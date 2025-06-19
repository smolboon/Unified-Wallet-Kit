// Next-Auth API handler template for Web2 authentication
// Integrate this with your Next.js API routes (e.g., /pages/api/auth/[...nextauth].ts)
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER || '',
      from: process.env.EMAIL_FROM || '',
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token, user }) {
      // Extend session with unified user model fields if needed
      // session.user.id = token.id;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Here, link or create user in your DB if needed
      return true;
    },
  },
  // Add database/session config as needed
});
