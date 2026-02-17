import React from 'react';
import { PostConfig } from '../types';
import { Upload } from 'lucide-react';

interface EditorPanelProps {
  post: PostConfig;
  onChange: (post: PostConfig) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ post, onChange }) => {
  
  const updateField = (field: keyof PostConfig, value: any) => {
    onChange({ ...post, [field]: value });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateField('avatar', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white p-6 space-y-8 pb-20">
      
      {/* Branding */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Post Details</h2>
        <p className="text-slate-500 text-sm mt-1">Configure your mock post.</p>
      </div>

      {/* Profile Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Profile</h3>
        
        <div className="flex gap-4 items-center">
            <div className="relative w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200 group shrink-0">
                {post.avatar ? (
                    <img src={post.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-300" />
                )}
                <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
            </div>
            <div className="flex-1 space-y-3">
                <input 
                    type="text" 
                    value={post.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Display Name"
                    dir="auto"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 text-sm">@</span>
                    <input 
                        type="text" 
                        value={post.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        placeholder="username"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Content</h3>
        
        <div className="space-y-2">
            <textarea 
                value={post.text}
                onChange={(e) => updateField('text', e.target.value)}
                placeholder="What is happening?!"
                dir="auto"
                className="w-full min-h-[120px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
            />
            <div className="flex justify-end">
                <span className={`text-xs ${post.text.length > 280 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {post.text.length} chars
                </span>
            </div>
        </div>
      </section>

    </div>
  );
};

export default EditorPanel;