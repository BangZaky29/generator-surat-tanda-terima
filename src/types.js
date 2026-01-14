export const initialFormData = {
  nomorSurat: "001/STT/X/2023",
  tanggal: new Date().toISOString().split('T')[0],
  tempat: "Jakarta",
  penerimaNama: "",
  penerimaPekerjaan: "",
  penerimaAlamat: "",
  penerimaHp: "",
  penyerahNama: "",
  penyerahSignatureData: null,
  items: [
    { id: '1', name: "Laptop MacBook Pro M1", qty: "1 Unit", notes: "Kondisi baik" }
  ],
  perusahaanAktif: false,
  perusahaanNama: "PT. Teknologi Maju Jaya",
  perusahaanAlamat: "Jl. Sudirman No. 1, Jakarta Selatan",
  signatureData: null,
  stempelImage: null,
};