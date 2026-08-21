import React from 'react';
import { useLocation } from 'react-router-dom';
import { NeoNavBar } from './ui/NeoNavBar';
import { NeoFooter } from './ui/NeoFooter';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden selection:bg-[#FF3366] selection:text-white">
      {!isAdminRoute && <NeoNavBar />}

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {!isAdminRoute && <NeoFooter />}
    </div>
  );
};
