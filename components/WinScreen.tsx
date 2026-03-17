
import React, { useState } from 'react';
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

  if (!winners || winners.length === 0) return null;

  const sortedWinners = [...winners].sort((a, b) => (a.finishRank || Infinity) - (b.finishRank || Infinity));

  let title = '';
  if (sortedWinners.length === allPlayers.length && allPlayers.length > 0) {
    title = translate('game_over_all_finished_title');
  } else if (sortedWinners.length > 0) {
    title = translate('game_over_player_wins_title', { winnerName: sortedWinners[0].name });
  } else {
    title = translate('game_over_title'); // Fallback generic title
  }

  return (
    <div className="win-screen-overlay">
      {/* CSS Confetti Effect */}
      <div className="confetti-container">
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div><div className="confetti"></div><div className="confetti"></div>
        <div className="confetti"></div>
      </div>

      <div className="win-screen-content win-screen scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100 relative z-10 flex flex-col max-h-[90vh]">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-6 drop-shadow-sm flex-shrink-0">🎉 {title} 🎉</h1>
        
        {summaryText && (
             <div className="mb-4 bg-gradient-to-r from-yellow-50 via-amber-100 to-yellow-50 p-4 rounded-lg border border-amber-300 shadow-inner relative overflow-hidden animate-glow flex-shrink-0">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <GiScrollQuill className="text-6xl text-amber-800" />
                </div>
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <span>📜</span> Sage's Verdict <span>📜</span>
                </h3>
                <p className="text-stone-800 italic font-medium leading-relaxed font-serif text-sm">
                    "{summaryText}"
                </p>
             </div>
        )}

        {/* Tab Toggle */}
        <div className="flex justify-center gap-2 mb-4 flex-shrink-0">
            <button
                onClick={() => setActiveTab('game')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    activeTab === 'game' 
                    ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
            >
                {translate('game_stats_button')}
            </button>
            <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    activeTab === 'global' 
                    ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
            >
                {translate('global_stats_button')}
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-[200px] mb-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100 pr-1">
            {activeTab === 'game' ? (
                <div>
                  <h2 className="text-xl font-semibold text-stone-700 mb-4 border-b border-orange-200 pb-2 inline-block px-4">{translate('final_rankings_title')}</h2>
                  <ul className="space-y-3">
                    {sortedWinners.map((player, index) => (
                      <li 
                        key={player.id} 
                        className={`p-3 rounded-lg flex flex-col sm:flex-row items-center sm:justify-between text-left shadow-sm ${player.color.tailwindClass.replace('bg-', 'bg-opacity-20 ')} border ${player.color.tailwindBorderClass} ${index === 0 ? 'winner-card-anim' : ''}`}
                      >
                        <div className="flex items-center mb-2 sm:mb-0">
                          <span className="text-xl font-bold mr-3 text-orange-500 w-6 text-center">{player.finishRank || index + 1}.</span>
                          <div className={`w-10 h-10 rounded-full ${player.color.tailwindClass} mr-3 flex items-center justify-center border-2 ${player.color.tailwindBorderClass} shadow`}>
                            <AnimalIcon iconKey={player.animalIcon.iconKey} className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-lg font-medium text-stone-800">{player.name}</span>
                        </div>
                        <span className="text-sm text-stone-600 sm:ml-4">
                          {translate('throws_header')}: <strong className="text-stone-700">{player.diceThrows}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
            ) : (
                <div className="h-full">
                    <Leaderboard />
                </div>
            )}
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full sm:w-auto mt-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg shadow-lg transition-all duration-150 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transform hover:-translate-y-0.5 flex-shrink-0"
        >
          {translate('game_over_start_again')}
        </button>
      </div>
    </div>
  );
};

export default WinScreen;
