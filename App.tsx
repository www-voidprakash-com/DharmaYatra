
import React, { useState, useCallback, useMemo, createContext, useContext, useEffect, useRef } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useSageCommentary, getVoicePersona } from './hooks/useSageCommentary';
import { resizeImage } from './utils/imageUtils';
import { Language, SquareData, SquareType, Player, GameStage, LanguageOption, MessageHistoryEntry, TurnHistoryEntry } from './types';
import { BOARD_SIZE, PLAYER_INITIAL_POSITION, PLAYER_BOARD_START_POSITION, SNAKES_LADDERS_MAP, TRANSLATIONS, AVAILABLE_LANGUAGES, AVAILABLE_COLORS, AVAILABLE_ANIMAL_ICONS, AVAILABLE_VOICES } from './constants';
import Board from './components/Board';
import GameControls from './components/GameControls';
import GameSettingsPanel from './components/GameSettingsPanel';
import GameMessage from './components/GameMessage';
import PlayerSetup from './components/PlayerSetup';
import CinematicIntro from './components/CinematicIntro';
import VideoIntro from './components/VideoIntro';
import WinScreen from './components/WinScreen';
import WinPopup from './components/WinPopup';
import HistoryLog from './components/HistoryLog';
import NicknameInput from './components/NicknameInput';
import GameStateSync from './components/GameStateSync';
import Leaderboard from './components/Leaderboard';
import FlashMessage from './components/FlashMessage';
import SageCommentary from './components/SageCommentary';
import LegalFooter from './components/LegalFooter';
import { Howl, Howler } from 'howler';
import { db, functions } from './firebase';
import { ref, set, get, update } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { FaRedo } from 'react-icons/fa';
import './components/GameBoard.css';

// Sound Effects
const diceSound = new Howl({ src: ['/sounds/dice.mp3'], volume: 0.6 });
const winSound = new Howl({ src: ['/sounds/win.mp3'], volume: 0.5 });
const snakeSound = new Howl({ src: ['/sounds/snake.mp3'], volume: 0.5 });
const ladderSound = new Howl({ src: ['/sounds/ladder.mp3'], volume: 0.5 });


interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, replacements?: Record<string, string | number | undefined>) => string;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const TURN_ADVANCE_DELAY = 3500; // Default base delay
const HOP_DURATION = 200; // ms for each square hop
const SL_ANIMATION_DURATION = 400; // ms for snake/ladder slide visual
const MAX_HISTORY_ITEMS = 50; // Optimization: Limit log size

interface FirebasePlayerUpdateData {
  position: number;
  updatedAt: number;
}

interface AllFirebasePlayersData {
  [playerId: string]: FirebasePlayerUpdateData;
}

interface AnimationState {
  playerId: number;
  path: number[]; // Squares to hop to during dice roll
  currentIndex: number; // Index in path
  sLTarget?: number; // If a snake/ladder is hit at the end of path
  finalLandingPos: number; // Ultimate landing square after all effects
  isProcessingPostSL: boolean; // Flag: true if dice hops done, now processing S/L jump
  diceRolled: number;
  originalStartPos: number; // Player's position at the start of the turn
  isStartingMove: boolean; // Was this the move to get on the board?
}

// --- Audio Helper Functions moved to useAudioEngine ---

// getVoicePersona removed (imported from hook)

import { initializeAdMob, showInterstitial } from './services/admobService';

const App = (): React.ReactElement => {
  const { isMuted, toggleMute, initAudioContext, playAudio, stopAudio } = useAudioEngine();
  const [language, setLanguageState] = useState<Language>(Language.English);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(() => !sessionStorage.getItem('dy_intro_seen'));

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    sessionStorage.setItem('dy_intro_seen', 'true');
  }, []);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null); // For display only
  const [gameMessageKey, setGameMessageKey] = useState<string>('msg_welcome');
  const [messageReplacements, setMessageReplacements] = useState<Record<string, string | number | undefined> | undefined>(undefined);
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.Setup);
  const [winners, setWinners] = useState<Player[]>([]);
  const [showWinPopup, setShowWinPopup] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<MessageHistoryEntry[]>([]);
  const [turnHistory, setTurnHistory] = useState<TurnHistoryEntry[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [activeSpecialSquare, setActiveSpecialSquare] = useState<{ id: number; type: 'snake' | 'ladder' } | null>(null);
  const [gameMode, setGameMode] = useState<'multiplayer' | 'practice'>('multiplayer');
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [customBackground, setCustomBackground] = useState<string | null>('assets/bg-poster.png');

  useEffect(() => {
    initializeAdMob();
  }, []);

  // Sage AI State & Hook
  const [sageVoice, setSageVoice] = useState<string>('Fenrir');
  const [flashMessageText, setFlashMessageText] = useState<string | null>(null);
  const [userApiKey, setUserApiKey] = useState<string | null>(() => localStorage.getItem('dharmayatra_custom_api_key'));

  const handleApiKeyChange = (key: string | null) => {
    setUserApiKey(key);
    if (key) {
      localStorage.setItem('dharmayatra_custom_api_key', key);
    } else {
      localStorage.removeItem('dharmayatra_custom_api_key');
    }
  };


  // Phase 1: Room ID State Persistence
  const [roomId, setRoomId] = useState<string>(() => {
    const stored = localStorage.getItem('dharmayatra_room_id');
    if (stored) return stored;
    // Generate new random room ID if none exists
    const newRoomId = 'room_' + Math.random().toString(36).substr(2, 9);
    return newRoomId;
  });

  useEffect(() => {
    localStorage.setItem('dharmayatra_room_id', roomId);
  }, [roomId]);





  // Audio refs removed (using useAudioEngine)
  // Watch history for Flash Messages
  useEffect(() => {
    if (messageHistory.length > 0) {
      const lastMsg = messageHistory[messageHistory.length - 1];
      // Only flash if it's a new operational message, maybe filter duplicates if needed
      setFlashMessageText(lastMsg.text);
    }
  }, [messageHistory]);
  // Cache & Refs
  const isFinalizingMoveRef = useRef<boolean>(false); // Prevent double-execution of turn logic

  // Refs for auto-play logic
  const handleRollDiceRef = useRef<(val: number) => void>(() => { });

  useEffect(() => {
    const savedNickname = localStorage.getItem('dharmayatra_nickname');
    if (savedNickname) {
      setUserNickname(savedNickname);
    }
  }, []);

  useEffect(() => {
    const currentLangConfig = AVAILABLE_LANGUAGES.find(l => l.code === language);

    AVAILABLE_LANGUAGES.forEach(langOption => {
      if (langOption.fontClass && document.body.classList.contains(langOption.fontClass)) {
        document.body.classList.remove(langOption.fontClass);
      }
    });
    if (document.body.classList.contains('font-noto-sans')) {
      document.body.classList.remove('font-noto-sans');
    }

    if (currentLangConfig && currentLangConfig.fontClass) {
      document.body.classList.add(currentLangConfig.fontClass);
    } else {
      document.body.classList.add('font-noto-sans');
    }
  }, [language]);


  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);


  const translate = useCallback((key: string, replacements?: Record<string, string | number | undefined>): string => {
    let translation = TRANSLATIONS[language][key] || TRANSLATIONS[Language.English][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const replacementValue = replacements[placeholder];
        translation = translation.replace(new RegExp(`{${placeholder}}`, 'g'), replacementValue !== undefined ? String(replacementValue) : '');
      });
    }
    return translation;
  }, [language]);

  const {
    sageWisdom,
    setSageWisdom,
    isSageThinking,
    isSageSpeaking,
    aiQuotaExceeded,
    setAiQuotaExceeded,
    stopSageAudio,
    replaySageAudio,
    generateAndPlayCosmicSpeech,
    generateAICommentary,
    generateGameSummary,
    resetSummaryGen
  } = useSageCommentary({
    language,
    translate,
    sageVoice,
    playAudio,
    stopAudio,
    customApiKey: userApiKey
  });

  const addMessageToHistory = useCallback((text: string) => {
    setMessageHistory(prev => {
      // Optimization: Deduplicate if same message added within 500ms (debounce)
      if (prev.length > 0) {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.text === text && (Date.now() - lastMsg.timestamp < 1000)) {
          return prev;
        }
      }
      const newItem = { id: Date.now().toString() + Math.random(), text, timestamp: Date.now() };
      // Limit history size
      const newHistory = [...prev, newItem];
      if (newHistory.length > MAX_HISTORY_ITEMS) return newHistory.slice(-MAX_HISTORY_ITEMS);
      return newHistory;
    });
  }, []);

  const addTurnToHistory = useCallback((turnData: Omit<TurnHistoryEntry, 'id' | 'timestamp'>) => {
    setTurnHistory(prev => {
      const newItem = { ...turnData, id: Date.now().toString() + Math.random(), timestamp: Date.now() };
      const newHistory = [...prev, newItem];
      if (newHistory.length > MAX_HISTORY_ITEMS) return newHistory.slice(-MAX_HISTORY_ITEMS);
      return newHistory;
    });
  }, []);

  // Log Sage wisdom to game log whenever it is updated
  useEffect(() => {
    if (sageWisdom && gameStage === GameStage.Playing) {
      const wisdomMsg = translate('msg_sage_wisdom_log', { wisdom: sageWisdom });
      addMessageToHistory(wisdomMsg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sageWisdom]);

  const handleBackgroundUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file, 1280, 720, 0.7);
        setCustomBackground(resized);
      } catch (err) {
        console.error("Image resize failed", err);
      }
    }
  }, []);

  const handleBackgroundClear = useCallback(() => {
    setCustomBackground(null);
  }, []);

  // Phase 1: Reset Nickname defined below


  // Phase 1: Reset Nickname (and clear game state derived from it)
  // Moved here to access setRoomId and other state refs if needed
  const handleResetNickname = useCallback(() => {
    localStorage.removeItem('dharmayatra_nickname');
    setUserNickname(null);
    setGameStage(GameStage.Setup);
    setRoomId('public-room'); // Reset room ID on nickname reset to default
  }, []);

  // Phase 1: Sage Controls
  // Moved here because it depends on stopSageAudio
  const dismissSageMessage = useCallback(() => {
    stopSageAudio();
    setSageWisdom(null);
    // isSageThinking handled in hook or ignored on dismiss
    // lastAudioBase64Ref handled in hook
  }, [stopSageAudio, setSageWisdom]);

  // Stop audio whenever the voice changes to prevent persona mismatch
  useEffect(() => {
    stopSageAudio();
  }, [sageVoice, stopSageAudio]);







  useEffect(() => {
    if (gameStage === GameStage.Setup && userNickname) {
      const welcomeMsg = translate('msg_welcome');
      addMessageToHistory(welcomeMsg);
      // Optional: Play welcome speech. Might be annoying on every setup load, maybe restriction needed?
      // User requested "flash messages converting to sound".
      // generateAndPlayCosmicSpeech(welcomeMsg); 
      // Commented out to prevent auto-play spam on refresh/re-render, but enabling per user intent?
      // Let's enable it but maybe check if we just started?
      // For now, let's leave it manual or for the user to trigger via replay, OR enable it.
      // User request is strong. Let's enable it with a small debounce/check?
      // Actually, useEffect runs once on mount/stage change.
      generateAndPlayCosmicSpeech(welcomeMsg);
    }
    // Reset the summary flag when setup starts
    if (gameStage === GameStage.Setup) {
      resetSummaryGen();
    }
  }, [gameStage, userNickname, translate, addMessageToHistory, resetSummaryGen]);

  const boardSquares = useMemo((): SquareData[] => {
    return Array.from({ length: BOARD_SIZE }, (_, i) => {
      const id = i + 1;
      let type = SquareType.Normal;
      let specialTextKey: string | undefined;
      if (id === PLAYER_BOARD_START_POSITION) type = SquareType.Janma;
      if (id === BOARD_SIZE) type = SquareType.Poorna;

      const snakeLadderInfo = SNAKES_LADDERS_MAP[id];
      if (snakeLadderInfo) {
        type = snakeLadderInfo.type === 'snake' ? SquareType.SnakeHead : SquareType.LadderBottom;
      }

      if (id === PLAYER_BOARD_START_POSITION) specialTextKey = 'janma_label';
      if (id === BOARD_SIZE) specialTextKey = 'poorna_label';

      return { id, type, specialTextKey, snakeLadderInfo };
    });
  }, []);

  const updatePlayerPositionInDB = useCallback((playerId: number, position: number) => {
    if (gameMode === 'practice') return; // Skip DB updates in practice
    if (!db) return;

    // Phase 1: Scoped to Room
    const gamePlayerRef = ref(db, `rooms/${roomId}/players/${playerId}`);

    update(gamePlayerRef, {
      position: position,
      updatedAt: Date.now()
    }).catch(error => {
      console.error("Firebase: Failed to update player position:", error);
    });
  }, [gameMode, db, roomId]);

  const updateGameResultInDB = useCallback(async (winnerName: string, allPlayers: Player[]) => {
    if (gameMode === 'practice') return; // Skip DB updates in practice

    // AdMob Trigger
    showInterstitial();

    if (!db) return;

    const updates: any = {};
    const timestamp = Date.now();

    // Update Winner
    const sanitizedWinnerName = winnerName.replace(/[.#$[\]]/g, '_');
    const winnerRef = ref(db, `leaderboard/${sanitizedWinnerName}`);
    try {
      const snapshot = await get(winnerRef);
      let currentWins = 0;
      let currentStreak = 0;
      if (snapshot.exists()) {
        const data = snapshot.val();
        currentWins = data.wins || 0;
        currentStreak = data.streak || 0;
      }
      updates[`leaderboard/${sanitizedWinnerName}`] = {
        wins: currentWins + 1,
        streak: currentStreak + 1,
        lastWinAt: timestamp
      };
    } catch (err) {
      console.error(`Firebase: Failed to fetch winner stats for ${winnerName}:`, err);
    }

    // Reset Streaks for Losers
    for (const player of allPlayers) {
      if (player.name !== winnerName) {
        const sanitizedLoserName = player.name.replace(/[.#$[\]]/g, '_');
        const loserRef = ref(db, `leaderboard/${sanitizedLoserName}`);
        try {
          const snapshot = await get(loserRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            updates[`leaderboard/${sanitizedLoserName}`] = {
              ...data,
              streak: 0
            };
          }
        } catch (err) { }
      }
    }

    try {
      await update(ref(db), updates);
    } catch (err) {
      console.error("Firebase: Failed to perform bulk update for game results:", err);
    }

  }, [gameMode, showInterstitial, db]);

  const handleRemoteGameStateUpdate = useCallback((remotePlayersData: AllFirebasePlayersData) => {
    if (gameMode === 'practice') return; // Do not listen to remote in practice
    setPlayers(prevPlayers => {
      let hasChanged = false;
      const updatedPlayers = prevPlayers.map(localPlayer => {
        if (animationState && localPlayer.id === animationState.playerId) return localPlayer;

        const remotePlayerData = remotePlayersData[localPlayer.id.toString()];
        if (remotePlayerData && localPlayer.position !== remotePlayerData.position) {
          hasChanged = true;
          return { ...localPlayer, position: remotePlayerData.position };
        }
        return localPlayer;
      });
      return hasChanged ? updatedPlayers : prevPlayers;
    });
  }, [animationState, setPlayers, gameMode]);


  const resetGame = useCallback(() => {
    setAnimationState(null);
    setActiveSpecialSquare(null);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setGameMessageKey(userNickname ? 'msg_welcome' : '');
    setMessageReplacements(undefined);
    setGameStage(GameStage.Setup);
    setWinners([]);
    setMessageHistory([]);
    setTurnHistory([]);
    setSageWisdom(null);
    setIsProcessingTurn(false);
    stopSageAudio();
    resetSummaryGen();
    setAiQuotaExceeded(false);
    if (userNickname) {
      addMessageToHistory(translate('msg_welcome'));
    }
  }, [userNickname, translate, addMessageToHistory, setGameStage, stopSageAudio]);


  const startGame = useCallback(async (configuredPlayersSetup: Player[]) => {
    initAudioContext(); // Initialize audio context on game start button click

    // Check mode based on players
    const isPractice = configuredPlayersSetup.some(p => p.isComputer);
    setGameMode(isPractice ? 'practice' : 'multiplayer');

    let initialPlayers = configuredPlayersSetup;

    if (!isPractice) {
      // Fetch streak data from Firebase for all players only if multiplayer
      const playersWithStreaks = await Promise.all(configuredPlayersSetup.map(async (p) => {
        if (!db) return { ...p, consecutiveWins: 0 };
        const sanitizedName = p.name.replace(/[.#$[\]]/g, '_');
        try {
          const snapshot = await get(ref(db, `leaderboard/${sanitizedName}`));
          const val = snapshot.val();
          return { ...p, consecutiveWins: val?.streak || 0 };
        } catch (e) {
          return { ...p, consecutiveWins: 0 };
        }
      }));
      initialPlayers = playersWithStreaks;
    }

    initialPlayers = initialPlayers.map(p => {
      // Handle custom starting position logic
      const startPos = p.startingSquare || PLAYER_INITIAL_POSITION;
      const isStarted = (p.startingSquare || 0) > 0;

      return {
        ...p,
        position: startPos,
        hasStarted: isStarted,
        diceThrows: 0,
        hasFinished: false,
        finishRank: null,
      };
    });
    setPlayers(initialPlayers);
    setIsProcessingTurn(false);

    // Initial sync write - bypassing callback dependency state lag issue by inline logic
    if (!isPractice && db) {
      initialPlayers.forEach(player => {
        // Sync initial state if needed
        // Phase 1: Scoped to Room
        const playerRef = ref(db, `rooms/${roomId}/players/${player.id}`);
        set(playerRef, {
          position: player.position,
          updatedAt: Date.now()
        }).catch(e => console.error("Firebase set failed:", e));
      });
    }

    setCurrentPlayerIndex(0);
    setDiceValue(null);
    setGameStage(GameStage.VideoIntro);
    const firstPlayer = initialPlayers[0];
    const startMsgKey = 'msg_game_started';
    const startMsgReplacements = { firstPlayerName: firstPlayer.name };
    setGameMessageKey(startMsgKey);
    setMessageReplacements(startMsgReplacements);
    addMessageToHistory(translate(startMsgKey, startMsgReplacements));

    // If first player is already started (e.g. veteran), log it
    initialPlayers.forEach(p => {
      if (p.hasStarted && p.position > 0) {
        addTurnToHistory({
          playerId: p.id,
          playerName: p.name,
          diceValue: 0,
          startPosition: 0,
          endPosition: p.position,
          actionKey: 'turn_action_started_veteran',
          actionDetails: `Start at ${p.position}`
        });
      }
    });

  }, [translate, addMessageToHistory, setPlayers, setCurrentPlayerIndex, setDiceValue, setGameStage, setGameMessageKey, setMessageReplacements, addTurnToHistory, db, roomId]);

  const restartWithSamePlayers = useCallback(() => {
    const cleanedPlayers = players.map(p => ({
      ...p,
      position: p.startingSquare || 0,
      hasStarted: (p.startingSquare || 0) > 0,
      diceThrows: 0,
      hasFinished: false,
      finishRank: null
    }));
    
    setAnimationState(null);
    setActiveSpecialSquare(null);
    setWinners([]);
    setMessageHistory([]);
    setTurnHistory([]);
    setSageWisdom(null);
    setIsProcessingTurn(false);
    stopSageAudio();
    resetSummaryGen();
    setAiQuotaExceeded(false);

    // Re-run start sequence
    startGame(cleanedPlayers);
  }, [players, startGame, stopSageAudio, resetSummaryGen]);

  const advanceToNextPlayer = useCallback(() => {
    setSageWisdom(null); // Clear wisdom on next turn
    stopSageAudio(); // Stop audio on turn change
    // lastAudioBase64Ref.current = null; // Clear cache for new turn - Handled/Ignored
    setCurrentPlayerIndex(prevIndex => {
      let nextIndex = (prevIndex + 1) % players.length;
      const startIndexLoopCheck = nextIndex;
      while (players[nextIndex]?.hasFinished) {
        nextIndex = (nextIndex + 1) % players.length;
        if (nextIndex === startIndexLoopCheck) {
          return prevIndex;
        }
      }
      return nextIndex;
    });
    // Critical: release the turn lock so the new player (human or bot) can act
    setIsProcessingTurn(false);
  }, [players, setCurrentPlayerIndex, stopSageAudio]);

  useEffect(() => {
    if (gameStage === GameStage.Playing && players.length > 0 && players[currentPlayerIndex] && !animationState) {
      const currentActivePlayer = players[currentPlayerIndex];

      // Computer Turn Logic
      // Added !isProcessingTurn check to prevent infinite loop of turn stealing
      if (currentActivePlayer.isComputer && !currentActivePlayer.hasFinished && !isProcessingTurn) {
        const timer = setTimeout(() => {
          const roll = Math.floor(Math.random() * 6) + 1;
          handleRollDiceRef.current(roll);
        }, 1000);
        return () => clearTimeout(timer);
      }

      if (!currentActivePlayer || currentActivePlayer.hasFinished) {
        // ... handled elsewhere
      } else {
        const turnMsgKey = currentActivePlayer.hasStarted ? 'current_player_turn' : 'msg_player_turn_prompt_start';
        const turnMsgReplacements = { playerName: currentActivePlayer.name };
        setGameMessageKey(turnMsgKey);
        setMessageReplacements(turnMsgReplacements);
      }
    }
  }, [currentPlayerIndex, players, gameStage, animationState, setGameMessageKey, setMessageReplacements, isProcessingTurn]);


  // Effect to handle Game Over state transition securely
  useEffect(() => {
    if (gameStage !== GameStage.Playing || players.length === 0) return;

    const activePlayers = players.filter(p => !p.hasFinished);
    const hasWinner = players.some(p => p.hasFinished);
    const isPracticeMode = gameMode === 'practice';

    // Check if game should end: either single player finished, or all multiplayer finished, or practice mode winner
    if (activePlayers.length === 0 || (isPracticeMode && hasWinner)) {
      setGameStage(GameStage.GameOver);

      // Trigger Summary
      const winner = players.find(p => p.finishRank === 1) || players[0];
      generateGameSummary(winner, players, turnHistory);
    }
  }, [players, gameStage, generateGameSummary, turnHistory]);


  const finalizeAndLogMove = useCallback((
    pId: number,
    finalPos: number,
    rolledDice: number,
    turnActualStartPos: number,
    landedOnDiceSquare: number,
    wasSL: boolean,
    wasStartingMove: boolean
  ) => {

    const playerIndex = players.findIndex(p => p.id === pId);
    if (playerIndex === -1) return;

    const updatedPlayersArray = [...players];
    const playerToUpdate = { ...updatedPlayersArray[playerIndex] };

    playerToUpdate.position = finalPos;
    playerToUpdate.diceThrows += 1;

    if (wasStartingMove && finalPos === PLAYER_BOARD_START_POSITION) {
      playerToUpdate.hasStarted = true;
    }

    updatePlayerPositionInDB(pId, finalPos);

    let localMessageKey = '';
    let localMessageReplacements: Record<string, string | number | undefined> = {
      playerName: playerToUpdate.name,
      diceValue: rolledDice,
      position: landedOnDiceSquare
    };
    let turnActionKey = '';
    let turnActionDetails: string | undefined = undefined;
    let aiEventType: 'snake' | 'ladder' | 'win' | 'start' | 'extra' | 'snake_extra' | 'ladder_extra' | 'normal' = 'normal';
    let aiEventDetail = ''; // Name of square or S/L key
    let aiRawSLKey = undefined;

    const slInfo = SNAKES_LADDERS_MAP[landedOnDiceSquare];

    // 1. Determine Board Event (Visuals & Primary Message)
    if (wasStartingMove) {
      // Veteran logic disabled for practice or if not applicable
      const wasVeteranStart = (gameMode === 'multiplayer' && rolledDice !== 1 && rolledDice !== 6 && playerToUpdate.consecutiveWins >= 3);

      localMessageKey = wasVeteranStart ? 'msg_player_started_veteran' : 'msg_player_started';
      localMessageReplacements.diceValue = rolledDice;
      turnActionKey = wasVeteranStart ? 'turn_action_started_veteran' : 'turn_action_started_journey';
      turnActionDetails = `${finalPos}`;
      aiEventType = 'start';
      aiEventDetail = 'Janma';
    } else if (wasSL && slInfo) {
      const translatedColorName = translate(playerToUpdate.color.nameKey);
      const translatedAnimalName = translate(playerToUpdate.animalIcon.nameKey);
      const dynamicDescription = translate(slInfo.key, {
        playerName: playerToUpdate.name,
        playerColorName: translatedColorName,
        playerAnimalName: translatedAnimalName,
      });

      localMessageKey = slInfo.type === 'snake' ? 'msg_landed_on_snake' : 'msg_climbed_ladder';
      localMessageReplacements.text = dynamicDescription;
      localMessageReplacements.newPosition = finalPos;
      turnActionKey = slInfo.type === 'snake' ? 'turn_action_snake' : 'turn_action_ladder';
      turnActionDetails = `${landedOnDiceSquare} -> ${finalPos}`;
      aiEventType = slInfo.type === 'snake' ? 'snake' : 'ladder';
      aiEventDetail = slInfo.key;
      aiRawSLKey = slInfo.key;

      if (slInfo.type === 'snake') snakeSound.play(); else ladderSound.play();
    } else {
      localMessageKey = 'msg_landed_on';
      localMessageReplacements.position = finalPos;
      turnActionKey = 'turn_action_moved';
      aiEventType = 'normal'; // Usually no commentary for normal moves, but we might want it if context is special
    }

    let hasPlayerFinished = false;

    // 2. Check Win Condition
    if (finalPos === BOARD_SIZE) {
      if (!playerToUpdate.hasFinished) {
        winSound.play();
        updateGameResultInDB(playerToUpdate.name, updatedPlayersArray);
        // Win always overrides other commentary
        aiEventType = 'win';
        aiEventDetail = 'Poorna';
        if (winners.length === 0) {
          setShowWinPopup(true);
        }
      }
      playerToUpdate.hasFinished = true;
      hasPlayerFinished = true;

      localMessageKey = 'msg_player_wins';
      localMessageReplacements.diceThrows = playerToUpdate.diceThrows;
      turnActionKey = wasSL ? 'turn_action_won_via_sl' : 'turn_action_won';
      if (wasSL && slInfo) {
        localMessageReplacements.slType = translate(slInfo.type === 'snake' ? 'text_snake_description_prefix' : 'text_ladder_description_prefix');
      }
    }

    const hasExtraTurn = (rolledDice === 6 && !playerToUpdate.hasFinished && finalPos !== BOARD_SIZE);

    // 3. Handle Extra Turn Logic (Update AI Event & Queue Messages)
    let messagesToLog: string[] = [];

    // First push the primary event message
    if (localMessageKey) {
      messagesToLog.push(translate(localMessageKey, localMessageReplacements));
    }

    if (hasExtraTurn) {
      // Append extra turn message
      const extraMsg = translate('msg_extra_turn', { playerName: playerToUpdate.name });
      messagesToLog.push(extraMsg);

      // Upgrade AI Event Type
      if (aiEventType === 'snake') aiEventType = 'snake_extra';
      else if (aiEventType === 'ladder') aiEventType = 'ladder_extra';
      else if (aiEventType === 'normal') aiEventType = 'extra';
      // If win/start, keep as is or barely relevant for start-extra
    }

    // UPDATE STATE -> Show primary message on UI
    setGameMessageKey(localMessageKey);
    setMessageReplacements(localMessageReplacements);

    // Log ALL queued history messages
    messagesToLog.forEach(msg => {
      addMessageToHistory(msg);
    });

    const newTurnEntry = {
      playerId: pId,
      playerName: playerToUpdate.name,
      diceValue: rolledDice,
      startPosition: turnActualStartPos,
      endPosition: finalPos,
      actionKey: turnActionKey,
      actionDetails: turnActionDetails,
      slType: wasSL && slInfo ? translate(slInfo.type === 'snake' ? 'Snake!' : 'Ladder!') : undefined
    };
    addTurnToHistory(newTurnEntry);

    updatedPlayersArray[playerIndex] = playerToUpdate;

    // Calculate winners list for state update
    let newWinners = [...winners];
    if (hasPlayerFinished) {
      const existingWinner = newWinners.find(w => w.id === playerToUpdate.id);
      if (!existingWinner) {
        playerToUpdate.finishRank = newWinners.length + 1;
        newWinners = [...newWinners, playerToUpdate].sort((a, b) => (a.finishRank || Infinity) - (b.finishRank || Infinity));
        setWinners(newWinners);
      }
    }

    setPlayers(updatedPlayersArray);

    // TRIGGER AI COMMENTARY (Consolidated)
    if (aiEventType !== 'normal') {
      // Map valid event types to the function's expected string
      // NOTE: We'll need to handle 'snake_extra' inside generateAICommentary or pass 'extra' and rely on prompt
      // For now, let's pass a custom logic or just use the primary event and append context in prompt if we can
      // But based on current signature:
      // generateAICommentary(player, squareId, eventType, squareName, rawSLKey)

      // We will pass the composite eventType string. We need to ensure generateAICommentary handles it or we update it.
      // Since generateAICommentary signature types are strict, let's cast or update the function if needed.
      // Looking at the function, it takes string.
      generateAICommentary(
        playerToUpdate,
        landedOnDiceSquare,
        aiEventType as any, // Cast to allow new composite types
        aiEventDetail || `${finalPos}`,
        aiRawSLKey,
        messagesToLog.join(" ")
      );
    } else {
      // For normal events where Sage doesn't speak, read the flash message text
      const normalMsg = translate(localMessageKey, localMessageReplacements);
      generateAndPlayCosmicSpeech(normalMsg);
    }

    // SIDE EFFECTS (Turn Advance)
    const activePlayersLeft = updatedPlayersArray.filter(p => !p.hasFinished);

    if (!hasExtraTurn) {
      const delay = isMuted ? 1500 : TURN_ADVANCE_DELAY;
      const turnTimer = setTimeout(() => {
        advanceToNextPlayer();
      }, delay);
      return () => clearTimeout(turnTimer);
    } else if (!playerToUpdate.hasFinished) {
      if (hasExtraTurn) {
        // If it's an extra turn, unlock processing so computer (or player) can roll again immediately
        setIsProcessingTurn(false);
      } else {
        setTimeout(() => advanceToNextPlayer(), isMuted ? 1500 : TURN_ADVANCE_DELAY);
      }
    } else if (activePlayersLeft.length > 0 && playerToUpdate.hasFinished) {
      setTimeout(() => advanceToNextPlayer(), isMuted ? 1500 : TURN_ADVANCE_DELAY);
    }

  }, [players, winners, translate, addMessageToHistory, addTurnToHistory, updatePlayerPositionInDB, updateGameResultInDB, advanceToNextPlayer, setWinners, setGameMessageKey, setMessageReplacements, generateAICommentary, snakeSound, ladderSound, winSound, gameMode, isMuted]);

  // Ref to hold the latest version of finalizeAndLogMove
  const finalizeMoveRef = useRef(finalizeAndLogMove);
  useEffect(() => {
    finalizeMoveRef.current = finalizeAndLogMove;
  }, [finalizeAndLogMove]);


  useEffect(() => {
    if (!animationState) return;

    const { playerId, path, currentIndex, sLTarget, finalLandingPos, isProcessingPostSL, diceRolled, originalStartPos, isStartingMove } = animationState;

    let timer: ReturnType<typeof setTimeout>;

    if (isProcessingPostSL) {
      // Temporary visual update only for S/L slide
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: finalLandingPos } : p));

      timer = setTimeout(() => {
        if (!isFinalizingMoveRef.current) {
          isFinalizingMoveRef.current = true;
          // Use Ref to call the function to avoid dependency cycle
          finalizeMoveRef.current(playerId, finalLandingPos, diceRolled, originalStartPos, path[path.length - 1], true, isStartingMove);
          setAnimationState(null);
          setActiveSpecialSquare(null);
        }
      }, SL_ANIMATION_DURATION);
    } else {
      if (currentIndex < path.length - 1) {
        const nextIdx = currentIndex + 1;
        const nextVisPos = path[nextIdx];
        timer = setTimeout(() => {
          setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: nextVisPos } : p));
          setAnimationState(prev => prev ? ({ ...prev, currentIndex: nextIdx }) : null);
        }, HOP_DURATION);
      } else {
        if (sLTarget === undefined) {
          if (!isFinalizingMoveRef.current) {
            isFinalizingMoveRef.current = true;
            finalizeMoveRef.current(playerId, finalLandingPos, diceRolled, originalStartPos, path[path.length - 1], false, isStartingMove);
            setAnimationState(null);
          }
        } else {
          const hitSquare = path[path.length - 1];
          const info = SNAKES_LADDERS_MAP[hitSquare];
          if (info) {
            setActiveSpecialSquare({ id: hitSquare, type: info.type });
            setTimeout(() => setActiveSpecialSquare(null), 2000);
          }
          setAnimationState(prev => prev ? ({ ...prev, isProcessingPostSL: true }) : null);
        }
      }
    }

    return () => clearTimeout(timer);
    // Dependency array is now stable because we don't include finalizeAndLogMove directly
  }, [animationState, setPlayers, setAnimationState]); // Removed finalizeAndLogMove


  const handleRollDice = useCallback((rolledValue: number) => {
    if (gameStage !== GameStage.Playing || players.length === 0 || animationState || isProcessingTurn) return;

    // Only init audio context if it's a real user click, not computer
    if (!players[currentPlayerIndex]?.isComputer) {
      initAudioContext();
    }

    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || currentPlayer.hasFinished) return;

    setIsProcessingTurn(true); // Lock the turn logic
    setSageWisdom(null); // Reset wisdom on new roll
    stopSageAudio(); // Stop old audio on new roll
    // lastAudioBase64Ref.current = null; // Clear cache - Handled internally/ignored
    setDiceValue(rolledValue);
    diceSound.play();

    // Reset the finalizing lock for this new turn
    isFinalizingMoveRef.current = false;

    const turnStartPos = currentPlayer.position;
    let pathForAnimation: number[] = [];
    let landedOnAfterDice: number;
    let isStarting = false;

    if (!currentPlayer.hasStarted) {
      // RULE UPDATE: Check if roll is 1, 6 OR if streak >= 3 (Multiplayer only)
      const canEnter = rolledValue === 1 || rolledValue === 6 || (gameMode === 'multiplayer' && currentPlayer.consecutiveWins >= 3);

      if (canEnter) {
        pathForAnimation = [PLAYER_BOARD_START_POSITION];
        landedOnAfterDice = PLAYER_BOARD_START_POSITION;
        isStarting = true;
      } else {
        const failMsgKey = 'msg_player_roll_to_start_fail';
        const failMsgReplacements = { playerName: currentPlayer.name, diceValue: rolledValue };
        setGameMessageKey(failMsgKey);
        setMessageReplacements(failMsgReplacements);
        addMessageToHistory(translate(failMsgKey, failMsgReplacements));
        addTurnToHistory({ playerId: currentPlayer.id, playerName: currentPlayer.name, diceValue: rolledValue, startPosition: turnStartPos, endPosition: turnStartPos, actionKey: 'turn_action_failed_to_start' });

        // Audio feedback
        generateAndPlayCosmicSpeech(translate(failMsgKey, failMsgReplacements));

        setTimeout(() => advanceToNextPlayer(), 1500); // Shorter delay for simple fail
        return;
      }
    } else {
      for (let i = 1; i <= rolledValue; i++) {
        pathForAnimation.push(currentPlayer.position + i);
      }
      landedOnAfterDice = pathForAnimation[pathForAnimation.length - 1];

      if (landedOnAfterDice > BOARD_SIZE) {
        const overshootMsgKey = 'msg_exact_roll_needed';
        const overshootMsgReplacements = { playerName: currentPlayer.name, diceValue: rolledValue, position: currentPlayer.position };
        setGameMessageKey(overshootMsgKey);
        setMessageReplacements(overshootMsgReplacements);
        addMessageToHistory(translate(overshootMsgKey, overshootMsgReplacements));
        addTurnToHistory({ playerId: currentPlayer.id, playerName: currentPlayer.name, diceValue: rolledValue, startPosition: turnStartPos, endPosition: currentPlayer.position, actionKey: 'turn_action_overshot' });

        // Audio feedback
        generateAndPlayCosmicSpeech(translate(overshootMsgKey, overshootMsgReplacements));

        setTimeout(() => advanceToNextPlayer(), 1500); // Shorter delay for simple overshoot
        return;
      }
    }

    const slInfo = SNAKES_LADDERS_MAP[landedOnAfterDice];
    const sLTargetVal = slInfo ? slInfo.to : undefined;
    const finalActualLandingPos = sLTargetVal !== undefined ? sLTargetVal : landedOnAfterDice;

    setAnimationState({
      playerId: currentPlayer.id,
      path: pathForAnimation,
      currentIndex: -1,
      sLTarget: sLTargetVal,
      finalLandingPos: finalActualLandingPos,
      isProcessingPostSL: false,
      diceRolled: rolledValue,
      originalStartPos: turnStartPos,
      isStartingMove: isStarting,
    });

  }, [gameStage, players, currentPlayerIndex, animationState, translate, addMessageToHistory, addTurnToHistory, advanceToNextPlayer, setDiceValue, setGameMessageKey, setMessageReplacements, setAnimationState, stopSageAudio, gameMode, isProcessingTurn]);

  // Keep reference for computer logic
  useEffect(() => {
    handleRollDiceRef.current = handleRollDice;
  }, [handleRollDice]);


  useEffect(() => {
    return () => {
      setAnimationState(null);
    };
  }, [setAnimationState]);


  const handleNicknameSubmit = useCallback((nickname: string) => {
    setUserNickname(nickname);
    localStorage.setItem('dharmayatra_nickname', nickname);
    setGameMessageKey('msg_welcome');
    setMessageReplacements(undefined);
    addMessageToHistory(translate('msg_welcome'));
  }, [translate, addMessageToHistory, setUserNickname, setGameMessageKey, setMessageReplacements]);



  const languageContextValue = useMemo(() => ({
    language,
    setLanguage,
    translate,
    availableLanguages: AVAILABLE_LANGUAGES,
  }), [language, setLanguage, translate]);

  const currentPlayerDataForDisplay = (gameStage === GameStage.Playing || gameStage === GameStage.GameOver) && players.length > 0 && players[currentPlayerIndex] ? players[currentPlayerIndex] : null;

  const formattedTurnHistory = turnHistory.map(turn => {
    let text = translate(turn.actionKey, {
      playerName: turn.playerName,
      diceValue: turn.diceValue,
      startPosition: turn.startPosition,
      endPosition: turn.endPosition,
      slType: turn.slType
    });
    return { id: turn.id, text };
  });

  // The original `gameSyncComponent` variable is removed, and the component is rendered directly in JSX.
  // The `roomId` prop is already included in the provided `GameStateSync` component.

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  if (!userNickname) {
    return (
      <LanguageContext.Provider value={languageContextValue}>
        <div className="game-wrapper min-h-screen flex flex-col items-center bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100">
          <header className="mb-6 text-center pt-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 drop-shadow-sm tracking-tight bg-white/80 rounded-lg px-6 py-2 inline-block backdrop-blur-sm">
              {translate('app_title')}
            </h1>
          </header>
          <NicknameInput onSubmit={handleNicknameSubmit} initialNickname={userNickname} />
          <LegalFooter />
        </div>
      </LanguageContext.Provider>
    );
  }

  if (gameStage === GameStage.Setup) {
    return (
      <LanguageContext.Provider value={languageContextValue}>
        <div className="game-wrapper min-h-screen flex flex-col items-center bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100">
          <header className="mb-6 text-center pt-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 drop-shadow-sm tracking-tight bg-white/80 rounded-lg px-6 py-2 inline-block backdrop-blur-sm">
              {translate('app_title')}
            </h1>
          </header>
          {userNickname && gameMode === 'multiplayer' && (
            <GameStateSync roomId={roomId} onUpdate={handleRemoteGameStateUpdate} />
          )}
          <PlayerSetup 
            onStartGame={startGame} 
            userNickname={userNickname}
            userApiKey={userApiKey}
            onApiKeyChange={handleApiKeyChange}
          />
          <LegalFooter />
        </div>
      </LanguageContext.Provider>
    );
  }

  if (gameStage === GameStage.VideoIntro) {
    return (
      <LanguageContext.Provider value={languageContextValue}>
        <VideoIntro onComplete={() => setGameStage(GameStage.Playing)} />
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={languageContextValue}>
      {userNickname && gameMode === 'multiplayer' && (
        <GameStateSync roomId={roomId} onUpdate={handleRemoteGameStateUpdate} />
      )}
      {gameStage === GameStage.GameOver && (
        <WinScreen
          winners={winners}
          allPlayers={players}
          onPlayAgain={resetGame}
          summaryText={sageWisdom}
        />
      )}

      {showWinPopup && (
        <WinPopup onComplete={() => setShowWinPopup(false)} />
      )}
      <div
        className={`game-wrapper min-h-screen bg-repeat bg-auto text-stone-700`}
        style={{ backgroundImage: customBackground ? `url(${customBackground})` : "url('/dharmayatra_bg.png')" }}
      >
        <header className="mb-6 text-center pt-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 drop-shadow-sm tracking-tight bg-white/80 rounded-lg px-4 inline-block backdrop-blur-sm">
            {translate('app_title')}
          </h1>
        </header>

        <main className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl justify-center mx-auto px-4">
          <div className="flex-grow flex justify-center items-start lg:order-1 relative perspective-container">
            <Board squares={boardSquares} players={players} activeSpecialSquare={activeSpecialSquare} />
          </div>

          <aside className="lg:w-80 space-y-4 lg:order-2 flex flex-col">
            <div className="bg-white/60 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/20">
              <GameControls
                onRollDice={handleRollDice}
                diceValue={diceValue}
                isGameOver={gameStage === GameStage.GameOver || (currentPlayerDataForDisplay?.hasFinished ?? false)}
                isAnimating={animationState !== null || (currentPlayerDataForDisplay?.isComputer ?? false) || isProcessingTurn}
                currentPlayerName={currentPlayerDataForDisplay && !currentPlayerDataForDisplay.hasFinished ? currentPlayerDataForDisplay.name : undefined}
                currentPlayerProfilePic={currentPlayerDataForDisplay && !currentPlayerDataForDisplay.hasFinished ? currentPlayerDataForDisplay.profilePic : undefined}
              />

              <div className="my-4">
                <SageCommentary
                  text={sageWisdom}
                  isLoading={isSageThinking}
                  isSpeaking={isSageSpeaking}
                  onStop={stopSageAudio}
                  onReplay={replaySageAudio}
                  onDismiss={dismissSageMessage}
                  quotaExceeded={aiQuotaExceeded}
                />
              </div>

              <GameMessage gameMessageKey={gameMessageKey} replacements={messageReplacements} />

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {players.map(p => (
                  <div key={p.id} className="p-2 bg-white/70 rounded-lg shadow-sm border border-stone-100 flex items-center justify-between">
                    <span style={{ color: p.color.tailwindClass.replace('bg-', 'text-').replace('-500', '-700') }} className="font-bold flex items-center gap-2">
                      {p.profilePic ? (
                        <img src={p.profilePic} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-stone-200" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${p.color.tailwindClass}`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {p.name} {p.isComputer && <span className="text-xs">🤖</span>}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="font-mono bg-stone-100 px-1.5 rounded text-stone-600">
                        {p.position === PLAYER_INITIAL_POSITION && !p.hasStarted ? '-' :
                          p.hasFinished ? '✓' :
                            p.position}
                      </span>
                      {p.consecutiveWins >= 3 && !p.isComputer && (
                        <span className="text-[0.6rem] text-orange-600 font-bold" title="3+ Win Streak: Auto-entry">
                          ★ Veteran
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              <HistoryLog titleKey="message_history_title" items={messageHistory} emptyLogMessageKey="empty_message_history" />
              <Leaderboard />
            </div>

            <GameSettingsPanel
              sageVoice={sageVoice}
              onVoiceChange={setSageVoice}
              onBackgroundUpload={handleBackgroundUpload}
              onBackgroundClear={handleBackgroundClear}
              currentBackground={customBackground}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onResetNickname={handleResetNickname}
              aiQuotaExceeded={aiQuotaExceeded}
              customApiKey={userApiKey}
              onApiKeyChange={handleApiKeyChange}
            />

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={restartWithSamePlayers}
                disabled={animationState !== null || isProcessingTurn}
                className="w-full p-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                title="Restart Match"
              >
                <FaRedo size={14} /> Restart
              </button>
              <button
                onClick={resetGame}
                disabled={animationState !== null || isProcessingTurn}
                className="w-full p-2.5 bg-stone-500 hover:bg-stone-600 text-white font-bold rounded-xl shadow-md transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                title="Reconfigure Players"
              >
                Reconfigure
              </button>
            </div>
            
            <button
              onClick={() => { window.location.href = '/' }}
              disabled={animationState !== null || isProcessingTurn}
              className="w-full p-2.5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              title="Exit Game completely"
            >
              Exit Game
            </button>

          </aside>
        </main>

        <LegalFooter />

        {flashMessageText && (
          <FlashMessage
            message={flashMessageText}
            onComplete={() => setFlashMessageText(null)}
            isMuted={isMuted}
          />
        )}
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
