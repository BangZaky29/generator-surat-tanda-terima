
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  type = "text", 
  textarea = false 
}) => (
  <div className="mb-4 last:mb-0">
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-800 focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 outline-none transition-all min-h-[90px] text-sm placeholder:text-slate-300 shadow-sm"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-800 focus:ring-4 focus:ring-blue-100/50 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-slate-300 shadow-sm"
      />
    )}
  </div>
);
