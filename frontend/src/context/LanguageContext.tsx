import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('es');

  const toggleLanguage = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
         value = value[k];
      } else {
         return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
