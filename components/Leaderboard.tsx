import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useLanguage } from '../App'; // Assuming App.tsx exports useLanguage

interface LeaderboardEntryData {
  wins: number;
  lastWinAt?: number; // Optional, useful for tie-breaking or display
}

interface LeaderboardEntry {
  nickname: string;
  wins: number;
}

const Leaderboard: React.FC = () => {
  const { translate } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase DB not initialized. Leaderboard will not function.");
      setIsLoading(false);
      return;
    }

    const lbRef = ref(db, 'leaderboard');
    const unsubscribe = onValue(lbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries: LeaderboardEntry[] = Object.entries(data)
          .map(([nickname, value]) => {
            const entryData = value as LeaderboardEntryData;
            return {
              nickname: nickname.replace(/_/g, '.'), // Revert sanitization for display
              wins: entryData.wins || 0,
            };
          })
          .filter(entry => entry.wins > 0); // Only show players with wins

        // Sort by wins (descending), then by nickname (ascending) for tie-breaking
        const sorted = entries.sort((a, b) => {
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          }
          return a.nickname.localeCompare(b.nickname);
        });
        setLeaderboard(sorted);
      } else {
        setLeaderboard([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firebase: Error listening to leaderboard:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-4 p-3 bg-white/50 backdrop-blur-sm rounded-lg shadow-md border border-orange-200 text-center">
        <p className="text-stone-600 animate-pulse">{translate('loading_text', { item: translate('leaderboard_title') })}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white/50 backdrop-blur-sm p-3 rounded-lg shadow-md border border-orange-200">
      <h3 className="text-lg font-semibold text-orange-700 mb-3 text-center">
        {translate('leaderboard_title')}
      </h3>
      {leaderboard.length === 0 ? (
        <p className="text-center text-sm text-stone-500 italic">{translate('leaderboard_empty')}</p>
      ) : (
        <ul className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100 pr-1">
          {leaderboard.map((player, index) => (
            <li 
              key={player.nickname} 
              className="flex justify-between items-center text-xs p-1.5 bg-amber-50/70 rounded even:bg-orange-50/70"
            >
              <span className="font-medium text-stone-700">
                <span className="inline-block w-5 text-center mr-1">{index + 1}.</span>
                {player.nickname}
              </span>
              <span className="text-orange-600 font-semibold">
                {translate('leaderboard_wins_format', { count: player.wins })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;