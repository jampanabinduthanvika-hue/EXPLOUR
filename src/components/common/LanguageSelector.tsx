import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { changeLanguage } from '../../i18n/i18n';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  ];

  return (
    <div className="relative inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
      <Languages className="w-3.5 h-3.5 text-blue-400" />
      <select
        value={i18n.language.substring(0, 2)}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer focus:ring-0 pr-1"
        aria-label="Select Language"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
            {l.native}
          </option>
        ))}
      </select>
    </div>
  );
};
