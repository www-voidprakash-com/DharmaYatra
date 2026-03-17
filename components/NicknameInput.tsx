import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App'; // Assuming App.tsx exports useLanguage

interface NicknameInputProps {
  onSubmit: (nickname: string) => void;
  initialNickname?: string | null;
}

const NicknameInput: React.FC<NicknameInputProps> = ({ onSubmit, initialNickname }) => {
  const { translate, language, availableLanguages } = useLanguage();
  const [nickname, setNickname] = useState(initialNickname || '');

  // Helper: Title Case
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  useEffect(() => {
    if (initialNickname) {
      setNickname(initialNickname);
    }
  }, [initialNickname]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    if (trimmedNickname) {
      localStorage.setItem('dharmayatra_nickname', trimmedNickname);
      onSubmit(trimmedNickname);
    }
  };

  const selectedLanguageFontClass = availableLanguages.find(l => l.code === language)?.fontClass || 'font-noto-sans';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 text-stone-700 ${selectedLanguageFontClass}`}>
      <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-orange-200 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 text-center mb-6 sm:mb-8">
          {translate('nickname_title')}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname-input" className="block text-sm font-medium text-stone-700 mb-1">
              {translate('nickname_label')}
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(toTitleCase(e.target.value))}
              placeholder={translate('nickname_placeholder')}
              required
              className="mt-1 w-full p-3 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-white text-lg"
              aria-describedby="nickname-help"
            />
            <p id="nickname-help" className="mt-2 text-xs text-stone-500">
              {translate('nickname_description')}
            </p>
          </div>
          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-colors duration-150 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {translate('nickname_proceed_button')}
          </button>
        </form>
      </div>
      <footer className="mt-8 text-center text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} DharmaYatra Team. Inspired by ancient wisdom.</p>
      </footer>
    </div>
  );
};

export default NicknameInput;