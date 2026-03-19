import { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle2, Coffee, DollarSign } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function Reservations() {
  const { tables, isRunning, waitingQueue } = useSimulation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Mapa Dinámico</h1>
          <p className="text-textMuted text-sm">Radar topográfico de asignación de mesas en tiempo real.</p>
        </div>
        
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-6 border border-accent/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <div className="flex items-center gap-3">
             <div className="relative">
                <Users className="w-5 h-5 text-blue-400" />
                {waitingQueue > 0 && (
                   <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-[10px] font-bold flex items-center justify-center rounded-full text-white animate-bounce">{waitingQueue}</span>
                )}
             </div>
             <div className="flex flex-col">
               <span className="text-xs text-textMuted font-medium tracking-wider uppercase">Fila Exterior</span>
               <span className="text-sm font-bold text-white">{waitingQueue} Clientes</span>
             </div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 text-accent ${isRunning ? 'animate-pulse' : ''}`} />
            <div className="flex flex-col">
              <span className="text-xs text-textMuted font-medium tracking-wider uppercase">Reloj Maestro</span>
              <span className="text-xl font-bold text-white tracking-widest">
                {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl space-y-8 relative overflow-hidden">
        {/* Leyenda Visual */}
        <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/5">
           <div className="flex items-center gap-2 text-sm text-textMuted"><div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500"></div> Libre</div>
           <div className="flex items-center gap-2 text-sm text-textMuted"><div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"></div> Charlando</div>
           <div className="flex items-center gap-2 text-sm text-textMuted"><div className="w-3 h-3 rounded-full bg-orange-500/50 border border-orange-500"></div> Comiendo</div>
           <div className="flex items-center gap-2 text-sm text-textMuted"><div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500"></div> Facturando</div>
        </div>

        {/* Mapa de Mesas */}
        <div className="bg-black/20 p-4 md:p-8 rounded-2xl border border-white/5 relative">
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/10 m-2 pointer-events-none"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 relative z-10">
            {tables.map(table => {
              const available = table.status === 'available';
              const isEating = table.status === 'eating';
              const isPaying = table.status === 'paying';
              const occupied = table.status === 'occupied';
              
              let borderColor = 'border-green-500/30';
              let bgColor = 'bg-green-500/10';
              let textAccent = 'text-green-400';
              let Icon = CheckCircle2;
              let statusText = 'Libre';

              if (occupied) {
                borderColor = 'border-red-500/40'; bgColor = 'bg-red-500/20'; textAccent = 'text-red-400';
                Icon = Users; statusText = 'Esperando Platos';
              } else if (isEating) {
                borderColor = 'border-orange-500/50'; bgColor = 'bg-orange-500/20'; textAccent = 'text-orange-400';
                Icon = Coffee; statusText = 'Degustando';
              } else if (isPaying) {
                borderColor = 'border-blue-500/50'; bgColor = 'bg-blue-500/20'; textAccent = 'text-blue-400';
                Icon = DollarSign; statusText = 'Gestión Ticket';
              }

              return (
                <div
                  key={table.id}
                  className={`relative p-4 md:p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center min-h-[160px] shadow-lg ${borderColor} ${bgColor}`}
                >
                  {table.isVip && (
                    <span className="absolute top-2 right-2 text-[9px] font-black tracking-widest text-black bg-gradient-to-r from-yellow-300 to-accent px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      VIP
                    </span>
                  )}
                  
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 border-4 transition-colors duration-500 ${borderColor} bg-black/40`}>
                    <span className={`text-lg md:text-xl font-bold ${available ? 'text-white' : textAccent}`}>{table.id}</span>
                  </div>
                  
                  {available ? (
                     <div className="flex items-center gap-2 text-xs md:text-sm text-textMuted mt-1">
                       <Users className="w-3 h-3 md:w-4 md:h-4" />
                       <span>{table.capacity} asientos</span>
                     </div>
                  ) : (
                    <div className="text-center flex flex-col items-center w-full">
                      <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 truncate w-full px-2 ${textAccent}`}>{statusText}</span>
                      <span className="text-xs text-white font-medium truncate w-full px-1">{table.guestName}</span>
                      <div className={`mt-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-black/40 ${textAccent}`}>
                        <Icon className="w-3 h-3" />
                        <span className="font-bold">{table.timer} min</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
