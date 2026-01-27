//C:\codingVibes\nuansasolution\.subpath\generator-surat-tanda-terima-v2\src\App.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Info, 
  User, 
  Box, 
  Building2, 
  PenTool,
  History,
  Upload,
  Image as ImageIcon,
  Eye,
  Edit3,
  AlertTriangle,
  RefreshCcw,
  FileText,
  Trash   
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

import { ReceiptData, ReceiptItem, SavedDocument } from './types';
import { getDocuments, saveDocument, updateDocument, deleteDocument } from './utils/localStorage';
import { generatePDF } from './utils/pdfGenerator';
import { Accordion } from './components/Accordion';
import { HistoryList } from './components/HistoryList';
import { DocumentPreview } from './components/Preview/DocumentPreview';
import { SignatureCanvas } from './components/SignatureCanvas';
import { InputField } from './components/Form/InputField';
import { Navbar } from './components/Layout/Navbar';
import { Toast } from './components/Common/Toast';
import { SaveModal } from './components/Modals/SaveModal';
import { ConfirmModal } from './components/Modals/ConfirmModal';

const DEFAULT_DATA: ReceiptData = {
  id: '',
  projectName: '',
  nomorSurat: '',
  tanggal: new Date().toISOString().split('T')[0],
  tempat: 'Jakarta',
  penerima: { name: '', position: '', address: '', phone: '' },
  penyerah: { name: '', position: '', address: '', phone: '' },
  items: [
    { id: uuidv4(), name: '', quantity: '', description: '' },
    { id: uuidv4(), name: '', quantity: '', description: '' },
    { id: uuidv4(), name: '', quantity: '', description: '' }
  ],
  company: { showKop: true, name: '', address: '', logoUrl: '' },
  signatures: { penerima: null, penyerah: null },
  stamps: { penerima: null, penyerah: null },
  createdAt: '',
  updatedAt: ''
};

const App: React.FC = () => {
  const [data, setData] = useState<ReceiptData>({ ...DEFAULT_DATA, id: uuidv4() });
  const [history, setHistory] = useState<SavedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [activeSection, setActiveSection] = useState<string | null>('Informasi Utama Surat');

  // Modals Visibility
  const [modals, setModals] = useState({
    save: false,
    delete: false,
    load: false,
    new: false
  });

  const [tempProjectName, setTempProjectName] = useState('');
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [docToLoad, setDocToLoad] = useState<SavedDocument | null>(null);

  useEffect(() => {
    setHistory(getDocuments());
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setData({ ...DEFAULT_DATA, id: uuidv4(), tanggal: new Date().toISOString().split('T')[0] });
    showToast("Dokumen baru dibuat");
    setActiveSection('Informasi Utama Surat');
    setModals(prev => ({ ...prev, new: false }));
  };

  const openSaveModal = () => {
    setTempProjectName(data.projectName || '');
    setModals(prev => ({ ...prev, save: true }));
  };

  const handleFinalSave = (saveAsNew: boolean = false) => {
    let currentId = data.id;
    let updatedData = { ...data, projectName: tempProjectName || 'Proyek Tanpa Nama' };

    if (saveAsNew) {
      currentId = uuidv4();
      updatedData = { ...updatedData, id: currentId };
    }

    setData(updatedData);
    
    const existing = history.find(doc => doc.id === currentId);
    if (existing && !saveAsNew) {
      updateDocument(currentId, updatedData);
      showToast("Dokumen berhasil diperbarui");
    } else {
      saveDocument(updatedData);
      showToast("Dokumen berhasil disimpan");
    }
    
    setHistory(getDocuments());
    setModals(prev => ({ ...prev, save: false }));
  };

  const requestDelete = (id: string) => {
    setIdToDelete(id);
    setModals(prev => ({ ...prev, delete: true }));
  };

  const confirmDelete = () => {
    if (idToDelete) {
      deleteDocument(idToDelete);
      if (data.id === idToDelete) {
        setData({ ...DEFAULT_DATA, id: uuidv4(), tanggal: new Date().toISOString().split('T')[0] });
        setActiveSection('Informasi Utama Surat');
      }
      setHistory(getDocuments());
      showToast("Dokumen berhasil dihapus", "success");
      setModals(prev => ({ ...prev, delete: false }));
      setIdToDelete(null);
    }
  };

  const handleSelect = (doc: SavedDocument) => {
    setDocToLoad(doc);
    setModals(prev => ({ ...prev, load: true }));
  };

  const confirmLoad = () => {
    if (docToLoad) {
      setData({
        ...docToLoad.dataFormLengkap,
        stamps: docToLoad.dataFormLengkap.stamps || { penerima: null, penyerah: null }
      });
      if (window.innerWidth < 1024) {
        setMobileView('preview');
      }
      showToast(`Data "${docToLoad.projectName}" dimuat`);
      setModals(prev => ({ ...prev, load: false }));
      setDocToLoad(null);
      setActiveSection('Informasi Utama Surat');
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    showToast("Sedang memproses PDF...");
    try {
      const fileName = data.nomorSurat 
        ? `STT_PRO_${data.nomorSurat.replace(/[/\\?%*:|"<>]/g, '_')}`
        : `STT_PRO_${new Date().getTime()}`;
      await generatePDF('document-container-pdf', fileName);
      showToast("PDF Berhasil diunduh");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengunduh PDF", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const addItem = () => {
    const newItem: ReceiptItem = { id: uuidv4(), name: '', quantity: '', description: '' };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const updateItem = (id: string, field: keyof ReceiptItem, value: string) => {
    const newItems = data.items.map(item => item.id === id ? { ...item, [field]: value } : item);
    setData({ ...data, items: newItems });
  };

  const removeItem = (id: string) => {
    setData({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const updatePerson = (target: 'penerima' | 'penyerah', field: string, value: string) => {
    setData({ ...data, [target]: { ...data[target], [field]: value } });
  };

  const updateCompany = (field: string, value: any) => {
    setData({ ...data, company: { ...data.company, [field]: value } });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateCompany('logoUrl', ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isExistingDoc = history.some(doc => doc.id === data.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA] text-slate-900 overflow-hidden">
      <Navbar onNew={() => setModals(m => ({...m, new: true}))} onSave={openSaveModal} onDownload={handleDownload} isGenerating={isGenerating} />

      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden relative">
        <div className={`w-full lg:w-[450px] overflow-y-auto bg-white border-r border-slate-200 custom-scrollbar flex flex-col px-4 md:px-6 py-6 md:py-8 ${mobileView === 'form' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="space-y-4 pb-24 md:pb-20">
            <Accordion title="Riwayat Dokumen" icon={<History size={20} />} isOpen={activeSection === 'Riwayat Dokumen'} onToggle={() => setActiveSection(s => s === 'Riwayat Dokumen' ? null : 'Riwayat Dokumen')}>
               <HistoryList documents={history} onSelect={handleSelect} onDelete={requestDelete} activeId={data.id} />
            </Accordion>

            <Accordion title="Kop Perusahaan" icon={<Building2 size={20} />} isOpen={activeSection === 'Kop Perusahaan'} onToggle={() => setActiveSection(s => s === 'Kop Perusahaan' ? null : 'Kop Perusahaan')}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">Aktifkan Kop Surat</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={data.company.showKop} onChange={(e) => updateCompany('showKop', e.target.checked)} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {data.company.showKop && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2">
                    <InputField label="Nama Perusahaan" value={data.company.name} onChange={(v) => updateCompany('name', v)} placeholder="PT. Nama Perusahaan..." />
                    <InputField label="Alamat Lengkap" value={data.company.address} onChange={(v) => updateCompany('address', v)} placeholder="Alamat lengkap..." textarea />
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Logo Perusahaan</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {data.company.logoUrl ? <img src={data.company.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-1" /> : <ImageIcon className="text-slate-300" size={24} />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all">
                            <Upload size={14} />
                            <span>Upload File Logo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                          <button onClick={() => updateCompany('logoUrl', '')} className="w-full text-[10px] font-bold text-red-400 hover:text-red-600 text-center">Hapus Logo</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Accordion>

            <Accordion title="Informasi Utama Surat" icon={<Info size={20} />} isOpen={activeSection === 'Informasi Utama Surat'} onToggle={() => setActiveSection(s => s === 'Informasi Utama Surat' ? null : 'Informasi Utama Surat')}>
              <InputField label="Nomor Surat" value={data.nomorSurat} onChange={(v) => setData({...data, nomorSurat: v})} placeholder="Contoh: 001/STT/I/2024" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <InputField label="Tempat Pembuatan" value={data.tempat} onChange={(v) => setData({...data, tempat: v})} placeholder="Jakarta" />
                <InputField label="Tanggal" type="date" value={data.tanggal} onChange={(v) => setData({...data, tanggal: v})} />
              </div>
            </Accordion>

            <Accordion title="Identitas Penerima" icon={<User size={20} />} isOpen={activeSection === 'Identitas Penerima'} onToggle={() => setActiveSection(s => s === 'Identitas Penerima' ? null : 'Identitas Penerima')}>
              <div className="space-y-4">
                <InputField label="Nama Lengkap" value={data.penerima.name} onChange={(v) => updatePerson('penerima', 'name', v)} />
                <InputField label="Pekerjaan / Jabatan" value={data.penerima.position} onChange={(v) => updatePerson('penerima', 'position', v)} />
                <InputField label="Alamat Penerima" value={data.penerima.address} onChange={(v) => updatePerson('penerima', 'address', v)} textarea />
                <InputField label="No HP" value={data.penerima.phone} onChange={(v) => updatePerson('penerima', 'phone', v)} />
              </div>
            </Accordion>

            <Accordion title="Daftar Barang / Dokumen" icon={<Box size={20} />} isOpen={activeSection === 'Daftar Barang / Dokumen'} onToggle={() => setActiveSection(s => s === 'Daftar Barang / Dokumen' ? null : 'Daftar Barang / Dokumen')}>
              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div key={item.id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl relative group hover:border-blue-200 transition-all">
                    <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash size={12} />
                    </button>
                    <div className="space-y-3">
                      <InputField label={`Nama Barang #${index + 1}`} value={item.name} onChange={(v) => updateItem(item.id, 'name', v)} placeholder="Nama barang atau dokumen..." />
                      <div className="grid grid-cols-[100px_1fr] gap-3">
                        <InputField label="Jumlah" value={item.quantity} onChange={(v) => updateItem(item.id, 'quantity', v)} placeholder="Misal: 10 Pcs" />
                        <InputField label="Keterangan" value={item.description} onChange={(v) => updateItem(item.id, 'description', v)} placeholder="Catatan tambahan..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addItem} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-bold transition-all text-sm">
                  <Plus size={18} /> Tambah Item Baru
                </button>
              </div>
            </Accordion>

            <Accordion title="Tanda Tangan & Penyerah" icon={<PenTool size={20} />} isOpen={activeSection === 'Tanda Tangan & Penyerah'} onToggle={() => setActiveSection(s => s === 'Tanda Tangan & Penyerah' ? null : 'Tanda Tangan & Penyerah')}>
              <div className="space-y-6">
                <InputField label="Nama Yang Menyerahkan" value={data.penyerah.name} onChange={(v) => updatePerson('penyerah', 'name', v)} />
                <div className="grid grid-cols-1 gap-6 mt-4">
                  <SignatureCanvas label="TTD Penerima" initialValue={data.signatures.penerima} initialStamp={data.stamps?.penerima} onSave={(val) => setData({ ...data, signatures: { ...data.signatures, penerima: val } })} onSaveStamp={(val) => setData({ ...data, stamps: { ...data.stamps, penerima: val } })} />
                  <SignatureCanvas label="TTD Yang Menyerahkan" initialValue={data.signatures.penyerah} initialStamp={data.stamps?.penyerah} onSave={(val) => setData({ ...data, signatures: { ...data.signatures, penyerah: val } })} onSaveStamp={(val) => setData({ ...data, stamps: { ...data.stamps, penyerah: val } })} />
                </div>
              </div>
            </Accordion>
          </div>
        </div>

        <div className={`flex-1 h-full overflow-y-auto bg-slate-100 p-4 lg:p-12 custom-scrollbar ${mobileView === 'preview' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
          <div className="max-w-[210mm] lg:mx-auto pb-24 lg:pb-20 flex flex-col items-center">
             <div className="mb-4 lg:mb-8 w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-4 lg:px-6 py-3 rounded-2xl border border-white shadow-sm">
                <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /><span className="text-slate-800 font-black text-[10px] md:text-xs uppercase tracking-tighter">SURAT A4 - LIVE PREVIEW</span></div>
                <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Ultra Precision PDF</div>
             </div>
             <div className="relative w-full overflow-x-hidden flex justify-center pb-20">
                <div className="origin-top scale-[0.42] xs:scale-[0.45] sm:scale-[0.8] lg:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm">
                  <DocumentPreview data={data} />
                </div>
             </div>
          </div>
        </div>

        <div className="fixed -left-[2000px] top-0 opacity-0 pointer-events-none" aria-hidden="true"><div id="document-container-pdf"><DocumentPreview data={data} /></div></div>

        <div className="lg:hidden fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.button key={mobileView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} whileTap={{ scale: 0.95 }} onClick={() => setMobileView(mobileView === 'form' ? 'preview' : 'form')} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${mobileView === 'form' ? 'bg-slate-900 text-white shadow-slate-400' : 'bg-blue-600 text-white shadow-blue-400'}`}>
              {mobileView === 'form' ? <Eye size={24} /> : <Edit3 size={24} />}
            </motion.button>
          </AnimatePresence>
        </div>
      </main>

      <SaveModal isOpen={modals.save} onClose={() => setModals(m => ({...m, save: false}))} tempProjectName={tempProjectName} setTempProjectName={setTempProjectName} isExistingDoc={isExistingDoc} onFinalSave={handleFinalSave} />
      
      <ConfirmModal isOpen={modals.new} onClose={() => setModals(m => ({...m, new: false}))} onConfirm={handleNew} title="Buat Surat Baru?" description="Data yang sedang Anda ketik saat ini akan dikosongkan." confirmLabel="Ya, Buat Baru" icon={<FileText size={32} />} />
      
      <ConfirmModal isOpen={modals.load} onClose={() => setModals(m => ({...m, load: false}))} onConfirm={confirmLoad} title="Muat Dokumen?" description="Data yang sedang Anda ketik di form saat ini akan tertimpa." confirmLabel="Ya, Muat Data" icon={<RefreshCcw size={32} />} />
      
      <ConfirmModal isOpen={modals.delete} onClose={() => setModals(m => ({...m, delete: false}))} onConfirm={confirmDelete} title="Hapus Dokumen?" description="Tindakan ini tidak dapat dibatalkan." confirmLabel="Ya, Hapus Sekarang" icon={<AlertTriangle size={32} />} confirmVariant="red" />

      <Toast toast={toast} />
    </div>
  );
};

export default App;
