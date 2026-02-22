import React, { useRef, useState } from 'react';
import XPost from './XPost';
import { PostConfig } from '../types';
import { generateImage, downloadDataUrl } from '../utils/export';
import { Download, Loader2 } from 'lucide-react';

interface PreviewPanelProps {
  post: PostConfig;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ post }) => {
  const lightFitRef = useRef<HTMLDivElement>(null);
  const lightSquareRef = useRef<HTMLDivElement>(null);
  const darkFitRef = useRef<HTMLDivElement>(null);
  const darkSquareRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (ref: React.RefObject<HTMLDivElement>, id: string, theme: 'light' | 'dark', format: 'png' | 'jpeg') => {
    if (!ref.current) return;

    setIsExporting(id);

    try {
      const dataUrl = await generateImage(ref.current, {
        format,
        scale: 3, // 3x for high res
      });
      const filename = `${post.username}_${id}_${Date.now()}.${format}`;
      downloadDataUrl(dataUrl, filename);
    } catch (e) {
      alert("Error generating image. Please try again.");
    } finally {
      setIsExporting(null);
    }
  };

  const previewCards = [
    { id: 'light_fit', name: 'Light - Fit', theme: 'light' as const, square: false, ref: lightFitRef },
    { id: 'light_square', name: 'Light - Square', theme: 'light' as const, square: true, ref: lightSquareRef },
    { id: 'dark_fit', name: 'Dark - Fit', theme: 'dark' as const, square: false, ref: darkFitRef },
    { id: 'dark_square', name: 'Dark - Square', theme: 'dark' as const, square: true, ref: darkSquareRef },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100/50 relative overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 border-b bg-white px-4 flex items-center justify-between shrink-0">
        <div className="text-sm font-medium text-gray-500">All Live Previews</div>
        <div className="text-xs text-gray-400 hidden sm:inline-block">High-Res (3x Scale)</div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-gray-200">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1400px] mx-auto pb-12">
          {previewCards.map((card) => (
            <div key={card.id} className="flex flex-col gap-3 w-full items-center">
              <div className="w-full flex justify-between items-end px-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.name}</span>
                <button
                  onClick={() => handleExport(card.ref, card.id, card.theme, 'png')}
                  disabled={!!isExporting}
                  className={`
                                    flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                                    ${card.theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'}
                                    disabled:opacity-50
                                `}
                >
                  {isExporting === card.id ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Save {card.square ? 'Square' : 'Fit'}</span>
                </button>
              </div>
              <div
                ref={card.ref}
                className={`
                                transition-all duration-300 ease-in-out
                                flex items-center justify-center w-full shadow-xl rounded-2xl overflow-hidden
                                ${card.square ? 'aspect-square py-8' : ''}
                                ${card.theme === 'dark' ? 'bg-[#16181c]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}
                            `}
              >
                <XPost post={post} theme={card.theme} exportMode={card.square} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;