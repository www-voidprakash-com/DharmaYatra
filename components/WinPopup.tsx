import React, { useEffect, useState } from 'react';

interface WinPopupProps {
  onComplete: () => void;
}

const WinPopup: React.FC<WinPopupProps> = ({ onComplete }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const images = ['/victory_1.png', '/victory_2.png', '/victory_3.png'];

  useEffect(() => {
    // Flashing effect: cycle images rapidly
    const flashInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 150); // 150ms for "flashing" feel

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(flashInterval);
      clearTimeout(timer);
    };
  }, [onComplete, images.length]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black overflow-hidden">
      {/* Background Flashing Image */}
      <div className="absolute inset-0 transition-opacity duration-100">
        <img 
          src={images[imageIndex]} 
          alt="Victory Flash" 
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Retro/Arcade style "VICTORY" Text */}
      <div className="relative z-10 text-center animate-bounce">
        <h1 className="text-6xl md:text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,165,0,0.8)] tracking-tighter uppercase italic">
          Victory!
        </h1>
        <p className="text-2xl md:text-4xl text-yellow-400 font-bold mt-4 drop-shadow-md">
          The Journey is Fulfilled
        </p>
      </div>

      {/* Simplified Fireworks (CSS based) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="firework"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style>{`
        .firework {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px currentColor;
          opacity: 0;
          animation: firework-burst 2s infinite;
        }
        @keyframes firework-burst {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(30); opacity: 0.8; }
          100% { transform: scale(40); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WinPopup;
