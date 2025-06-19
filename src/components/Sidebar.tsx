import React from 'react';
import UnifiedLogin from './auth/UnifiedLogin';

const Sidebar = () => {
  return (
    <aside style={{ width: 280, background: '#f8f9fa', height: '100vh', padding: '2rem 1rem', boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: '2rem', fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>
        Unified Wallet Kit
      </div>
      <UnifiedLogin />
      {/* Future: Add navigation links here */}
    </aside>
  );
};

export default Sidebar;
