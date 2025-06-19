import React from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';

import GlobalStyles from '../styles/GlobalStyles';
import '../styles/globals.css';
import { AuthProvider } from '../context/authContext';
import Sidebar from '../components/Sidebar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GlobalStyles />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1 }}>
          <Component className="App" {...pageProps} />
        </main>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{ style: { border: 0, borderRadius: '1rem', overflow: 'hidden' } }}
      />
    </AuthProvider>
  );
}
