
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (containerId: string, filename: string): Promise<void> => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found');
    return;
  }

  // Use a slight timeout to ensure all images (stamps/TTD) are fully rendered in the DOM
  await new Promise(resolve => setTimeout(resolve, 800));

  const pages = container.querySelectorAll('[id^="page-"]');
  if (pages.length === 0) {
    console.error('No pages found in container');
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Target A4 Dimensions in pixels at 96 DPI (approx 794x1123)
  // We use scale to increase quality
  const scale = 2.5;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;
    
    // We clone the page or ensure it's not affected by parent CSS 'scale' or 'hidden'
    // html2canvas usually handles visibility, but 'hidden' (display: none) blocks it.
    // However, in our App.tsx, the preview is hidden on mobile form view.
    
    try {
      const canvas = await html2canvas(page, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Inside the clone, ensure the page is visible if the original was hidden
          const clonedPage = clonedDoc.getElementById(page.id);
          if (clonedPage) {
            clonedPage.style.display = 'block';
            clonedPage.style.visibility = 'visible';
            clonedPage.style.position = 'static';
            clonedPage.style.margin = '0';
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } catch (error) {
      console.error('Error generating page ' + i, error);
    }
  }

  pdf.save(`${filename}.pdf`);
};
