import React, { useState } from 'react';

const AccordionSection = ({ title, children, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg bg-white shadow-sm mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary-500">{icon}</span>}
          <span className="font-semibold text-slate-700 text-sm">{title}</span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;