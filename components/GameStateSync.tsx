import React, { useEffect } from 'react';
import { ref, onValue, Unsubscribe } from 'firebase/database';
import { db } from '../firebase'; // Ensure this path is correct

interface PlayerData {
  position: number;
  updatedAt: number;
  // Add other fields if they are synced, e.g., name, color, etc.
  // For now, focusing on position as per typical game sync needs.
}

interface AllPlayersData {
  [playerId: string]: PlayerData;
}

interface GameStateSyncProps {
  onUpdate: (playersData: AllPlayersData) => void;
}

const GameStateSync: React.FC<GameStateSyncProps> = ({ onUpdate }) => {
  useEffect(() => {
    if (!db) {
      console.warn("Firebase DB not initialized. GameStateSync will not function.");
      return;
    }

    const gamePlayersRef = ref(db, 'game/players');
    const unsubscribe: Unsubscribe = onValue(gamePlayersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        onUpdate(data as AllPlayersData);
      } else {
        // Handle case where 'game/players' might be empty or null
        onUpdate({}); // Send empty object if no player data
      }
    }, (error) => {
      console.error("Firebase: Error listening to game state:", error);
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [onUpdate]); // Re-subscribe if onUpdate callback changes, though typically it shouldn't for this use case.

  return null; // This component does not render anything
};

export default GameStateSync;