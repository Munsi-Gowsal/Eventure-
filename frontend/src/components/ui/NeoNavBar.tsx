import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Home, Compass, Search, UserCircle, Ticket, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Discover', path: '/#discover', icon: Compass },
  { name: 'Search', path: '/#search', icon: Search },
];

export const NeoNavBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#f4f4f0] border-b-[3px] border-black">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl font-black font-display tracking-tight hover:-translate-y-1 transition-transform">
          EVENTURE
          <span className="text-[#FF3366]">.</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-4 py-2 font-bold font-display uppercase border-[3px] transition-all",
                  isActive 
                    ? "bg-[#FFD23F] border-black shadow-[4px_4px_0px_0px_#000] -translate-y-[2px]" 
                    : "bg-transparent border-transparent hover:border-black hover:bg-white"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} strokeWidth={2.5} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/my-events"
            className="hidden sm:flex px-4 py-2 bg-white border-[3px] border-black font-bold font-display uppercase hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all items-center gap-2"
          >
            <Ticket size={18} strokeWidth={2.5} />
            My Events
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-[#00E5FF] border-[3px] border-black font-bold font-display uppercase hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center gap-2"
          >
            <UserCircle size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <button 
            className="md:hidden p-2 bg-white border-[3px] border-black shadow-[2px_2px_0_0_#000]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b-[3px] border-black bg-white flex flex-col">
          <div className="p-4 flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 font-bold font-display uppercase border-[3px] transition-all w-full",
                    isActive 
                      ? "bg-[#FFD23F] border-black shadow-[4px_4px_0px_0px_#000]" 
                      : "bg-white border-black"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} strokeWidth={2.5} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
            
            <Link
              to="/my-events"
              onClick={() => setIsOpen(false)}
              className="sm:hidden px-4 py-3 bg-[#FF3366] text-white border-[3px] border-black font-bold font-display uppercase w-full flex items-center gap-2 shadow-[4px_4px_0_0_#000]"
            >
              <Ticket size={18} strokeWidth={2.5} />
              My Events
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
