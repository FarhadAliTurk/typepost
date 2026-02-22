import React, { useState } from 'react';
import { INITIAL_POST } from './constants';
import { PostConfig } from './types';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [post, setPost] = useState<PostConfig>(INITIAL_POST);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-slate-900">
      
      {/* Sidebar / Editor - Hidden on mobile unless toggled */}
      <div 
        className={`
            fixed inset-y-0 left-0 z-50 w-full sm:w-[400px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            sm:relative sm:transform-none sm:shadow-none border-r border-gray-200
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}
      >
          <div className="h-full flex flex-col">
              <div className="sm:hidden p-4 border-b flex justify-between items-center bg-white">
                  <span className="font-bold text-lg">Editor</span>
                  <button onClick={() => setMobileMenuOpen(false)}><X /></button>
              </div>
              <div className="flex-1 overflow-hidden">
                <EditorPanel post={post} onChange={setPost} />
              </div>
          </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="sm:hidden h-14 bg-white border-b flex items-center px-4 justify-between shrink-0">
            <span className="font-bold text-xl tracking-tight">TypePost</span>
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 bg-gray-100 rounded-md"
            >
                <Menu size={20} />
            </button>
        </div>

        <PreviewPanel post={post} />
        
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}
      </div>
    </div>
  );
}