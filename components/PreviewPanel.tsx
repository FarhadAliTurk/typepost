import React, { useRef, useState } from 'react';
import XPost from './XPost';
import { PostConfig } from '../types';
import { generateImage, downloadDataUrl } from '../utils/export';
import { Download, Loader2 } from 'lucide-react';

interface PreviewPanelProps {
  post: PostConfig;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ post }) => {
  const lightRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'auto' | 'square'>('auto');
  
  const handleExport = async (theme: 'light' | 'dark', format: 'png' | 'jpeg') => {
    const ref = theme === 'light' ? lightRef : darkRef;
    if (!ref.current) return;
    
    setIsExporting(theme);
    
    try {
      const dataUrl = await generateImage(ref.current, {
        format,
        scale: 3, // 3x for high res
      });
      const filename = `${post.username}_${theme}_${Date.now()}.${format}`;
      downloadDataUrl(dataUrl, filename);
    } catch (e) {
      alert("Error generating image. Please try again.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100/50 relative overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 border-b bg-white px-4 flex items-center justify-between shrink-0">
             <div className="text-sm font-medium text-gray-500">Live Preview</div>
             <div className="flex gap-2">
                 <button 
                   onClick={() => setPreviewMode(previewMode === 'auto' ? 'square' : 'auto')}
                   className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                 >
                    {previewMode === 'auto' ? 'Fit Content' : 'Square (1:1)'}
                 </button>
             </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-gray-200">
            <div className="flex flex-col xl:flex-row gap-8 items-center justify-center min-h-full">
                
                {/* Light Theme Preview */}
                <div className="flex flex-col gap-3 w-full max-w-[600px] items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Light Theme</span>
                    <div 
                        ref={lightRef}
                        className={`
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center w-full shadow-xl rounded-2xl
                            ${previewMode === 'square' ? 'aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 p-8' : ''}
                        `}
                    >
                        <XPost post={post} theme="light" exportMode={previewMode === 'square'} />
                    </div>
                </div>

                {/* Dark Theme Preview */}
                <div className="flex flex-col gap-3 w-full max-w-[600px] items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dark Theme</span>
                    <div 
                        ref={darkRef}
                        className={`
                            transition-all duration-300 ease-in-out
                            flex items-center justify-center w-full shadow-xl rounded-2xl
                            ${previewMode === 'square' ? 'aspect-square bg-[#16181c] p-8' : ''}
                        `}
                    >
                        <XPost post={post} theme="dark" exportMode={previewMode === 'square'} />
                    </div>
                </div>

            </div>
        </div>

        {/* Sticky Export Bar */}
        <div className="p-4 bg-white border-t shrink-0 flex flex-wrap gap-2 justify-end items-center">
            <span className="text-xs text-gray-400 mr-auto hidden sm:inline-block">High-Res (3x Scale)</span>
            
            <button
                onClick={() => handleExport('light', 'png')}
                disabled={!!isExporting}
                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
                {isExporting === 'light' ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Save Light</span>
            </button>
            
            <button
                onClick={() => handleExport('dark', 'png')}
                disabled={!!isExporting}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {isExporting === 'dark' ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>Save Dark</span>
            </button>
        </div>
    </div>
  );
};

export default PreviewPanel;