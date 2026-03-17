import React from 'react';
import { useLanguage } from '../App';

const LegalFooter: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <footer className="w-full mt-12 py-8 bg-black/40 backdrop-blur-md border-t border-white/10 text-stone-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Core Copyright & Builder Info */}
        <div className="flex flex-col items-center text-center space-y-1">
          <p className="text-lg font-semibold tracking-wide text-orange-200 uppercase">
            {translate('legal_rights_text')}
          </p>
          <p className="text-sm opacity-80">
            {translate('legal_copyright_text')}
          </p>
          <p className="text-xs italic text-orange-400 opacity-90">
            {translate('built_by_text')}
          </p>
        </div>

        {/* Disclaimer Box */}
        <div className="max-w-xl p-4 bg-white/5 rounded-xl border border-white/5 text-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
            {translate('legal_disclaimer_title')}
          </h4>
          <p className="text-[0.7rem] sm:text-xs leading-relaxed opacity-70">
            {translate('legal_disclaimer_content')}
          </p>
        </div>

        {/* Secondary Links */}
        <div className="flex gap-6 text-[0.65rem] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
          <a href="#" className="hover:text-orange-400 transition-colors cursor-pointer">{translate('privacy_policy_label')}</a>
          <a href="#" className="hover:text-orange-400 transition-colors cursor-pointer">{translate('terms_of_service_label')}</a>
        </div>

        {/* Version / Build Marker */}
        <div className="text-[0.6rem] opacity-30">
          v1.0.2-prod | Managed by VoidPrakash
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;
