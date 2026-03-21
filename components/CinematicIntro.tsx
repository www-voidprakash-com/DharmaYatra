import React, { useEffect, useState } from 'react';
import './CinematicIntro.css';

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    // Automatically finish intro after 45 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 45000);
    return () => clearTimeout(timer);
  }, [hasStarted, onComplete]);

  // Handle precise scaling to maintain 9:16 aspect ratio beautifully on all screens
  useEffect(() => {
    if (!hasStarted) return;
    const handleResize = () => {
      const el = document.getElementById('stage-intro');
      if (el) {
        const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
        el.style.transform = `scale(${scale})`;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [hasStarted]);

  // Ambient Spiritual Tanpura Drone Generation via Web Audio API
  useEffect(() => {
    if (!hasStarted) return;

    let audioCtx: AudioContext;
    let masterGain: GainNode;
    let osc1: OscillatorNode, osc2: OscillatorNode, osc3: OscillatorNode;

    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 5); // Deep 5-second fade in

      const baseFreq = 136.1; // Frequency of 'Om' (C# 136.1 Hz)

      osc1 = audioCtx.createOscillator();
      osc1.frequency.value = baseFreq;
      osc1.type = 'sine';

      osc2 = audioCtx.createOscillator();
      osc2.frequency.value = baseFreq * 1.5; // Perfect fifth for tanpura harmony
      osc2.type = 'triangle';

      osc3 = audioCtx.createOscillator();
      osc3.frequency.value = baseFreq / 2; // Sub-octave for deep resonance
      osc3.type = 'sine';

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350; // Muffled, atmospheric, ethereal

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      return () => {
        masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 3); // fade out gracefully
        setTimeout(() => {
          try {
            osc1.stop(); osc2.stop(); osc3.stop();
            audioCtx.close();
          } catch(e) {}
        }, 3000);
      };
    } catch (e) {
      console.warn("Audio Context failed to start.", e);
    }
  }, [hasStarted]);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-serif text-white overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest text-[#fdf5e6] mb-8 animate-pulse text-center px-4" style={{ fontFamily: '"Georgia", serif' }}>
          DharmaYatra 101
        </h1>
        <p className="text-[#f5deb3] mb-12 text-center text-lg md:text-xl font-light">
          A Game • A Journey • A Mirror
        </p>
        <button 
          onClick={() => setHasStarted(true)}
          className="px-8 py-4 border-2 border-[#f5deb3]/40 rounded-full text-lg uppercase tracking-widest hover:bg-[#f5deb3]/10 hover:border-[#f5deb3] transition-all transform hover:scale-105"
        >
          Begin Experience
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center">
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-[10000] text-stone-300 hover:text-white px-5 py-2.5 border border-white/30 rounded-full text-xs font-sans tracking-widest backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all font-bold uppercase shadow-lg"
      >
        Skip Intro
      </button>

      <div id="stage-intro" className="relative w-[1080px] h-[1920px] bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] origin-center">
        {/* Scene 1 */}
        <div className="cr-scene nth-1">
          <img src="/intro/card_1.png" alt="Card 1" />
          <div className="cr-text-box top-40">
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>What if this was never just a game?</h2>
          </div>
        </div>

        {/* Scene 2 */}
        <div className="cr-scene nth-2">
          <img src="/intro/card_2.png" alt="Card 2" />
          <div className="cr-text-box">
            <h2 className="text-[55px] font-medium text-[#f5deb3] mb-6 font-serif" style={{ fontFamily: '"Georgia", serif' }}>Centuries ago in India...</h2>
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>A game called Moksha Patam was created.</h2>
          </div>
        </div>

        {/* Scene 3 */}
        <div className="cr-scene nth-3">
          <img src="/intro/card_3.png" alt="Card 3" />
          <div className="cr-text-box">
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>Ladders were virtues.</h2>
          </div>
        </div>

        {/* Scene 4 */}
        <div className="cr-scene nth-4">
          <img src="/intro/card_4.png" alt="Card 4" />
          <div className="cr-text-box">
            <h2 className="text-[55px] font-medium text-[#f5deb3] mb-6 font-serif" style={{ fontFamily: '"Georgia", serif' }}>Snakes were vices.</h2>
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>Every fall carried consequence.</h2>
          </div>
        </div>

        {/* Scene 5 */}
        <div className="cr-scene nth-5">
          <img src="/intro/card_5.png" alt="Card 5" />
          <div className="cr-text-box">
            <h2 className="text-[55px] font-medium text-[#f5deb3] mb-6 font-serif" style={{ fontFamily: '"Georgia", serif' }}>It was a map of life, karma, and Moksha.</h2>
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>Over time, it became a game of chance.</h2>
          </div>
        </div>

        {/* Scene 6 */}
        <div className="cr-scene nth-6">
          <img src="/intro/card_6.png" alt="Card 6" />
          <div className="cr-text-box top-40">
            <h1 className="text-[80px] font-bold tracking-widest text-[#fdf5e6] mb-8 font-serif" style={{ fontFamily: '"Georgia", serif' }}>DharmaYatra 101</h1>
            <h2 className="text-[55px] font-medium text-[#f5deb3] font-serif" style={{ fontFamily: '"Georgia", serif' }}>Brings the meaning back.</h2>
          </div>
        </div>

        {/* Scene 7 */}
        <div className="cr-scene nth-7">
          <img src="/intro/card_7.png" alt="Card 7" />
          <div className="cr-text-box top-40 !opacity-0 !translate-y-0 final-text-in">
            <h1 className="text-[80px] font-bold tracking-widest text-[#fdf5e6] mb-12 font-serif" style={{ fontFamily: '"Georgia", serif' }}>Play. Reflect. Repeat.</h1>
            <h2 className="text-[40px] font-medium text-[#f5deb3] mt-8 font-serif" style={{ fontFamily: '"Georgia", serif' }}>DharmaYatra 101 — Rooted in heritage.</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicIntro;
