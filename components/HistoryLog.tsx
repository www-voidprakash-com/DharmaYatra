import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../App';

interface HistoryItem {
  id: string;
  text: string;
}

interface HistoryLogProps {
  titleKey: string;
  items: HistoryItem[];
  emptyLogMessageKey: string;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ titleKey, items, emptyLogMessageKey }) => {
  const { translate } = useLanguage();
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg shadow-md border border-orange-200">
      <h3 className="text-md font-semibold text-orange-600 mb-2 text-center">{translate(titleKey)}</h3>
      <div
        ref={scrollableDivRef}
        className="max-h-32 overflow-y-auto space-y-1 text-xs text-stone-600 pr-1 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100"
        aria-live="polite"
      >
        {items.length === 0 ? (
          <p className="text-center italic text-stone-500">{translate(emptyLogMessageKey)}</p>
        ) : (
          items.map((item, index) => (
            <p key={item.id} className={`p-1 bg-amber-50/50 rounded-sm even:bg-orange-50/50 text-[0.7rem] leading-tight ${index === items.length - 1 ? 'font-bold text-orange-800 animate-pulse' : ''}`}>
              {item.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryLog;