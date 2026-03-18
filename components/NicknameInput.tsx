import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';

interface NicknameInputProps {
  onSubmit: (nickname: string) => void;
  initialNickname?: string | null;
}

const NicknameInput: React.FC<NicknameInputProps> = ({ onSubmit, initialNickname }) => {
  const { translate, language, availableLanguages } = useLanguage();
  const [nickname, setNickname] = useState(initialNickname || '');

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  useEffect(() => {
    if (initialNickname) setNickname(initialNickname);
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-950 via-stone-900 to-orange-950 text-stone-100 ${selectedLanguageFontClass}`}>

      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md flex flex-col gap-6">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <p className="text-[0.65rem] font-mono tracking-[0.25em] uppercase text-orange-400/70">
            VoidPrakash Presents
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-orange-100">
            DharmaYatra <span className="text-orange-400">101</span>
          </h1>
          <p className="text-base sm:text-lg italic text-stone-300 font-light leading-snug">
            {translate('app_tagline')}
          </p>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
            {translate('app_subheading')}
          </p>
        </div>

        {/* What this is */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 space-y-2 text-sm text-stone-300">
          <p className="text-xs font-mono uppercase tracking-widest text-orange-400/80 mb-1">What this is</p>
          <p className="leading-relaxed">A reimagined Snakes &amp; Ladders experience where:</p>
          <ul className="space-y-1 pl-3">
            {[
              'Every square carries meaning',
              'Every move triggers reflection',
              'The journey responds to you',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core line */}
        <div className="text-center">
          <p className="text-sm italic text-orange-200/70">
            "{translate('app_core_line')}"
          </p>
        </div>

        {/* Name Input Card */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-orange-400/20 rounded-2xl p-6 space-y-4 backdrop-blur-sm shadow-2xl">
          <div>
            <label htmlFor="nickname-input" className="block text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">
              {translate('nickname_label')}
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(toTitleCase(e.target.value))}
              placeholder={translate('nickname_placeholder')}
              required
              autoFocus
              className="w-full px-4 py-3 bg-stone-900/60 border border-stone-600 rounded-xl text-stone-100 placeholder-stone-500 text-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 transition-all"
            />
            <p className="mt-2 text-[0.7rem] text-stone-500">
              {translate('nickname_description')}
            </p>
          </div>
          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg transition-all duration-200 text-base disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {translate('nickname_proceed_button')}
          </button>
        </form>

        {/* Genius Touch — PanchVedi hint (subtle, not announcing) */}
        <p className="text-center text-[0.65rem] text-stone-500 italic">
          {translate('genius_touch_line')}
        </p>

        {/* Soft Disclaimer */}
        <p className="text-center text-[0.6rem] text-stone-600 max-w-xs mx-auto leading-relaxed">
          {translate('legal_disclaimer_content')}
        </p>

      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-[0.6rem] text-stone-700 space-y-1">
        <p>&copy; {new Date().getFullYear()} VoidPrakash · DharmaYatra 101 · All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default NicknameInput;