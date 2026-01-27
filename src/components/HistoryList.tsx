
import React from 'react';
import { SavedDocument } from '../types';
import { Trash2, FileText, Clock, RefreshCcw } from 'lucide-react';

interface HistoryListProps {
  documents: SavedDocument[];
  onSelect: (doc: SavedDocument) => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ documents, onSelect, onDelete, activeId }) => {
  if (documents.length === 0) {
    return <p className="text-xs text-slate-400 font-bold italic py-4">Belum ada dokumen yang disimpan.</p>;
  }

  return (
    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className={`group flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
            activeId === doc.id 
            ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
            : 'border-slate-50 bg-white hover:border-slate-200'
          }`}
          onClick={() => onSelect(doc)}
        >
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${activeId === doc.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                <FileText size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-black text-[12px] text-blue-700 truncate uppercase tracking-tight leading-tight">
                  {doc.projectName || 'Proyek Tanpa Nama'}
                </span>
                <span className="font-bold text-[10px] text-slate-400 truncate italic">
                  No: {doc.nomorSurat || 'Tanpa Nomor'}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400">
                  <Clock size={10} />
                  <span>{new Date(doc.updatedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-4">
             <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(doc);
              }}
              title="Muat Data"
              className="p-1.5 text-slate-300 hover:text-blue-500 transition-all"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc.id);
              }}
              className="p-2 border border-slate-200 bg-white text-red-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
              title="Hapus Dokumen"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
