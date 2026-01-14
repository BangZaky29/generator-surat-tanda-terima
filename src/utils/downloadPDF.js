import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (elementId, fileName) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Create canvas from element
    // scale: 2 improves quality for retina displays and printing
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Initialize jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfImgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal membuat PDF. Pastikan konten sudah termuat sepenuhnya.');
  }
};