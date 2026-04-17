import React, { useState, useMemo, useEffect } from 'react';
import { Player } from '../types';
import { useLanguage } from '../App';
import AnimalIcon from './AnimalIcon';
import { GiScrollQuill } from 'react-icons/gi';
import Leaderboard from './Leaderboard';

interface WinScreenProps {
  winners: Player[];
  allPlayers: Player[];
  onPlayAgain: () => void;
  summaryText?: string | null;
}

const WinScreen: React.FC<WinScreenProps> = ({ winners, allPlayers, onPlayAgain, summaryText }) => {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState<'game' | 'global'>('game');

  const [imageIndex, setImageIndex] = useState(0);
  const images = useMemo(() => ['/victory_1.png', '/victory_2.png', '/victory_3.png'], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Cycle every 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const victoryImage = images[imageIndex];

  // Fallback if winners is empty (to avoid blank screen)
  const sortedWinners = winners && winners.length > 0 
    ? [...winners].sort((a, b) => (a.finishRank || Infinity) - (b.finishRank || Infinity))
    : [];
  
  const mainWinner = sortedWinners[0];

  let title = '';
  if (sortedWinners.length === allPlayers.length && allPlayers.length > 0) {
    title = translate('game_over_all_finished_title');
  } else if (sortedWinners.length > 0) {
    title = translate('game_over_player_wins_title', { winnerName: mainWinner.name });
  } else {
    title = translate('game_over_title');
  }

  return (
    <div className="win-screen-overlay flex items-center justify-center p-4">
      {/* CSS Confetti Effect */}
      <div className="confetti-container pointer-events-none">
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div>
      </div>

      <div className="win-screen-content bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-orange-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

        {/* LEFT COLUMN: Visuals & Story */}
        <div className="md:w-1/2 p-6 flex flex-col bg-gradient-to-br from-amber-50 to-orange-100 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4 text-center drop-shadow-sm">
            {title}
          </h1>

          {/* AI Picture Area */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-amber-300 mb-6 group">
            {/* The 'AI Generated' Scene */}
            <img src={victoryImage} alt="Victory Scene" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />

            {/* Overlay Winner Peg */}
            {mainWinner && (
              <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-subtle`}>
                <div className={`w-20 h-20 rounded-full ${mainWinner.color.tailwindClass} flex items-center justify-center border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] overflow-hidden`}>
                  {mainWinner.profilePic ? (
                    <img src={mainWinner.profilePic} alt={mainWinner.name} className="w-full h-full object-cover" />
                  ) : (
                    <AnimalIcon iconKey={mainWinner.animalIcon.iconKey} className="w-12 h-12 text-white drop-shadow-md" />
                  )}
                </div>
                <div className="mt-2 bg-black/60 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-bold border border-white/20">
                  {mainWinner.name}
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded">
              🤖 AI Generated Scene
            </div>
          </div>

          {/* Sage Verdict (Story) */}
          {summaryText && (
            <div className="bg-white/60 p-4 rounded-xl border border-amber-200 shadow-sm relative">
              <div className="absolute -top-3 -left-2 text-2xl filter drop-shadow">📜</div>
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1 text-center">Karmic Chronicle</h3>
              <p className="text-stone-800 italic font-medium font-serif text-sm leading-relaxed text-center">
                "{summaryText}"
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Stats & Controls */}
        <div className="md:w-1/2 p-6 flex flex-col bg-white overflow-y-auto">

          {/* Tab Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeTab === 'game'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
            >
              {translate('game_stats_button')}
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeTab === 'global'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
            >
              {translate('global_stats_button')}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[200px]">
            {activeTab === 'game' ? (
              <div className="space-y-4">
                {sortedWinners.map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg flex items-center justify-between border ${index === 0 ? 'bg-amber-50 border-amber-200 shadow-md transform scale-102 ring-2 ring-amber-100' : 'bg-white border-stone-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-amber-600' : 'text-stone-400'}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <div className={`w-8 h-8 rounded-full ${player.color.tailwindClass} flex items-center justify-center text-white text-xs border border-white shadow-sm overflow-hidden`}>
                        {player.profilePic ? (
                          <img src={player.profilePic} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <AnimalIcon iconKey={player.animalIcon.iconKey} className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-stone-800 text-sm">{player.name}</div>
                        <div className="text-xs text-stone-500">{translate('throws_header')}: {player.diceThrows}</div>
                      </div>
                    </div>
                    {index === 0 && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Winner</span>}
                  </div>
                ))}
              </div>
            ) : (
              <Leaderboard />
            )}
          </div>

          <button
            onClick={onPlayAgain}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>🔄</span> {translate('game_over_start_again')}
          </button>

        </div>
      </div>
    </div>
  );
};

export default WinScreen;
