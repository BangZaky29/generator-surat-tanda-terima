import React, { useState } from 'react';
import { downloadPDF } from '../utils/downloadPDF';

const PreviewPanel = ({ data }) => {
  const [downloadStatus, setDownloadStatus] = useState('idle');

  const formattedDate = new Date(data.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleDownload = async () => {
    setDownloadStatus('processing');
    
    // Give UI time to update
    await new Promise(resolve => setTimeout(resolve, 100));

    await downloadPDF("surat-preview", `Surat-Tanda-Terima-${data.nomorSurat.replace(/\//g, '-')}.pdf`);
    
    setDownloadStatus('success');
    
    // Reset status after a few seconds
    setTimeout(() => {
      setDownloadStatus('idle');
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-6 relative w-full">
      {/* Toast Notification */}
      {downloadStatus !== 'idle' && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg font-medium transition-all duration-300 ${
          downloadStatus === 'processing' 
            ? 'bg-blue-600 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {downloadStatus === 'processing' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sedang mengunduh PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Download Berhasil!</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 print:hidden w-full max-w-[210mm] justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 font-medium text-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print
        </button>
        <button
          onClick={handleDownload}
          disabled={downloadStatus === 'processing'}
          className={`flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 font-medium text-sm transition-all ${downloadStatus === 'processing' ? 'opacity-70 cursor-wait' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF
        </button>
      </div>

      {/* 
         WRAPPER SCALING UNTUK MOBILE 
         Menggunakan transform scale untuk mengecilkan tampilan A4 agar muat di layar HP
         origin-top: Titik pusat scaling di atas
      */}
      <div className="w-full flex justify-center overflow-visible pb-10">
        <div className="transform origin-top scale-[0.43] sm:scale-[0.6] md:scale-[0.8] xl:scale-100 transition-transform duration-300 ease-out">
          
          {/* A4 PAPER */}
          <div className="bg-white shadow-2xl print:shadow-none min-w-[210mm] min-h-[297mm] overflow-hidden relative">
            <div id="surat-preview" className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-black relative flex flex-col box-border">
              
              {/* Header/Kop Optional */}
              {data.perusahaanAktif && (
                <div className="border-b-2 border-black pb-4 mb-8 text-center">
                  <h1 className="text-xl font-bold uppercase tracking-wider">{data.perusahaanNama}</h1>
                  <p className="text-sm text-slate-600 mt-1">{data.perusahaanAlamat}</p>
                </div>
              )}

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className={`font-bold underline decoration-2 underline-offset-4 mb-2 ${data.perusahaanAktif ? 'text-lg' : 'text-xl'}`}>
                  SURAT TANDA TERIMA
                </h2>
                <p className="text-sm">Nomor: {data.nomorSurat}</p>
              </div>

              {/* Content Body */}
              <div className="flex-grow text-sm leading-relaxed space-y-6">
                <p className="text-justify">
                  Sehubungan dengan serah terima barang/dokumen yang berlangsung pada hari ini, 
                  kami yang bertanda tangan di bawah ini:
                </p>

                {/* Identity */}
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32 py-1 align-top">Nama</td>
                      <td className="w-4 py-1 align-top">:</td>
                      <td className="py-1 font-medium">{data.penerimaNama || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1 align-top">Jabatan</td>
                      <td className="py-1 align-top">:</td>
                      <td className="py-1">{data.penerimaPekerjaan || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1 align-top">Alamat</td>
                      <td className="py-1 align-top">:</td>
                      <td className="py-1">{data.penerimaAlamat || "......................................."}</td>
                    </tr>
                    <tr>
                      <td className="py-1 align-top">No. HP</td>
                      <td className="py-1 align-top">:</td>
                      <td className="py-1">{data.penerimaHp || "......................................."}</td>
                    </tr>
                  </tbody>
                </table>

                <p>Telah menerima barang/dokumen dengan rincian sebagai berikut:</p>

                {/* Items Table */}
                <div className="border border-black rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-black">
                        <th className="p-2 border-r border-black w-10 text-center">No</th>
                        <th className="p-2 border-r border-black w-1/3">Nama Barang</th>
                        <th className="p-2 border-r border-black w-24">Jumlah</th>
                        <th className="p-2">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.length > 0 ? (
                        data.items.map((item, idx) => (
                          <tr key={item.id} className="border-b border-black last:border-b-0">
                            <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                            <td className="p-2 border-r border-black font-medium">{item.name}</td>
                            <td className="p-2 border-r border-black">{item.qty}</td>
                            <td className="p-2 text-slate-600">{item.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400 italic">Belum ada barang ditambahkan</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4">
                  Demikian surat tanda terima ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Signature Section - Two Columns */}
              <div className="mt-12 flex justify-between items-end">
                
                {/* LEFT: Penerima */}
                <div className="text-center w-48 relative">
                  <p className="mb-16 font-medium">Penerima,</p>
                  
                  {/* Penerima Signature Canvas Overlay */}
                  {data.signatureData && (
                    <img 
                        src={data.signatureData} 
                        alt="Signature" 
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-auto mix-blend-multiply"
                    />
                  )}
                  
                  {/* Stamp Overlay (Assigned to Penerima) */}
                  {data.stempelImage && (
                    <img 
                        src={data.stempelImage} 
                        alt="Stamp" 
                        className="absolute bottom-6 right-0 opacity-80 w-24 h-auto transform rotate-[-10deg] mix-blend-multiply"
                    />
                  )}

                  <p className="font-bold border-b border-black pb-1 inline-block min-w-[150px]">
                    {data.penerimaNama || "( Nama Jelas )"}
                  </p>
                </div>

                {/* RIGHT: Yang Menyerahkan */}
                <div className="text-center w-48 relative">
                  <p className="mb-4">{data.tempat}, {formattedDate}</p>
                  <p className="mb-16 font-medium">Yang Menyerahkan,</p>

                  {/* Penyerah Signature Canvas Overlay */}
                  {data.penyerahSignatureData && (
                    <img 
                        src={data.penyerahSignatureData} 
                        alt="Signature" 
                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-auto mix-blend-multiply"
                    />
                  )}

                  <p className="font-bold border-b border-black pb-1 inline-block min-w-[150px]">
                    {data.penyerahNama || "( Nama Jelas )"}
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 -mt-20 lg:mt-0 pb-10 print:hidden text-center w-full">
        Preview A4
      </p>
    </div>
  );
};

export default PreviewPanel;