import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, BarChart3, Package, CalendarDays } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const getNavItems = (t: any) => [
  { icon: Package, label: t('nav.menu'), path: '/#menu-interactivo' },
  { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard' },
  { icon: CalendarDays, label: t('nav.reservations'), path: '/reservations' },
  { icon: ShoppingCart, label: t('nav.orders'), path: '/orders' },
  { icon: Users, label: t('nav.customers'), path: '/customers' },
  { icon: BarChart3, label: t('nav.analytics'), path: '/analytics' },
  { icon: Settings, label: t('nav.settings'), path: '/settings' },
];

export function Sidebar({ isCollapsed = false, mobileMenuOpen = false, setMobileMenuOpen }: { isCollapsed?: boolean, mobileMenuOpen?: boolean, setMobileMenuOpen?: (open: boolean) => void }) {
  const location = useLocation();
  const { t } = useLanguage();
  const navItems = getNavItems(t);

  return (
    <>
      {/* Overlay Móvil */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}
      
      <aside className={clsx(
        "glass flex flex-col h-[100dvh] transition-all duration-700 ease-in-out overflow-hidden shrink-0 border-r border-white/10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]",
        // Comportamiento móvil (Drawer absolute/fixed)
        "fixed inset-y-0 left-0 z-[60] w-64",
        mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0",
        // Comportamiento Desktop (Sticky normal)
        "md:relative md:z-50",
        isCollapsed ? "md:w-0 md:opacity-0 md:-translate-x-full" : "md:w-64 md:translate-x-0 md:opacity-100"
      )}>
      <Link 
        to="/"
        onClick={() => {
          if (location.pathname === '/' && location.hash === '') {
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
          }
          setMobileMenuOpen?.(false);
        }}
        className="h-16 w-full flex items-center justify-center border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors group px-2"
      >
        <div className="flex flex-col items-center justify-center w-full">
          <span className="text-[1.1rem] md:text-[1.2rem] font-serif font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#D97706] via-[#FDE047] to-[#B45309] tracking-[0.12em] uppercase text-center whitespace-nowrap drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)] group-hover:text-white transition-all duration-700">
            Dragón Dorado
          </span>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#D97706] to-transparent mt-1.5 opacity-60 group-hover:w-20 transition-all duration-700 block"></div>
        </div>
      </Link>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => {
                if (item.path === '/#menu-interactivo') {
                  if (location.pathname === '/') {
                    document.getElementById('menu-interactivo')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }
                setMobileMenuOpen?.(false);
              }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary/20 text-primary shadow-[inset_0px_0px_20px_rgba(59,130,246,0.1)] border border-primary/20" 
                  : "text-textMuted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={clsx("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-textMuted hover:bg-white/5 hover:text-white transition-all duration-300">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
