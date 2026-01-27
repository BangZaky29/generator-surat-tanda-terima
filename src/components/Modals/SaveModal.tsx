
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, X, RefreshCcw, Copy, Save } from 'lucide-react';
import { InputField } from '../Form/InputField';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempProjectName: string;
  setTempProjectName: (val: string) => void;
  isExistingDoc: boolean;
  onFinalSave: (saveAsNew: boolean) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  tempProjectName,
  setTempProjectName,
  isExistingDoc,
  onFinalSave
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
             <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FolderOpen size={24} />
                  <h2 className="font-black text-lg uppercase tracking-tight">Simpan Proyek</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
             </div>
             <div className="p-8">
                <p className="text-slate-500 text-sm font-medium mb-6">Berikan nama untuk proyek surat ini agar mudah ditemukan kembali di riwayat.</p>
                <InputField label="Nama Proyek" value={tempProjectName} onChange={setTempProjectName} placeholder="Contoh: Proyek Pengiriman ABC..." />
                <div className="space-y-3 mt-8">
                  {isExistingDoc && (
                    <button onClick={() => onFinalSave(false)} className="w-full px-8 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center justify-center gap-2 border border-blue-200">
                      <RefreshCcw size={18} /> Timpa Data (Update)
                    </button>
                  )}
                  <button onClick={() => onFinalSave(true)} className="w-full px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
                    {isExistingDoc ? <Copy size={18} /> : <Save size={18} />} 
                    {isExistingDoc ? 'Simpan Sebagai Baru (Copy)' : 'Simpan Data Baru'}
                  </button>
                  <button onClick={onClose} className="w-full px-6 py-3 border-2 border-slate-100 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all">Batal</button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
