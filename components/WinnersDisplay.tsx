import React from 'react';
import { Player } from '../types';
import { useLanguage } from '../App';
import AnimalIcon from './AnimalIcon';

interface WinnersDisplayProps {
  winners: Player[];
}

const WinnersDisplay: React.FC<WinnersDisplayProps> = ({ winners }) => {
  const { translate } = useLanguage();

  if (winners.length === 0) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-blue-700">{translate('no_winners_yet')}</p>
      </div>
    );
  }

  // Sort by rank, then by dice throws as a secondary measure if ranks are ever null/tied unexpectedly
  const sortedWinners = [...winners].sort((a, b) => {
     const rankA = a.finishRank ?? Infinity;
     const rankB = b.finishRank ?? Infinity;
     if (rankA !== rankB) return rankA - rankB;
     return a.diceThrows - b.diceThrows;
  });


  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-orange-700 mb-3 text-center">{translate('winners_table_title')}</h3>
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow border border-orange-200">
        <table className="w-full text-sm text-left text-stone-600">
          <thead className="text-xs text-orange-700 uppercase bg-orange-50">
            <tr>
              <th scope="col" className="px-3 py-2">{translate('rank_header')}</th>
              <th scope="col" className="px-3 py-2">{translate('player_header')}</th>
              <th scope="col" className="px-3 py-2 text-center">{translate('throws_header')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedWinners.map((player, index) => (
              <tr key={player.id} className={`${player.color.tailwindClass.replace('bg-', 'bg-opacity-10 ')} border-b border-orange-100 last:border-b-0`}>
                <td className="px-3 py-2 font-medium text-stone-800">{player.finishRank || index + 1}</td>
                <td className="px-3 py-2 flex items-center">
                  <div className={`w-4 h-4 rounded-full ${player.color.tailwindClass} mr-2 flex items-center justify-center border ${player.color.tailwindBorderClass}`}>
                     <AnimalIcon iconKey={player.animalIcon.iconKey} className="w-2.5 h-2.5 text-white" />
                  </div>
                  {player.name}
                </td>
                <td className="px-3 py-2 text-center">{player.diceThrows}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WinnersDisplay;
