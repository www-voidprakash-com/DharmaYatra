
import { IconType } from 'react-icons';

export enum Language {
  English = 'en',
  Hindi = 'hi',
  Sanskrit = 'sa',
  Bengali = 'bn',
  Tamil = 'ta',
  Telugu = 'te',
  Kannada = 'kn',
  Gujarati = 'gu',
  Marathi = 'mr',
  Punjabi = 'pa',
}

export interface TranslationSet {
  [key: string]: string;
}

export interface Translations {
  [Language.English]: TranslationSet;
  [Language.Hindi]: TranslationSet;
  [Language.Sanskrit]: TranslationSet;
  [Language.Bengali]: TranslationSet;
  [Language.Tamil]: TranslationSet;
  [Language.Telugu]: TranslationSet;
  [Language.Kannada]: TranslationSet;
  [Language.Gujarati]: TranslationSet;
  [Language.Marathi]: TranslationSet;
  [Language.Punjabi]: TranslationSet;
}

export enum SquareType {
  Normal = 'normal',
  SnakeHead = 'snake_head',
  LadderBottom = 'ladder_bottom',
  Janma = 'janma',
  Poorna = 'poorna',
}

export interface SnakeLadderInfo {
  to: number;
  type: 'snake' | 'ladder';
  key: string; // Translation key for the snake/ladder description
  themeIndex?: number; // Unique color theme index for snakes
}

export interface SquareData {
  id: number;
  type: SquareType;
  specialTextKey?: string; // e.g., 'text_janma', 'text_poorna'
  snakeLadderInfo?: SnakeLadderInfo;
}

export interface PlayerColor {
  nameKey: string; // Translation key for color name e.g., 'color_red'
  tailwindClass: string; // e.g., 'bg-red-500'
  tailwindBorderClass: string; // e.g., 'border-red-700'
}

export interface AnimalIconInfo {
  nameKey: string; // Translation key for animal name e.g., 'animal_cat'
  iconKey: string; // Key to identify the icon component (e.g., 'FaCat')
}

export interface Player {
  id: number;
  name: string;
  position: number;
  color: PlayerColor;
  animalIcon: AnimalIconInfo;
  hasStarted: boolean; // True if player has rolled 1 or 6 to start
  diceThrows: number;
  hasFinished: boolean;
  finishRank: number | null; // 1st, 2nd, etc.
  consecutiveWins: number; // Track streak from DB
  isComputer?: boolean; // New flag for practice mode
  startingSquare?: number; // Custom starting position
  playerClass?: string; // Flavor text for ability/class
  profilePic?: string; // Base64 or URL string for profile picture
}

export enum GameStage {
  Setup = 'setup',
  Playing = 'playing',
  GameOver = 'gameOver',
}

export interface LanguageOption {
  code: Language;
  name: string;
  fontClass?: string;
}

export interface VoiceOption {
  name: string; // The API name e.g. 'Fenrir'
  label: string; // Display name e.g. 'Fenrir (Deep)'
}

export interface MessageHistoryEntry {
  id: string;
  text: string;
  timestamp: number;
}

export interface TurnHistoryEntry {
  id: string;
  playerId: number;
  playerName: string;
  diceValue: number;
  startPosition: number;
  endPosition: number;
  actionKey: string; // e.g., 'turn_action_moved', 'turn_action_snake'
  actionDetails?: string; // e.g. "to 7", "to 42 via Ladder"
  slType?: string; // e.g. "Snake!", "Ladder!" for 'turn_action_won_via_sl' message
  timestamp: number;
}

export interface LeaderboardEntryData {
  wins: number;
  streak?: number; // Consecutive wins
  lastWinAt?: number;
}
