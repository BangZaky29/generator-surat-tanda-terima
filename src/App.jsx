import React, { useState } from 'react';
import Header from './components/Header';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import FloatingToggle from './components/FloatingToggle';
import { initialFormData } from './types';

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const handleDataParsed = (parsedData) => {
    setFormData(prev => ({
      ...prev,
      ...parsedData,
      // Ensure complex objects are merged correctly if needed
      items: parsedData.items || prev.items
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header onDataParsed={handleDataParsed} currentData={formData} />
      
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 lg:p-8 relative">
        {/* Increased gap from gap-8 to gap-12 and lg:gap-16 for better separation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 h-full">
          
          {/* Left Panel: Form - Hidden on mobile if preview is shown, hidden on print */}
          <div className={`lg:col-span-5 ${showPreviewMobile ? 'hidden lg:block' : 'block'} print:hidden`}>
            <div className="lg:sticky lg:top-24 h-full overflow-y-auto custom-scrollbar lg:max-h-[calc(100vh-8rem)]">
              <FormPanel data={formData} onChange={setFormData} />
            </div>
          </div>

          {/* Right Panel: Preview - Hidden on mobile if form is shown, visible on print */}
          <div className={`lg:col-span-7 ${!showPreviewMobile ? 'hidden lg:flex' : 'flex'} justify-center items-start`}>
            <PreviewPanel data={formData} />
          </div>

        </div>
      </main>

      <FloatingToggle 
        showPreview={showPreviewMobile} 
        onToggle={() => setShowPreviewMobile(!showPreviewMobile)} 
      />
    </div>
  );
};

export default App;