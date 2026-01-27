
import React from 'react';
import { ReceiptData, ReceiptItem } from '../../types';

interface DocumentPreviewProps {
  data: ReceiptData;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const { nomorSurat, tanggal, tempat, penerima, penyerah, items, company, signatures, stamps } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '...';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Pagination logic remains to prevent overflow, but filler rows are removed
  const ITEMS_PER_FIRST_PAGE = 15; 
  const ITEMS_PER_SUBSEQUENT_PAGE = 22;

  const pages: ReceiptItem[][] = [];
  if (items.length === 0) {
    pages.push([]);
  } else {
    let currentItems = [...items];
    pages.push(currentItems.splice(0, ITEMS_PER_FIRST_PAGE));
    while (currentItems.length > 0) {
      pages.push(currentItems.splice(0, ITEMS_PER_SUBSEQUENT_PAGE));
    }
  }

  // Helper for dynamic dots
  const FieldValue = ({ value }: { value: string }) => {
    if (value) return <span className="text-black font-semibold">{value}</span>;
    return <span className="text-slate-300">..................................................................</span>;
  };

  return (
    <div id="document-container" className="flex flex-col bg-transparent">
      {pages.map((pageItems, pageIndex) => (
        <div 
          key={pageIndex}
          className="bg-white p-[20mm] w-[210mm] min-h-[297mm] mx-auto text-black font-formal text-[12pt] flex flex-col leading-relaxed relative shadow-lg mb-8 last:mb-0 print:shadow-none print:m-0"
          id={`page-${pageIndex}`}
        >
          {pageIndex === 0 && company.showKop && (
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div className="flex items-center gap-6">
                {company.logoUrl && (
                  <img src={company.logoUrl} alt="Logo" className="w-20 h-20 object-contain" />
                )}
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold uppercase tracking-tight leading-none text-black">{company.name || 'NAMA PERUSAHAAN'}</h1>
                  <p className="text-sm italic text-slate-700 mt-2 max-w-md">{company.address || 'Alamat Perusahaan Lengkap'}</p>
                </div>
              </div>
            </div>
          )}

          {pageIndex === 0 && (
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold underline uppercase tracking-widest text-black">SURAT TANDA TERIMA</h2>
              <p className="text-base text-black font-bold">Nomor: {nomorSurat || '.........................'}</p>
            </div>
          )}

          {pageIndex === 0 && (
            <>
              <div className="mb-4 text-black">
                <p>Sehubungan dengan serah terima barang/dokumen yang berlangsung pada hari ini, kami yang bertanda tangan di bawah ini:</p>
              </div>

              <div className="mb-4 grid grid-cols-[120px_10px_1fr] gap-y-1 ml-4 text-black">
                <span className="font-bold">Nama</span> <span>:</span> <span><FieldValue value={penerima.name} /></span>
                <span className="font-bold">Jabatan</span> <span>:</span> <span><FieldValue value={penerima.position} /></span>
                <span className="font-bold">Alamat</span> <span>:</span> <span><FieldValue value={penerima.address} /></span>
                <span className="font-bold">No. HP</span> <span>:</span> <span><FieldValue value={penerima.phone} /></span>
              </div>

              <div className="mb-4 text-black">
                <p>Telah menerima barang/dokumen dengan rincian sebagai berikut:</p>
              </div>
            </>
          )}

          {pageIndex > 0 && (
            <div className="mb-4 text-black italic border-b border-black pb-1 flex justify-between text-sm">
              <span>Lanjutan Daftar Barang - No: {nomorSurat || '...'}</span>
              <span>Hal. {pageIndex + 1}</span>
            </div>
          )}

          <div className="mb-6 flex-grow">
            <table className="w-full border-collapse border border-black text-[11pt]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-black p-2 w-12 text-center font-bold">No</th>
                  <th className="border border-black p-2 text-left font-bold">Nama Barang / Dokumen</th>
                  <th className="border border-black p-2 w-28 text-center font-bold">Jumlah</th>
                  <th className="border border-black p-2 text-left font-bold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, i) => {
                  const globalIdx = (pages.slice(0, pageIndex).reduce((acc, p) => acc + p.length, 0)) + i + 1;
                  return (
                    <tr key={item.id} className="min-h-[8mm]">
                      <td className="border border-black p-2 text-center">
                        {globalIdx}
                      </td>
                      <td className="border border-black p-2">
                        {item.name || ''}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {item.quantity || ''}
                      </td>
                      <td className="border border-black p-2">
                        {item.description || ''}
                      </td>
                    </tr>
                  );
                })}
                {/* Fallback if page is totally empty */}
                {pageItems.length === 0 && pageIndex === 0 && (
                  <tr className="h-8">
                    <td className="border border-black p-2 text-center">1</td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2 text-center"></td>
                    <td className="border border-black p-2"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageIndex === pages.length - 1 && (
            <div className="mt-auto">
              <div className="mb-6 text-black">
                <p>Demikian surat tanda terima ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
              </div>

              <div className="grid grid-cols-2 gap-20">
                {/* Receiver Column */}
                <div className="flex flex-col items-center justify-end">
                  <p className="font-bold mb-2 h-6 flex items-center">Penerima,</p>
                  <div className="h-28 w-48 flex items-center justify-center relative">
                    {stamps.penerima && (
                      <img src={stamps.penerima} alt="Stamp Penerima" className="absolute w-20 h-20 opacity-80 left-1/2 -translate-x-1/2 object-contain pointer-events-none z-0" style={{ mixBlendMode: 'multiply' }} />
                    )}
                    {signatures.penerima && (
                      <img src={signatures.penerima} alt="Sign Penerima" className="max-h-full max-w-full relative z-10" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <p className="font-bold underline uppercase tracking-tight text-center leading-tight">
                      ( {penerima.name || 'NAMA JELAS'} )
                    </p>
                  </div>
                </div>
                
                {/* Submitter Column */}
                <div className="flex flex-col items-center">
                  <div className="font-bold mb-4 text-center">
                    {tempat || 'Jakarta'}, {formatDate(tanggal)}
                  </div>
                  <p className="font-bold mb-2 h-6 flex items-center">Yang Menyerahkan,</p>
                  <div className="h-28 w-48 flex items-center justify-center relative">
                    {stamps.penyerah && (
                      <img src={stamps.penyerah} alt="Stamp Penyerah" className="absolute w-24 h-24 opacity-80 left-3/4 -translate-x-1/2 -translate-y-4 object-contain pointer-events-none z-0" style={{ mixBlendMode: 'multiply' }} />
                    )}
                    {signatures.penyerah && (
                      <img src={signatures.penyerah} alt="Sign Penyerah" className="max-h-full max-w-full relative z-10" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <p className="font-bold underline uppercase tracking-tight text-center leading-tight">
                      ( {penyerah.name || 'NAMA JELAS'} )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
