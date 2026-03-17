import React from 'react';
import { useLanguage } from '../App';

interface GameMessageProps {
  gameMessageKey: string;
  replacements?: Record<string, string | number | undefined>;
}

const GameMessage: React.FC<GameMessageProps> = ({ gameMessageKey, replacements }) => {
  const { translate } = useLanguage();
  const message = translate(gameMessageKey, replacements);

  return (
    <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg shadow text-center min-h-[60px] flex items-center justify-center" aria-live="polite" aria-atomic="true">
      <p className="text-md text-stone-700">{message}</p>
    </div>
  );
};

export default GameMessage;
