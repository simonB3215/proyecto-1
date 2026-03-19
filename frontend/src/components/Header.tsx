import { Search, Bell, User, Menu, Play, Square, RotateCcw, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSimulation } from '../context/SimulationContext';
import { clsx } from 'clsx';

export function Header({ isCollapsed = false, setMobileMenuOpen }: { isCollapsed?: boolean, setMobileMenuOpen?: (open: boolean) => void }) {
  const { t, lang, toggleLanguage } = useLanguage();
  const { isRunning, startSimulation, stopSimulation, resetSimulation } = useSimulation();

  return (
    <header className={clsx(
      "glass sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 border-b border-white/10 transition-all duration-700 ease-in-out overflow-hidden origin-top",
      isCollapsed ? "h-0 opacity-0 -translate-y-full border-none py-0" : "h-16 opacity-100 translate-y-0 py-4"
    )}>
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => setMobileMenuOpen?.(true)}
          className="md:hidden p-2 text-textMuted hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-4 bg-background/50 border border-white/10 rounded-full px-4 py-2 w-64 lg:w-96 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50">
          <Search className="w-4 h-4 text-textMuted" />
          <input 
            type="text" 
            placeholder={t('header.search')}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-textMuted"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <button 
           onClick={toggleLanguage}
           className="flex items-center gap-1.5 text-textMuted hover:text-white transition-colors p-1 md:p-0"
           title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-bold uppercase hidden md:block pt-0.5">{lang}</span>
        </button>

        <button className="relative text-textMuted hover:text-white transition-colors p-1 md:p-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.6)]"></span>
        </button>
        
        {/* Simulador Admin Panel */}
        <div className="flex items-center gap-2 pr-4 mr-2 hidden md:flex border-r border-white/10">
          {isRunning ? (
            <button onClick={stopSimulation} className="p-2 mx-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button onClick={startSimulation} className="p-2 mx-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            </button>
          )}
          <button onClick={resetSimulation} className="p-2 text-textMuted hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="flex flex-col ml-2">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{isRunning ? 'En vivo' : 'Detenido'}</span>
            <span className="text-xs text-white/50">Simulador IA</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pl-2 md:pl-6 border-l md:border-none border-white/10 cursor-pointer group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-lg group-Hover:shadow-primary/50 transition-all duration-300">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{t('header.admin')}</span>
            <span className="text-xs text-textMuted">admin@nexus.dev</span>
          </div>
        </div>
      </div>
    </header>
  );
}
