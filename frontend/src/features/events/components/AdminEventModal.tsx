import React from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AdminEventModal: React.FC<AdminEventModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#242424] border border-[#333] rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 pb-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-[12px] bg-[#9b51e0]/10 flex items-center justify-center mb-6">
                <CalendarPlus size={24} className="text-[#b573f0]" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-medium text-white mb-1">{title}</h2>
              <p className="text-gray-400 text-sm">Provide details to create or update this event</p>
            </div>
            
            <div className="px-8 pb-8 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
