import { Globe, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export function Settings() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            {t('settings.title')}
          </h1>
          <p className="text-textMuted text-sm">{t('settings.subtitle')}</p>
        </div>
      </div>

      <div className="glass p-6 md:p-10 rounded-3xl border border-white/10 shadow-xl space-y-10">
        
        {/* Language Module */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-accent" />
            {t('settings.language')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => lang !== 'es' && toggleLanguage()}
              className={`flex-1 py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                lang === 'es' ? 'border-primary bg-primary/10 text-white scale-[1.02]' : 'border-white/10 bg-black/20 text-textMuted hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <span className="text-4xl drop-shadow-md">🇪🇸</span>
              <span className="font-bold tracking-wide">{t('settings.es')}</span>
            </button>
            <button 
              onClick={() => lang !== 'en' && toggleLanguage()}
              className={`flex-1 py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                lang === 'en' ? 'border-accent bg-accent/10 text-white scale-[1.02]' : 'border-white/10 bg-black/20 text-textMuted hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <span className="text-4xl drop-shadow-md">🇬🇧</span>
              <span className="font-bold tracking-wide">{t('settings.en')}</span>
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-white/10"></div>

        {/* Theme Module */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-6 h-6 text-blue-400" /> : <Sun className="w-6 h-6 text-amber-500" />}
            {t('settings.theme')}
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex-1 py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                theme === 'dark' ? 'border-blue-500 bg-blue-500/10 text-white scale-[1.02]' : 'border-white/10 bg-black/20 text-textMuted hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-textMuted'}`} />
              </div>
              <span className="font-bold tracking-wide">{t('settings.dark')}</span>
            </button>
            <button 
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex-1 py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 shadow-lg ${
                theme === 'light' ? 'border-amber-500 bg-amber-500/10 text-white scale-[1.02]' : 'border-white/10 bg-white/5 text-textMuted hover:border-black/30 hover:bg-black/5'
              }`}
            >
              <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-amber-500/20' : 'bg-black/10'}`}>
                <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-amber-500' : 'text-textMuted'}`} />
              </div>
              <span className="font-bold tracking-wide text-black dark:text-white">{t('settings.light')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
