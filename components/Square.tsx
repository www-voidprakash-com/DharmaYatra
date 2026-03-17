
import React, { useState } from 'react';
import { SquareData, SquareType } from '../types';
import { useLanguage } from '../App';
import { FaStar } from 'react-icons/fa';
import { GiSprout, GiLotus } from 'react-icons/gi';

interface SquareProps {
  data: SquareData;
  activeEffect?: 'snake' | 'ladder' | null;
}

const Square: React.FC<SquareProps> = ({ data, activeEffect }) => {
  const { translate } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  // --- Elemental Themes based on Height (Ascension) ---
  // 1-20: Earth (Prithvi) - Grounded, soil, nature.
  // 21-40: Water (Jala) - Fluid, rivers, ocean.
  // 41-60: Fire (Agni) - Energy, transformation, heat.
  // 61-80: Air (Vayu) - Movement, sky, clouds.
  // 81-100: Ether (Akasha) - Space, cosmos, transcendence.

  let bgClass = '';
  let textClass = 'font-serif opacity-80';
  let borderClass = 'border-black/5';
  let shadowClass = '';

  const id = data.id;
  const isAlt = id % 2 === 0;

  if (id <= 20) { // EARTH ZONE
    bgClass = isAlt ? 'bg-[#d7ccc8]' : 'bg-[#efebe9]'; // Brown-100 / Brown-50
    textClass = 'text-[#3e2723]'; // Dark Brown
    borderClass = 'border-[#8d6e63]/20';
  } else if (id <= 40) { // WATER ZONE
    bgClass = isAlt ? 'bg-[#b3e5fc]' : 'bg-[#e1f5fe]'; // Light Blue
    textClass = 'text-[#01579b]'; // Dark Blue
    borderClass = 'border-[#29b6f6]/20';
  } else if (id <= 60) { // FIRE ZONE
    bgClass = isAlt ? 'bg-[#ffccbc]' : 'bg-[#fbe9e7]'; // Deep Orange
    textClass = 'text-[#bf360c]'; // Dark Orange
    borderClass = 'border-[#ff7043]/20';
  } else if (id <= 80) { // AIR ZONE
    bgClass = isAlt ? 'bg-[#cfd8dc]' : 'bg-[#eceff1]'; // Blue Grey
    textClass = 'text-[#37474f]'; // Dark Blue Grey
    borderClass = 'border-[#90a4ae]/20';
  } else { // ETHER ZONE (Darker for Cosmos feel)
    bgClass = isAlt ? 'bg-[#d1c4e9]' : 'bg-[#ede7f6]'; // Deep Purple
    textClass = 'text-[#311b92]'; // Dark Purple
    borderClass = 'border-[#7e57c2]/20';
  }

  // Special Squares Overrides
  let specialIcon: React.ReactNode = null;
  let tooltipText = '';
  let squareName = '';

  switch (data.type) {
    case SquareType.Janma: // Start
      bgClass = 'bg-gradient-to-br from-emerald-200 to-emerald-400 ring-inset ring-2 ring-emerald-500';
      textClass = 'text-emerald-900 font-bold';
      specialIcon = <GiSprout className="text-emerald-800 text-xl drop-shadow-sm animate-pulse" />;
      squareName = translate(data.specialTextKey || 'janma_label');
      tooltipText = squareName;
      break;
    case SquareType.Poorna: // End
      bgClass = 'bg-gradient-to-br from-violet-300 to-fuchsia-400 ring-inset ring-2 ring-fuchsia-600';
      textClass = 'text-indigo-900 font-bold';
      specialIcon = <div className="relative"><GiLotus className="text-fuchsia-900 text-2xl drop-shadow-sm spin-slow" /><FaStar className="absolute -top-1 -right-1 text-yellow-300 text-xs animate-ping" /></div>;
      squareName = translate(data.specialTextKey || 'poorna_label');
      tooltipText = squareName;
      break;
    case SquareType.SnakeHead:
      // Subtle darkening/tint for danger spots
      shadowClass = 'inset-shadow-red';
      if (data.snakeLadderInfo) {
        squareName = translate(data.snakeLadderInfo.key, { playerName: 'Traveler', playerColorName: 'Spirit', playerAnimalName: 'Avatar' });
        tooltipText = translate('square_info_title', { id: data.id, name: squareName }) + ` (${translate('text_snake_description_prefix')} ${data.snakeLadderInfo.to})`;
      }
      break;
    case SquareType.LadderBottom:
      // Subtle lightening/tint for opportunity spots
      shadowClass = 'inset-shadow-gold';
      if (data.snakeLadderInfo) {
        squareName = translate(data.snakeLadderInfo.key, { playerName: 'Traveler', playerColorName: 'Spirit', playerAnimalName: 'Avatar' });
        tooltipText = translate('square_info_title', { id: data.id, name: squareName }) + ` (${translate('text_ladder_description_prefix')} ${data.snakeLadderInfo.to})`;
      }
      break;
    default:
      if (data.specialTextKey) {
        squareName = translate(data.specialTextKey);
        tooltipText = translate('square_info_title', { id: data.id, name: squareName });
      }
      break;
  }

  if (data.id === 1 && data.specialTextKey) tooltipText = translate(data.specialTextKey);
  if (data.id === 100 && data.specialTextKey) tooltipText = translate(data.specialTextKey);

  // Active Animation Effects
  let effectClass = '';
  if (activeEffect === 'snake') {
    effectClass = 'effect-snake ring-4 ring-red-500 z-30';
  } else if (activeEffect === 'ladder') {
    effectClass = 'effect-ladder ring-4 ring-yellow-400 z-30';
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center border ${borderClass} ${bgClass} ${shadowClass} ${effectClass} transition-all duration-300 aspect-square p-0.5 group hover:z-[60] hover:scale-110 hover:shadow-2xl hover:border-orange-300`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={tooltipText || `Square ${data.id}`}
    >
      {/* Corner Number */}
      <span className={`absolute top-0.5 left-1 ${textClass} font-bold text-[0.6rem] sm:text-[0.7rem] leading-none`}>{data.id}</span>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        {specialIcon ? (
          <div className="z-10 transform transition-transform group-hover:scale-110">{specialIcon}</div>
        ) : (
          squareName && (
            <div className="w-full text-center px-0.5 mt-2">
              <span className="text-[0.45rem] sm:text-[0.55rem] text-stone-600 font-bold uppercase tracking-tight leading-[0.8] block break-words opacity-90">
                {squareName.length > 15 ? squareName.substring(0, 12) + '..' : squareName}
              </span>
            </div>
          )
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 px-3 py-2 bg-[#2d1b0e] text-[#fef3c7] text-xs rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#d4af37] z-[70] backdrop-blur-sm pointer-events-none animate-fade-in-up font-serif
            ${data.id > 80 ? 'top-full mt-2' : 'bottom-full mb-2'}
            whitespace-normal max-w-[150px] break-words text-center leading-tight
          `}
          role="tooltip"
        >
          {tooltipText}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent 
              ${data.id > 80 ? 'bottom-full border-b-[#2d1b0e]' : 'top-full border-t-[#2d1b0e]'}
            `}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Square;
