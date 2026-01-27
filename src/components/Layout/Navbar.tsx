
import React from 'react';
import {Plus, Save, Download, Loader2 } from 'lucide-react';
import logo from '../../assets/NS_white_01.png';

interface NavbarProps {
  onNew: () => void;
  onSave: () => void;
  onDownload: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNew, onSave, onDownload, isGenerating }) => {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-black text-slate-800 tracking-tighter leading-none uppercase">STT PRO</h1>
          <p className="text-[8px] md:text-[9px] text-blue-600 font-bold uppercase tracking-[0.2em]">Official System</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 md:gap-3">
        <button onClick={onNew} className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-all text-sm">
          <Plus size={16} /> <span>Baru</span>
        </button>
        <button onClick={onSave} className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-100 text-xs md:text-sm">
          <Save size={16} /> <span>Simpan</span>
        </button>
        <button onClick={onDownload} disabled={isGenerating} className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold transition-all shadow-lg shadow-slate-200 disabled:opacity-50 text-xs md:text-sm">
          {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
          <span className="hidden md:inline">Cetak PDF</span>
        </button>
      </div>
    </nav>
  );
};
