import React, { useMemo } from 'react';
import { PostConfig } from '../types';
import { XLogo, VerifiedBadge } from './Icons';

interface XPostProps {
  post: PostConfig;
  theme: 'light' | 'dark';
  exportMode?: boolean;
}

const XPost = React.forwardRef<HTMLDivElement, XPostProps>(({ post, theme, exportMode }, ref) => {
  const colors = useMemo(() => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-black',
          text: 'text-[#e7e9ea]',
          textSec: 'text-[#71767b]',
          border: 'border-[#2f3336]',
          link: 'text-[#1d9bf0]',
          icon: 'text-[#71767b]'
        };
      default: // light
        return {
          bg: 'bg-white',
          text: 'text-[#0f1419]',
          textSec: 'text-[#536471]',
          border: 'border-[#cfd9de]',
          link: 'text-[#1d9bf0]',
          icon: 'text-[#536471]'
        };
    }
  }, [theme]);

  // Format Text with Highlights (hashtags/mentions) - naive implementation for visual feel
  const renderText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.match(/^(@|#|http)/)) {
        return <span key={i} className={`${colors.link} cursor-pointer`}>{word}</span>;
      }
      return word;
    });
  };

  return (
    <div
      ref={ref}
      className={`
        ${colors.bg} ${colors.text} 
        ${exportMode ? 'w-full' : 'w-full max-w-[600px] mx-auto'} 
        ${exportMode ? '' : 'rounded-2xl border shadow-sm'} 
        ${exportMode ? 'p-0' : colors.border}
        overflow-hidden
        font-sans
      `}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      <div className="p-4 sm:p-[20px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 relative">
              {post.avatar ? (
                <img src={post.avatar} alt={post.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-400" />
              )}
            </div>
            <div className="flex flex-col justify-center leading-5">
              <div className="flex items-center gap-1 group">
                <span dir="auto" className="font-bold text-[15px] hover:underline cursor-pointer truncate max-w-[200px]">{post.name}</span>
                <VerifiedBadge className="w-[18px] h-[18px]" />
              </div>
              <div className={`${colors.textSec} text-[15px]`}>@{post.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 -mt-2 -mr-2">
            <div className={`${colors.text} opacity-90 p-2 flex items-center gap-[1px]`}>
              <XLogo className="w-4 h-4" />
              <span className="text-[14px] leading-none font-medium">.com</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 mb-4">
          <p dir="auto" className={`text-[17px] sm:text-[20px] leading-normal whitespace-pre-wrap break-words`}>
            {renderText(post.text)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default XPost;