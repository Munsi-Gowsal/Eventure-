import React from 'react';
import { useLocation } from 'react-router-dom';
import { GradientMenu } from './ui/GradientMenu';
import { BackgroundSnippet } from './ui/BackgroundSnippet';
import { HoverFooter } from './ui/hover-footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
      {!isAdminRoute && <BackgroundSnippet />}
      {!isAdminRoute && <GradientMenu />}

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {!isAdminRoute && <HoverFooter />}
    </div>
  );
};
