import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Products } from './pages/Products'
import { Customers } from './pages/Customers'
import { Reservations } from './pages/Reservations'
import { Orders } from './pages/Orders'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { SimulationProvider } from './context/SimulationContext'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-white h-[60vh] animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center mb-6 shadow-[inset_0px_0px_20px_rgba(59,130,246,0.2)]">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">?</span>
      </div>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">{title}</h2>
      <p className="text-textMuted text-center max-w-sm">
        This section is currently under development. Check back soon for updates!
      </p>
    </div>
  )
}

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    
    if (location.pathname === '/' && location.hash === '#menu-interactivo') {
      setTimeout(() => {
        const el = document.getElementById('menu-interactivo');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          setScrolled(true);
        }
      }, 100);
    } else {
      setScrolled(false);
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
    }
  }, [location.pathname, location.hash]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (!isHomePage) return;
    const target = e.target as HTMLElement;
    // Ocultaremos la barra lateral hasta cruzar el 60% inicial de la pantalla
    const isPastHero = target.scrollTop > (window.innerHeight * 0.6);
    if (scrolled !== isPastHero) {
      setScrolled(isPastHero);
    }
  };

  const hideSidebar = isHomePage && !scrolled;

  return (
    <div className="flex h-screen overflow-hidden text-textMain bg-background">
      <Sidebar isCollapsed={hideSidebar} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />
        <Header isCollapsed={hideSidebar} setMobileMenuOpen={setMobileMenuOpen} />
        
        <main ref={mainRef} onScroll={handleScroll} className="p-4 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Placeholder title="Page Not Found" />} />
          </Routes>
        </main>
      </div>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noreferrer"
        className={clsx(
          "fixed right-8 z-[100] w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-500 group",
          hideSidebar ? "-bottom-24 opacity-0 scale-50" : "bottom-8 opacity-100 hover:scale-110"
        )}
        title="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-9 h-9 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SimulationProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </SimulationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
