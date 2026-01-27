
import { SavedDocument, ReceiptData } from '../types';

const STORAGE_KEY = 'receipt-documents';

export const getDocuments = (): SavedDocument[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing documents from localStorage', error);
    return [];
  }
};

export const saveDocument = (data: ReceiptData): SavedDocument => {
  const documents = getDocuments();
  const newDoc: SavedDocument = {
    id: data.id,
    projectName: data.projectName || 'Proyek Tanpa Nama',
    nomorSurat: data.nomorSurat,
    tanggal: data.tanggal,
    dataFormLengkap: data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedDocs = [newDoc, ...documents];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
  return newDoc;
};

export const updateDocument = (id: string, data: ReceiptData): void => {
  const documents = getDocuments();
  const index = documents.findIndex(doc => doc.id === id);
  
  if (index !== -1) {
    documents[index] = {
      ...documents[index],
      projectName: data.projectName || documents[index].projectName,
      nomorSurat: data.nomorSurat,
      tanggal: data.tanggal,
      dataFormLengkap: data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
};

export const deleteDocument = (id: string): void => {
  const documents = getDocuments();
  const filtered = documents.filter(doc => doc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const getDocumentById = (id: string): SavedDocument | undefined => {
  const documents = getDocuments();
  return documents.find(doc => doc.id === id);
};
