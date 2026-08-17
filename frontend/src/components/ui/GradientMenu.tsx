
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Home, Compass, Search, UserCircle } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Discover', path: '/#discover', icon: Compass },
  { name: 'Search', path: '/#search', icon: Search },
];

export const GradientMenu = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors duration-200",
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="gradient-menu-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10 hidden sm:block">{item.name}</span>
            </Link>
          );
        })}
        
        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <Link
          to="/admin/login"
          className="relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
        >
          <UserCircle size={16} />
          <span className="hidden sm:block">Admin</span>
        </Link>
      </div>
    </nav>
  );
};
