
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Upload, PenLine, Stamp } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string | null) => void;
  onSaveStamp: (dataUrl: string | null) => void;
  initialValue?: string | null;
  initialStamp?: string | null;
  label: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSave, onSaveStamp, initialValue, initialStamp, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(!!initialValue);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');

  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000';

      if (initialValue && initialValue.startsWith('data:image')) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
        };
        img.src = initialValue;
      }
    }
  }, [initialValue, mode]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      save();
    }
  };

  const clear = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasContent(false);
    onSave(null);
  };

  const save = useCallback(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      onSave(canvas.toDataURL('image/png'));
    }
  }, [onSave, mode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        onSave(res);
        setHasContent(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onSaveStamp(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-slate-100 rounded-2xl bg-white">
      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <div className="flex gap-2">
          <button onClick={() => setMode('draw')} className={`p-1.5 rounded-lg transition-all ${mode === 'draw' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`} title="Coret TTD">
            <PenLine size={16} />
          </button>
          <button onClick={() => setMode('upload')} className={`p-1.5 rounded-lg transition-all ${mode === 'upload' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`} title="Upload TTD">
            <Upload size={16} />
          </button>
          <button onClick={clear} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Hapus TTD">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden h-32 touch-none flex items-center justify-center">
        {mode === 'draw' ? (
          <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-full cursor-crosshair" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             {initialValue && mode === 'upload' ? (
               <img src={initialValue} alt="Uploaded TTD" className="max-h-full max-w-full object-contain p-2" />
             ) : (
               <label className="cursor-pointer flex flex-col items-center gap-2 group">
                 <Upload className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                 <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">Klik Upload Gambar TTD</span>
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
               </label>
             )}
          </div>
        )}
        {!hasContent && mode === 'draw' && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-300 text-xs font-bold">Coret di sini</span>
          </div>
        )}
      </div>

      {/* Stamp Section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Stamp size={12} /> Stempel / Logo Tambahan
          </div>
          {initialStamp && (
            <button onClick={() => onSaveStamp(null)} className="text-red-400 hover:text-red-600">
               <Trash2 size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {initialStamp ? (
             <img src={initialStamp} alt="Stamp" className="w-12 h-12 rounded border border-slate-200 object-contain p-1 bg-white" />
          ) : (
             <div className="w-12 h-12 rounded border border-dashed border-slate-200 bg-slate-50" />
          )}
          <label className="flex-1 cursor-pointer">
            <div className="w-full py-2 px-3 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 bg-white hover:bg-slate-50 transition-colors text-center border-dashed">
              Upload Stempel
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleStampUpload} />
          </label>
        </div>
      </div>
    </div>
  );
};
