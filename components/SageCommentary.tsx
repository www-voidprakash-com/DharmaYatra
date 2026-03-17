
import React from 'react';
import { GiScrollQuill } from 'react-icons/gi';
import { FaVolumeUp, FaStop, FaRedoAlt } from 'react-icons/fa';

interface SageCommentaryProps {
  text: string | null;
  isLoading: boolean;
  isSpeaking?: boolean;
  onStop?: () => void;
  onReplay?: () => void;
}

const SageCommentary: React.FC<SageCommentaryProps> = ({ text, isLoading, isSpeaking = false, onStop, onReplay }) => {
  if (!text && !isLoading) return null;

  const handleClick = () => {
      if (isSpeaking && onStop) {
          onStop();
      } else if (!isSpeaking && !isLoading && onReplay) {
          onReplay();
      }
  };

  const isInteractive = isSpeaking || (!isLoading && text);
  const cursorClass = isInteractive ? 'cursor-pointer hover:bg-orange-50/80 ring-2 ring-orange-200' : '';

  return (
    <div 
      onClick={isInteractive ? handleClick : undefined}
      className={`relative overflow-hidden rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 p-4 shadow-lg transition-all duration-500 ${cursorClass}`}
      title={isSpeaking ? "Click to stop voice" : "Click to replay voice"}
    >
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <GiScrollQuill className="text-6xl text-amber-800" />
      </div>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="mt-1 flex-shrink-0 relative">
             <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 shadow-inner">
                <span className="text-lg">🧘</span>
             </div>
             {isSpeaking && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-orange-100">
                    <FaVolumeUp className="text-orange-600 text-[0.6rem] animate-pulse" />
                </div>
             )}
             {!isSpeaking && !isLoading && text && (
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow border border-orange-100">
                    <FaRedoAlt className="text-orange-600 text-[0.6rem]" />
                 </div>
             )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-800 flex items-center gap-2">
               Sage's Wisdom
               {isSpeaking && (
                   <span className="text-[0.6rem] bg-orange-200 text-orange-800 px-1 rounded flex items-center">
                       <FaStop className="mr-1" /> Stop
                   </span>
               )}
               {!isSpeaking && !isLoading && text && (
                   <span className="text-[0.6rem] bg-orange-100 text-orange-800 px-1 rounded flex items-center opacity-80">
                       <FaRedoAlt className="mr-1" /> Replay
                   </span>
               )}
            </h4>
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-1 h-5">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <p className="text-sm font-medium text-amber-900 leading-snug italic font-serif">
              "{text}"
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-400/50"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-400/50"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-400/50"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-400/50"></div>
    </div>
  );
};

export default SageCommentary;
