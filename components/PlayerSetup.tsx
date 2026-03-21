
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { Player, PlayerColor, AnimalIconInfo, Language } from '../types';
import { AVAILABLE_COLORS, AVAILABLE_ANIMAL_ICONS, PLAYER_INITIAL_POSITION, AVAILABLE_LANGUAGES } from '../constants';
import AnimalIcon from './AnimalIcon';
import { resizeImage } from '../utils/imageUtils';
import { FaLanguage, FaRobot, FaChevronDown, FaChevronUp, FaCogs } from 'react-icons/fa';

interface PlayerSetupProps {
  onStartGame: (players: Player[]) => void;
  userNickname: string | null;
  userApiKey: string | null;
  onApiKeyChange: (key: string | null) => void;
}

interface PlayerConfig {
  id: number;
  name: string;
  colorKey: string;
  animalIconKey: string;
  startingSquare: number;
  playerClass: string;
  profilePic?: string;
}

const CLASS_PRESETS = [
  { id: 'pilgrim', start: 0 },
  { id: 'traveler', start: 2 },
  { id: 'explorer', start: 5 },
  { id: 'veteran', start: 10 },
];

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame, userNickname, userApiKey, onApiKeyChange }) => {
  const { language, setLanguage, translate, availableLanguages } = useLanguage();
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Track open state for advanced options per player
  const [openAdvanced, setOpenAdvanced] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    // Initialize playerConfigs when numPlayers changes or on initial load
    setPlayerConfigs(prev => {
      const newConfigs = Array.from({ length: numPlayers }, (_, i) => {
        // Preserve existing config if ID matches
        if (prev[i] && prev[i].id === i + 1) return prev[i];

        let defaultName = `Player ${i + 1}`;
        if (i === 0 && userNickname) {
          defaultName = userNickname;
        } else if (prev[i] && prev[i].id === i + 1) {
          defaultName = prev[i].name;
        }

        return {
          id: i + 1,
          name: defaultName,
          colorKey: AVAILABLE_COLORS[i % AVAILABLE_COLORS.length].nameKey,
          animalIconKey: AVAILABLE_ANIMAL_ICONS[i % AVAILABLE_ANIMAL_ICONS.length].iconKey,
          startingSquare: 0,
          playerClass: 'pilgrim',
          profilePic: undefined,
        };
      });
      return newConfigs;
    });
  }, [numPlayers, userNickname]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setNumPlayers(count);
  };

  const handlePlayerConfigChange = (index: number, field: keyof PlayerConfig, value: any) => {
    setPlayerConfigs(prev =>
      prev.map((config, i) => {
        if (i !== index) return config;

        let updates: Partial<PlayerConfig> = { [field]: value };

        // Logic to sync Class Dropdown and Starting Square
        if (field === 'playerClass') {
          const preset = CLASS_PRESETS.find(p => p.id === value);
          if (preset) {
            updates.startingSquare = preset.start;
          }
        } else if (field === 'startingSquare') {
          // Check if custom value matches a preset, else custom
          const matchingPreset = CLASS_PRESETS.find(p => p.start === Number(value));
          updates.playerClass = matchingPreset ? matchingPreset.id : 'custom';
        }

        return { ...config, ...updates };
      })
    );
  };

  const toggleAdvanced = (id: number) => {
    setOpenAdvanced(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    setError(null);
    const names = new Set<string>();
    const colors = new Set<string>();
    const animals = new Set<string>();

    for (const config of playerConfigs) {
      if (!config.name.trim()) {
        setError(translate('player_setup_error_name', { id: config.id }));
        return;
      }
      names.add(config.name.trim());
      colors.add(config.colorKey);
      animals.add(config.animalIconKey);
    }

    if (colors.size !== numPlayers) {
      setError(translate('player_setup_error_color_conflict'));
      return;
    }
    if (animals.size !== numPlayers) {
      setError(translate('player_setup_error_animal_conflict'));
      return;
    }

    const finalPlayers: Player[] = playerConfigs.map(config => ({
      id: config.id,
      name: config.name.trim(),
      color: AVAILABLE_COLORS.find(c => c.nameKey === config.colorKey)!,
      animalIcon: AVAILABLE_ANIMAL_ICONS.find(a => a.iconKey === config.animalIconKey)!,
      position: PLAYER_INITIAL_POSITION,
      hasStarted: false,
      diceThrows: 0,
      hasFinished: false,
      finishRank: null,
      consecutiveWins: 0,
      startingSquare: config.startingSquare,
      playerClass: config.playerClass,
      profilePic: config.profilePic
    }));
    onStartGame(finalPlayers);
  };

  const handlePracticeStart = () => {
    // Create user player
    const userPlayer: Player = {
      id: 1,
      name: userNickname || 'Player',
      color: AVAILABLE_COLORS[0],
      animalIcon: AVAILABLE_ANIMAL_ICONS[0],
      position: PLAYER_INITIAL_POSITION,
      hasStarted: false,
      diceThrows: 0,
      hasFinished: false,
      finishRank: null,
      consecutiveWins: 0,
    };

    // Create Computer Bot
    const computerPlayer: Player = {
      id: 2,
      name: 'Panchvedi', // Renamed bot
      color: AVAILABLE_COLORS[1],
      animalIcon: AVAILABLE_ANIMAL_ICONS[5], // Tiger
      position: PLAYER_INITIAL_POSITION,
      hasStarted: false,
      diceThrows: 0,
      hasFinished: false,
      finishRank: null,
      consecutiveWins: 0,
      isComputer: true
    };

    onStartGame([userPlayer, computerPlayer]);
  };

  const selectedLanguageFontClass = availableLanguages.find(l => l.code === language)?.fontClass || 'font-noto-sans';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center p-4 bg-repeat bg-auto text-stone-700 ${selectedLanguageFontClass}`} 
      style={{ backgroundImage: "url('/dharmayatra_bg.png')" }}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-orange-200 w-full max-w-4xl my-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 text-center mb-6 sm:mb-8">
          {translate('setup_title')}
        </h1>

        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm font-semibold border border-red-200">{error}</p>}

        {/* Global Settings Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b border-orange-200">
          <div className="flex-1">
            <label htmlFor="language-select-setup" className="block text-sm font-bold text-stone-600 mb-1">
              <span className="inline mr-2"><FaLanguage aria-hidden="true" /></span>
              {translate('language_switcher_label')}
            </label>
            <select
              id="language-select-setup"
              value={language}
              onChange={handleLanguageChange}
              className={`w-full p-2.5 border border-orange-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white ${selectedLanguageFontClass}`}
            >
              {availableLanguages.map(langOpt => (
                <option key={langOpt.code} value={langOpt.code} className={langOpt.fontClass}>
                  {langOpt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="numPlayers" className="block text-sm font-bold text-stone-600 mb-1">
              {translate('num_players_label')}
            </label>
            <select
              id="numPlayers"
              value={numPlayers}
              onChange={handleNumPlayersChange}
              className="w-full p-2.5 border border-orange-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-mono text-lg"
            >
              {[2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {playerConfigs.map((config, index) => (
            <div key={config.id} className="bg-orange-50/50 rounded-xl border border-orange-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-orange-100/80 px-4 py-2 border-b border-orange-200 flex justify-between items-center">
                <h3 className="font-bold text-orange-800">{translate('player_header')} {config.id}</h3>
                {config.startingSquare > 0 && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Boosted +{config.startingSquare}</span>}
              </div>

              <div className="p-4 space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor={`playerName-${config.id}`} className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                    {translate('player_name_label', { id: config.id })}
                  </label>
                  <input
                    type="text"
                    id={`playerName-${config.id}`}
                    value={config.name}
                    onChange={e => handlePlayerConfigChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-orange-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"
                    placeholder={translate('player_name_label', { id: config.id })}
                  />
                </div>

                {/* Color Swatches */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    {translate('player_color_label', { id: config.id })}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {AVAILABLE_COLORS.map(color => (
                      <button
                        key={color.nameKey}
                        type="button"
                        onClick={() => handlePlayerConfigChange(index, 'colorKey', color.nameKey)}
                        className={`w-8 h-8 rounded-full ${color.tailwindClass} transition-transform hover:scale-110 focus:outline-none flex items-center justify-center ${config.colorKey === color.nameKey ? 'ring-4 ring-offset-1 ring-stone-300 scale-110 shadow-md' : 'opacity-80'}`}
                        title={translate(color.nameKey)}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Grid */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    {translate('player_animal_label', { id: config.id })}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {AVAILABLE_ANIMAL_ICONS.map(animal => (
                      <button
                        key={animal.iconKey}
                        type="button"
                        onClick={() => handlePlayerConfigChange(index, 'animalIconKey', animal.iconKey)}
                        className={`p-2 rounded-lg transition-all ${config.animalIconKey === animal.iconKey ? 'bg-white shadow-md ring-2 ring-orange-400 text-orange-600 scale-110' : 'bg-white/40 text-stone-400 hover:bg-white hover:text-stone-600'}`}
                        title={translate(animal.nameKey)}
                      >
                        <AnimalIcon iconKey={animal.iconKey} className="text-xl" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-orange-200 border-2 border-orange-300 flex-shrink-0">
                    {config.profilePic ? (
                      <img src={config.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-400 text-2xl">
                        <span role="img" aria-label="user">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`playerPic-${config.id}`} className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      id={`playerPic-${config.id}`}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            // Optimization: Max 256x256 for profile icons
                            const resized = await resizeImage(file, 256, 256, 0.7);
                            handlePlayerConfigChange(index, 'profilePic', resized);
                          } catch (err) {
                            console.error("Profile pic resize failed", err);
                          }
                        }
                      }}
                      className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                    />
                  </div>
                </div>

                {/* Class/Ability Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">
                    {translate('setup_class_label')}
                  </label>
                  <select
                    value={config.playerClass}
                    onChange={(e) => handlePlayerConfigChange(index, 'playerClass', e.target.value)}
                    className="w-full p-2 text-sm border border-orange-300 rounded-md focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="pilgrim">{translate('setup_class_pilgrim')}</option>
                    <option value="traveler">{translate('setup_class_traveler')}</option>
                    <option value="explorer">{translate('setup_class_explorer')}</option>
                    <option value="veteran">{translate('setup_class_veteran')}</option>
                    <option value="custom">{translate('setup_class_custom')}</option>
                  </select>
                </div>

                {/* Advanced Toggle */}
                <div className="pt-2 border-t border-orange-100">
                  <button
                    type="button"
                    onClick={() => toggleAdvanced(config.id)}
                    className="flex items-center text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <span className="mr-1"><FaCogs /></span>
                    {translate('setup_advanced_options')}
                    {openAdvanced[config.id] ? <span className="ml-1"><FaChevronUp /></span> : <span className="ml-1"><FaChevronDown /></span>}
                  </button>

                  {openAdvanced[config.id] && (
                    <div className="mt-3 bg-white p-3 rounded border border-stone-100 shadow-inner animate-fade-in-down">
                      <label className="flex justify-between text-xs font-bold text-stone-600 mb-2">
                        <span>{translate('setup_starting_square')}</span>
                        <span className="font-mono bg-stone-100 px-1 rounded">{config.startingSquare}</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="99"
                        value={config.startingSquare}
                        onChange={(e) => handlePlayerConfigChange(index, 'startingSquare', Number(e.target.value))}
                        className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                      <p className="text-[0.65rem] text-stone-400 mt-1 italic">
                        Override starting position. 0 = Off Board.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4 border-t border-orange-200 pt-6">
          {/* Advanced AI Setting */}
          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200 mb-2">
            <h3 className="font-bold text-orange-800 text-sm mb-2">Advance AI Setting</h3>
            <p className="text-xs text-stone-600 mb-3">For the BEST AI experience, add your custom Gemini API Key here.</p>
            <div className="flex gap-2">
              <input
                type="password"
                className="flex-1 p-2 border border-orange-300 rounded-lg text-sm bg-white"
                placeholder="Enter Gemini API Key (Optional)"
                value={userApiKey || ''}
                onChange={(e) => onApiKeyChange(e.target.value || null)}
              />
              <button 
                type="button"
                className="px-4 py-2 bg-orange-200 text-orange-800 hover:bg-orange-300 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                onClick={async () => {
                  if (!userApiKey) {
                     alert("Please enter an API key first."); 
                     return;
                  }
                  try {
                    const { GoogleGenAI } = await import('@google/genai');
                    const ai = new GoogleGenAI({ apiKey: userApiKey });
                    await (ai.models as any).generateContent({ model: "gemini-1.5-flash", contents: "test", config: { maxOutputTokens: 1 }});
                    alert("API Key Validated Successfully! You are ready for the best AI experience.");
                  } catch (e: any) {
                    alert("Invalid or Unauthorized API Key!\n\n" + e.message);
                  }
                }}
              >
                Validate Key
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg transition-all duration-150 text-xl transform hover:-translate-y-0.5"
          >
            {translate('start_game_button')}
          </button>

          <button
            onClick={handlePracticeStart}
            className="w-full px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-lg border border-stone-300 transition-colors duration-150 text-md flex items-center justify-center gap-2"
          >
            <FaRobot /> {translate('start_practice_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
