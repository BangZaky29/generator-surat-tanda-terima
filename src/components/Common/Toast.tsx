
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }} 
          animate={{ opacity: 1, y: 0, x: '-50%' }} 
          exit={{ opacity: 0, x: '-50%' }} 
          className={`fixed bottom-24 lg:bottom-8 left-1/2 px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 md:gap-4 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}
        >
          <CheckCircle2 className={toast.type === 'success' ? 'text-emerald-400' : 'text-white'} size={20} />
          <span className="font-bold tracking-tight text-sm md:text-base">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
