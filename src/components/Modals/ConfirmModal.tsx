
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  icon: React.ReactNode;
  confirmVariant?: 'blue' | 'red';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  icon,
  confirmVariant = 'blue'
}) => {
  const confirmClasses = confirmVariant === 'blue' 
    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" 
    : "bg-red-600 hover:bg-red-700 shadow-red-100";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[205] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
             <div className="p-8 text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${confirmVariant === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  {icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{description}</p>
                <div className="flex flex-col gap-2">
                  <button onClick={onConfirm} className={`w-full py-3.5 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${confirmClasses}`}>
                    {confirmLabel}
                  </button>
                  <button onClick={onClose} className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all">Batalkan</button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
