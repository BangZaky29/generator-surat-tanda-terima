import logo from '../assets/NS_white_01.png';
import React, { useState } from 'react';
import { parseReceiptData } from '../services/geminiService';

const Header = ({ onDataParsed, currentData }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [roughText, setRoughText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAiFill = async () => {
    if (!roughText.trim()) return;
    setLoading(true);
    try {
      const parsedData = await parseReceiptData(roughText, currentData);
      onDataParsed(parsedData);
      setIsAiModalOpen(false);
      setRoughText('');
    } catch (e) {
      alert('Gagal memproses data dengan AI. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-primary-100 shadow-sm print:hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo Container - Adjusted size */}
            <div className="h-12 w-auto flex-shrink-0">
              <img 
                src={logo} 
                alt="Nuansa Solution" 
                className="h-full w-auto object-contain drop-shadow-sm"
              />
            </div>
            
            {/* Divider (Optional visual separation) */}
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

            {/* Text Content */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent leading-tight">
                Surat Tanda Terima
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Professional Document Generator</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;