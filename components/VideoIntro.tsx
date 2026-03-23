import React, { useEffect, useRef, useState } from 'react';
import sageVideoUrl from '../assets/Sage.mp4';
import boardVideoUrl from '../assets/Board.mp4';

interface VideoIntroProps {
  onComplete: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [currentVideo, setCurrentVideo] = useState<'sage' | 'board'>('sage');
  const sageRef = useRef<HTMLVideoElement>(null);
  const boardRef = useRef<HTMLVideoElement>(null);

  const handleSageEnd = () => {
    setCurrentVideo('board');
  };

  const handleBoardEnd = () => {
    onComplete();
  };

  useEffect(() => {
    // Attempt autoplay, some browsers require user interaction but the user just clicked "Begin Yatra"
    if (currentVideo === 'sage' && sageRef.current) {
      sageRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    } else if (currentVideo === 'board' && boardRef.current) {
      boardRef.current.play().catch(e => console.error("Autoplay prevented:", e));
    }
  }, [currentVideo]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-[10000] text-stone-300 hover:text-white px-5 py-2.5 border border-white/30 rounded-full text-xs font-sans tracking-widest backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all font-bold uppercase shadow-lg"
      >
        Skip
      </button>

      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={sageRef}
          src={sageVideoUrl}
          className={`absolute w-full h-full object-contain transition-opacity duration-1000 ${currentVideo === 'sage' ? 'opacity-100' : 'opacity-0'}`}
          onEnded={handleSageEnd}
          playsInline
        />
        <video
          ref={boardRef}
          src={boardVideoUrl}
          className={`absolute w-full h-full object-contain transition-opacity duration-1000 ${currentVideo === 'board' ? 'opacity-100' : 'opacity-0'}`}
          onEnded={handleBoardEnd}
          playsInline
        />
      </div>
    </div>
  );
};

export default VideoIntro;
