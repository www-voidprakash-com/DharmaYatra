import React from 'react';
import { useLanguage } from '../App';
import { Language } from '../types';
import { AVAILABLE_VOICES } from '../constants';
import { FaLanguage, FaMicrophoneAlt, FaImage, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface GameSettingsPanelProps {
    sageVoice?: string;
    onVoiceChange?: (voice: string) => void;
    onBackgroundUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackgroundClear?: () => void;
    currentBackground?: string | null;
    isMuted: boolean;
    onToggleMute: () => void;
}

const GameSettingsPanel: React.FC<GameSettingsPanelProps> = ({
    sageVoice,
    onVoiceChange,
    onBackgroundUpload,
    onBackgroundClear,
    currentBackground,
    isMuted,
    onToggleMute
}) => {
    const { language, setLanguage, translate, availableLanguages } = useLanguage();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onVoiceChange) {
            onVoiceChange(e.target.value);
        }
    };

    const selectedLanguageFontClass = availableLanguages.find(l => l.code === language)?.fontClass || 'font-noto-sans';

    return (
        <div className="bg-white/60 backdrop-blur-xl p-3 rounded-2xl shadow-[0_4px_16px_rgba(31,38,135,0.1)] border border-white/20 mt-4">
            <div className="flex flex-col gap-3">
                {/* Controls Row: Language | Voice | Mute */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    {/* Language */}
                    <div className="flex items-center space-x-1 w-full">
                        <FaLanguage className="text-orange-500 text-lg flex-shrink-0" />
                        <label htmlFor="language-select-settings" className="sr-only">{translate('language_switcher_label')}</label>
                        <select
                            id="language-select-settings"
                            value={language}
                            onChange={handleLanguageChange}
                            className={`w-full p-1.5 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-xs bg-white ${selectedLanguageFontClass}`}
                        >
                            {availableLanguages.map(langOpt => (
                                <option key={langOpt.code} value={langOpt.code} className={langOpt.fontClass}>
                                    {langOpt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Voice */}
                    <div className="flex items-center space-x-1 w-full">
                        {sageVoice && onVoiceChange && (
                            <>
                                <FaMicrophoneAlt className="text-orange-500 text-lg flex-shrink-0" />
                                <label htmlFor="voice-select-settings" className="sr-only">{translate('voice_switcher_label')}</label>
                                <select
                                    id="voice-select-settings"
                                    value={sageVoice}
                                    onChange={handleVoiceChange}
                                    className="w-full p-1.5 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-xs bg-white"
                                >
                                    {AVAILABLE_VOICES.map(voice => (
                                        <option key={voice.name} value={voice.name}>
                                            {voice.label}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </div>

                    {/* Mute Button */}
                    <button
                        onClick={onToggleMute}
                        className={`p-2 rounded-md border ${isMuted ? 'bg-red-100 border-red-300 text-red-500' : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'} transition-colors ml-auto sm:ml-0`}
                        title={isMuted ? "Unmute Sound" : "Mute Sound"}
                    >
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                </div>

                {/* Custom Background Uploader */}
                {onBackgroundUpload && (
                    <div className="pt-2 border-t border-dashed border-orange-200">
                        <div className="flex items-center justify-between gap-2">
                            <label
                                htmlFor="bg-upload-settings"
                                className="flex-1 cursor-pointer hover:bg-stone-50 text-stone-400 hover:text-stone-600 text-[0.65rem] uppercase font-bold tracking-wider py-1.5 px-2 rounded border border-transparent hover:border-stone-200 flex items-center justify-center gap-2 transition-all"
                                title={translate('background_input_label')}
                            >
                                <FaImage className="text-lg" />
                                <span>{translate('upload_background_button')}</span>
                                <input
                                    type="file"
                                    id="bg-upload-settings"
                                    accept="image/*"
                                    onChange={onBackgroundUpload}
                                    className="hidden"
                                />
                            </label>

                            {currentBackground && onBackgroundClear && (
                                <button
                                    onClick={onBackgroundClear}
                                    className="text-red-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
                                    title={translate('clear_background_button')}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameSettingsPanel;
