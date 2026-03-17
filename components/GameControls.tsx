import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../App';
import { FaUserAlt } from 'react-icons/fa';
import DiceRoller, { DiceRollerRef } from './DiceRoller';

interface GameControlsProps {
  onRollDice: (rolledValue: number) => void;
  diceValue: number | null;
  isGameOver: boolean;
  isAnimating: boolean;
  currentPlayerName?: string;
  currentPlayerProfilePic?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onRollDice,
  diceValue,
  isGameOver,
  isAnimating,
  currentPlayerName,
  currentPlayerProfilePic,
}) => {
  const { translate } = useLanguage();
  const diceRollerRef = useRef<DiceRollerRef>(null);

  const diceRollText = diceValue !== null ? translate('dice_rolled', { diceValue }) : '';

  const handleRollButtonClick = () => {
    if (isGameOver || isAnimating) return; // Disable if game over OR animating
    diceRollerRef.current?.triggerRoll();
  };

  const handleDiceRollComplete = (rolledValue: number) => {
    if (isAnimating) return; // Prevent new roll if an animation sequence is still finalizing
    onRollDice(rolledValue);
  };

  // Keyboard Shortcut: Spacebar to Roll
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isGameOver && !isAnimating) {
        event.preventDefault(); // Prevent scrolling
        handleRollButtonClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameOver, isAnimating]);

  return (
    <div className="space-y-2">
      {currentPlayerName && !isGameOver && (
        <div className="text-center mb-1 flex justify-center items-center gap-2">
          {currentPlayerProfilePic ? (
            <img src={currentPlayerProfilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-orange-300 shadow-sm" />
          ) : (
            <div className="bg-orange-100 rounded-full p-1.5 px-2.5">
              <FaUserAlt className="text-orange-600 text-sm" />
            </div>
          )}
          <p className="text-md font-semibold text-orange-700">
            {translate('current_player_turn', { playerName: currentPlayerName })}
          </p>
        </div>
      )}
      <div className="flex flex-col items-center space-y-1">
        {/* Compact height container for dice */}
        <div
          className="flex items-center justify-center p-4 min-h-[140px]"
          aria-live="polite"
        >
          <DiceRoller
            ref={diceRollerRef}
            onRollComplete={handleDiceRollComplete}
            initialValue={diceValue}
            disabled={isGameOver || isAnimating} // Disable dice roller too
          />
        </div>
        {diceRollText && (
          <p className="text-center text-xs text-stone-600 h-4 font-bold animate-pulse">
            {diceRollText}
          </p>
        )}
        <button
          onClick={handleRollButtonClick}
          disabled={isGameOver || isAnimating} // Disable based on game over or animation
          className={`dice-btn w-full py-2 px-4 font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${!diceRollText ? 'mt-2' : 'mt-0'}`}
          aria-disabled={isGameOver || isAnimating}
          title="Press Space to Roll"
        >
          {translate('roll_dice')}
        </button>
      </div>
    </div>
  );
};

export default GameControls;
