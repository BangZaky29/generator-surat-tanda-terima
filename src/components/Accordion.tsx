
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const Accordion: React.FC<AccordionProps> = ({ title, icon, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-500">{icon}</span>}
          <span className="font-semibold text-slate-700">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-5 border-t border-slate-100 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
