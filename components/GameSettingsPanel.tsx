import React from 'react';
import { useLanguage } from '../App';
import { Language } from '../types';
import { AVAILABLE_VOICES } from '../constants';
import { FaLanguage, FaMicrophoneAlt, FaImage, FaTimes, FaVolumeUp, FaVolumeMute, FaKey, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';

interface GameSettingsPanelProps {
    sageVoice?: string;
    onVoiceChange?: (voice: string) => void;
    onBackgroundUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackgroundClear?: () => void;
    currentBackground?: string | null;
    isMuted: boolean;
    onToggleMute: () => void;
    onResetNickname: () => void;
    aiQuotaExceeded?: boolean;
    customApiKey?: string | null;
    onApiKeyChange?: (key: string | null) => void;
}

const GameSettingsPanel: React.FC<GameSettingsPanelProps> = ({
    sageVoice,
    onVoiceChange,
    onBackgroundUpload,
    onBackgroundClear,
    currentBackground,
    isMuted,
    onToggleMute,
    onResetNickname,
    aiQuotaExceeded,
    customApiKey,
    onApiKeyChange
}) => {
    const { language, setLanguage, translate, availableLanguages } = useLanguage();
    const [isAiSettingsOpen, setIsAiSettingsOpen] = React.useState(false);
    const [tempKey, setTempKey] = React.useState(customApiKey || '');

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
                        <span className="text-orange-500 flex items-center justify-center p-1"><FaLanguage size={20} /></span>
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
                                <span className="text-orange-500 flex items-center justify-center p-1"><FaMicrophoneAlt size={18} /></span>
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
                                <FaImage size={20} />
                                <span className="ml-1">{translate('upload_background_button')}</span>
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
                                    <FaTimes size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Advanced / Account Actions */}
                <div className="pt-2 border-t border-dashed border-orange-200">
                    <div className="flex justify-between items-center">
                        <div></div> {/* Placeholder to keep layout spacing if needed, or remove completely if flex-end is better */}

                        <button
                            onClick={() => setIsAiSettingsOpen(!isAiSettingsOpen)}
                            className="flex items-center gap-1 text-[0.7rem] font-bold text-stone-500 hover:text-orange-600 transition-colors uppercase tracking-wider"
                        >
                            <FaKey size={12} color={customApiKey ? '#22c55e' : '#a8a29e'} />
                            {translate('ai_settings_title')}
                            {isAiSettingsOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                        </button>
                    </div>

                    {/* Collapsible AI Settings */}
                    {isAiSettingsOpen && (
                        <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-[0.6rem] text-stone-500 mb-2 leading-relaxed">
                                {translate('custom_api_key_help')}
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={tempKey}
                                        onChange={(e) => setTempKey(e.target.value)}
                                        placeholder={translate('custom_api_key_placeholder')}
                                        className="flex-1 p-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-orange-400 outline-none"
                                    />
                                    <button
                                        onClick={() => onApiKeyChange?.(tempKey)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-[0.65rem] font-bold py-1 px-3 rounded transition-colors"
                                    >
                                        {translate('save_api_key_button')}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[0.6rem] flex items-center gap-1 font-medium">
                                        {customApiKey ? (
                                            <>
                                                <FaCheckCircle size={12} color="#22c55e" />
                                                <span className="text-green-700">{translate('api_key_active_status')}</span>
                                            </>
                                        ) : (
                                            <span className="text-stone-400">{translate('api_key_cleared_status')}</span>
                                        )}
                                    </span>
                                    {customApiKey && (
                                        <button
                                            onClick={() => {
                                                setTempKey('');
                                                onApiKeyChange?.(null);
                                            }}
                                            className="text-[0.6rem] text-red-400 hover:text-red-600 underline"
                                        >
                                            Clear Key
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default GameSettingsPanel;
