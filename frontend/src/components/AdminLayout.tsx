import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Search, 
  User, 
  Bell, 
  LogOut,
  Map,
  FileText
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { client } from '../lib/api/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    <div className="flex h-screen bg-[#121212] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col transition-all duration-300 flex-shrink-0">
        
        {/* Profile Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9b51e0] to-[#bb6bd9] flex items-center justify-center shrink-0">
            <span className="font-bold text-sm">AD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate">Admin User</span>
            <span className="text-xs text-gray-500 truncate">admin@eventure.com</span>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#242424] border border-[#333] rounded-lg py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#9b51e0] transition-colors"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          <div className="mb-2">
            <NavLink 
              to="/admin/dashboard"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'text-gray-300 hover:text-white hover:bg-[#242424]' : 'text-gray-400 hover:text-white hover:bg-[#242424]'}`}
            >
              <Home size={18} />
              Home
            </NavLink>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-[#242424] text-white">
              <Calendar size={18} />
              <span>Events (Booking)</span>
            </div>
            
            {/* Sub-menu (simulated for UI) */}
            <div className="ml-5 border-l border-[#333] mt-1 pl-4 space-y-1 flex flex-col py-1">
              <div className="flex items-center gap-2 text-sm text-gray-400 py-1.5 px-2 hover:text-white cursor-pointer group">
                <Calendar size={14} className="group-hover:text-[#9b51e0] transition-colors" />
                Calendar
              </div>
              <div className="flex items-center gap-2 text-sm text-white font-medium py-1.5 px-2 bg-white/5 rounded-md cursor-pointer group relative">
                {/* Active indicator dot */}
                <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
                <Map size={14} className="text-white" />
                Select zone
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 py-1.5 px-2 cursor-not-allowed">
                <FileText size={14} />
                Summary
              </div>
            </div>
          </div>

          <NavLink 
            to="/admin/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#242424] transition-colors"
          >
            <User size={18} />
            Profile
          </NavLink>
          
          <NavLink 
            to="/admin/notifications"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#242424] transition-colors"
          >
            <Bell size={18} />
            Notification
          </NavLink>
        </nav>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#121212]">
        {children}
      </main>
    </div>
  );
};
