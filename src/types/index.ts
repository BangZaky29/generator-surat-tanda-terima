//C:\codingVibes\nuansasolution\.subpath\generator-surat-tanda-terima-v2\src\types\index.ts
export interface ReceiptItem {
  id: string;
  name: string;
  quantity: string;
  description: string;
}

export interface CompanyInfo {
  showKop: boolean;
  name: string;
  address: string;
  logoUrl?: string;
}

export interface PersonInfo {
  name: string;
  position: string;
  address: string;
  phone: string;
}

export interface ReceiptData {
  id: string;
  projectName?: string;
  nomorSurat: string;
  tanggal: string;
  tempat: string;
  penerima: PersonInfo;
  penyerah: PersonInfo;
  items: ReceiptItem[];
  company: CompanyInfo;
  signatures: {
    penerima: string | null;
    penyerah: string | null;
  };
  stamps: {
    penerima: string | null;
    penyerah: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SavedDocument {
  id: string;
  projectName: string;
  nomorSurat: string;
  tanggal: string;
  dataFormLengkap: ReceiptData;
  createdAt: string;
  updatedAt: string;
}
