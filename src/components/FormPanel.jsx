import React from 'react';
import AccordionSection from './AccordionSection';
import SignaturePad from './SignaturePad';

const FormPanel = ({ data, onChange }) => {

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (id, field, value) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateField('items', newItems);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      qty: '',
      notes: ''
    };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id) => {
    updateField('items', data.items.filter(item => item.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('stempelImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 pb-24 lg:pb-0">
      
      <AccordionSection title="Informasi Surat" defaultOpen={true} 
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nomor Surat</label>
            <input 
              type="text" 
              value={data.nomorSurat}
              onChange={(e) => updateField('nomorSurat', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tanggal</label>
              <input 
                type="date" 
                value={data.tanggal}
                onChange={(e) => updateField('tanggal', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tempat</label>
              <input 
                type="text" 
                value={data.tempat}
                onChange={(e) => updateField('tempat', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Identitas Penerima"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={data.penerimaNama}
              onChange={(e) => updateField('penerimaNama', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Pekerjaan / Jabatan</label>
            <input 
              type="text" 
              value={data.penerimaPekerjaan}
              onChange={(e) => updateField('penerimaPekerjaan', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Alamat</label>
            <textarea 
              rows={2}
              value={data.penerimaAlamat}
              onChange={(e) => updateField('penerimaAlamat', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">No HP</label>
            <input 
              type="text" 
              value={data.penerimaHp}
              onChange={(e) => updateField('penerimaHp', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Identitas Penyerah"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
      >
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Nama Yang Menyerahkan</label>
          <input 
            type="text" 
            value={data.penyerahNama}
            onChange={(e) => updateField('penyerahNama', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="Contoh: Admin Gudang"
          />
        </div>
      </AccordionSection>

      <AccordionSection title="Daftar Barang / Dokumen"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
      >
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="p-3 border border-slate-200 rounded-md bg-slate-50 relative group">
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Hapus item"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-8">
                  <label className="block text-[10px] font-uppercase text-slate-500 mb-1">Nama Barang</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded text-sm"
                    placeholder="Nama barang..."
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] font-uppercase text-slate-500 mb-1">Jumlah</label>
                  <input
                    type="text"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded text-sm"
                    placeholder="1 Unit..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-uppercase text-slate-500 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded text-sm"
                  placeholder="Kondisi, warna, dll..."
                />
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="w-full py-2 border-2 border-dashed border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 hover:border-primary-300 transition-colors text-sm font-medium"
          >
            + Tambah Barang
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Informasi Perusahaan (Opsional)"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
      >
         <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Gunakan Kop Perusahaan</span>
            <button 
              onClick={() => updateField('perusahaanAktif', !data.perusahaanAktif)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.perusahaanAktif ? 'bg-primary-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.perusahaanAktif ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>
         {data.perusahaanAktif && (
           <div className="space-y-3 animate-fade-in">
             <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nama Perusahaan</label>
                <input 
                  type="text" 
                  value={data.perusahaanNama}
                  onChange={(e) => updateField('perusahaanNama', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Alamat Perusahaan</label>
                <textarea 
                  rows={2}
                  value={data.perusahaanAlamat}
                  onChange={(e) => updateField('perusahaanAlamat', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
           </div>
         )}
      </AccordionSection>

      <AccordionSection title="Tanda Tangan & Stempel"
        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
      >
        <div className="space-y-6">
          {/* Tanda Tangan Penerima */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tanda Tangan Penerima</label>
            <SignaturePad 
              initialData={data.signatureData}
              onSave={(dataUrl) => updateField('signatureData', dataUrl)} 
            />
            
            <div className="mt-3 pt-3 border-t border-slate-100">
               <label className="block text-xs font-medium text-slate-500 mb-2">Upload Stempel (PNG Transparan)</label>
               <div className="flex items-center gap-3">
                 <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-md text-sm font-medium text-slate-700 shadow-sm transition-colors">
                   <span>Pilih File</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                 </label>
                 {data.stempelImage && (
                   <button 
                    onClick={() => updateField('stempelImage', null)}
                    className="text-xs text-red-500 hover:underline"
                   >
                     Hapus Stempel
                   </button>
                 )}
               </div>
               {data.stempelImage && (
                 <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200 inline-block">
                   <img src={data.stempelImage} alt="Stempel Preview" className="h-12 w-auto object-contain" />
                 </div>
               )}
            </div>
          </div>

          {/* Tanda Tangan Penyerah */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Tanda Tangan Penyerah</label>
             <SignaturePad 
               initialData={data.penyerahSignatureData}
               onSave={(dataUrl) => updateField('penyerahSignatureData', dataUrl)} 
             />
          </div>
        </div>
      </AccordionSection>

    </div>
  );
};

export default FormPanel;