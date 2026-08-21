import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Search, 
  User, 
  Bell, 
  LogOut,
  Map,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { client } from '../lib/api/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      logout();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f4f0] text-black font-sans overflow-hidden selection:bg-[#00E5FF] selection:text-black">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-72 h-full bg-white border-r-[3px] border-black flex flex-col transition-transform duration-300 flex-shrink-0 z-40 shadow-[4px_0_0_0_#000] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Mobile close button */}
        <button 
          className="absolute top-4 right-4 p-2 bg-[#FF3366] border-2 border-black md:hidden shadow-[2px_2px_0_0_#000]"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={20} className="text-white" strokeWidth={3} />
        </button>
        
        {/* Profile Section */}
        <div className="p-6 flex items-center gap-4 border-b-[3px] border-black bg-[#FFD23F]">
          <div className="w-12 h-12 bg-white border-[3px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]">
            <span className="font-black font-display text-lg">AD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black font-display uppercase truncate">Admin User</span>
            <span className="text-xs font-bold uppercase truncate">admin@eventure.com</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b-[3px] border-black">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              className="neo-input w-full pl-10 pr-4 py-3 font-bold uppercase text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <NavLink 
              to="/admin/dashboard"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 border-[3px] border-transparent font-bold uppercase transition-all ${isActive ? 'bg-[#00E5FF] border-black shadow-[4px_4px_0_0_#000] -translate-y-1' : 'hover:bg-gray-100 hover:border-black'}`}
            >
              <Home size={20} strokeWidth={2.5} />
              Home
            </NavLink>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 border-[3px] border-black bg-[#FF3366] text-white font-bold uppercase shadow-[4px_4px_0_0_#000]">
              <Calendar size={20} strokeWidth={2.5} />
              <span>Events (Booking)</span>
            </div>
            
            {/* Sub-menu */}
            <div className="ml-6 border-l-[3px] border-black mt-2 pl-4 space-y-2 flex flex-col py-2">
              <div className="flex items-center gap-2 font-bold uppercase py-2 px-2 hover:bg-[#FFD23F] hover:border-black border-2 border-transparent transition-colors cursor-pointer">
                <Calendar size={18} strokeWidth={2.5} />
                Calendar
              </div>
              <div className="flex items-center gap-2 font-bold uppercase py-2 px-2 bg-black text-white border-2 border-black cursor-pointer shadow-[2px_2px_0_0_#FFD23F]">
                <Map size={18} strokeWidth={2.5} />
                Manage Events
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-400 uppercase py-2 px-2 cursor-not-allowed">
                <FileText size={18} strokeWidth={2.5} />
                Summary
              </div>
            </div>
          </div>

          <NavLink 
            to="/admin/profile"
            className="flex items-center gap-3 px-4 py-3 border-[3px] border-transparent font-bold uppercase transition-all hover:bg-gray-100 hover:border-black"
          >
            <User size={20} strokeWidth={2.5} />
            Profile
          </NavLink>
          
          <NavLink 
            to="/admin/notifications"
            className="flex items-center gap-3 px-4 py-3 border-[3px] border-transparent font-bold uppercase transition-all hover:bg-gray-100 hover:border-black"
          >
            <Bell size={20} strokeWidth={2.5} />
            Notification
          </NavLink>
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t-[3px] border-black bg-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 px-4 py-3 w-full font-black font-display uppercase bg-white border-[3px] border-black text-black hover:bg-[#FF3366] hover:text-white transition-colors shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-y-[2px]"
          >
            <LogOut size={20} strokeWidth={3} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-[#f4f4f0]">
        {/* Mobile Header (Hamburger) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b-[3px] border-black bg-[#FFD23F]">
          <span className="text-2xl font-black font-display uppercase">Eventure</span>
          <button 
            className="p-2 bg-white border-[3px] border-black shadow-[2px_2px_0_0_#000]"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} strokeWidth={3} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-0">
          {children}
        </main>
      </div>
    </div>
  );
};
