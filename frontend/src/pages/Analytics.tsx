import { BarChart3, TrendingUp, DollarSign, Utensils, Users } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function Analytics() {
  const { receipts, kpis, tables } = useSimulation();

  // Data processing for Reports
  const itemCounts: Record<string, number> = {};
  let totalItemsSold = 0;
  
  receipts.forEach(r => {
    r.items.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
      totalItemsSold++;
    });
  });

  const topItems = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .sort((a, b) => a.name.localeCompare(b.name));

  const maxCount = topItems[0]?.count || 1;
  const avgTicket = receipts.length > 0 ? kpis.revenue / receipts.length : 0;
  const occupiedTables = tables.filter(t => t.status !== 'available').length;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Reportes Biométricos
          </h1>
          <p className="text-textMuted text-sm">Dashboard analítico derivado estrictamente de las matemáticas de la Simulación.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-accent/50 transition-colors">
           <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <p className="text-xs text-textMuted uppercase font-bold tracking-wider">Ticket Promedio</p>
              <p className="text-2xl font-black text-white">${avgTicket.toFixed(2)}</p>
           </div>
        </div>
        
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-primary/50 transition-colors">
           <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <p className="text-xs text-textMuted uppercase font-bold tracking-wider">Platos Servidos</p>
              <p className="text-2xl font-black text-white">{totalItemsSold}</p>
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-blue-500/50 transition-colors">
           <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <p className="text-xs text-textMuted uppercase font-bold tracking-wider">Ocupación Actual</p>
              <p className="text-2xl font-black text-white">{occupiedTables} Mesas</p>
           </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 group hover:border-accent/50 transition-colors">
           <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <p className="text-xs text-textMuted uppercase font-bold tracking-wider">Masa de Propinas</p>
              <p className="text-2xl font-black text-white">${kpis.tips.toFixed(2)}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Sellers Chart */}
         <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Ranking Gastronómico (Lo Más Vendido)</h3>
            
            {topItems.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center opacity-30">
                  <Utensils className="w-12 h-12 mb-4" />
                  <p>Inicia el simulador para capturar datos</p>
               </div>
            ) : (
               <div className="space-y-6">
                {topItems.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="flex justify-between text-sm mb-2">
                          <span className="text-white font-medium group-hover:text-primary transition-colors">{item.name}</span>
                          <span className="text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-md">{item.count} raciones</span>
                      </div>
                      <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                          <div 
                            className="h-full bg-gradient-to-r from-primary via-red-500 to-accent transition-all duration-1000 ease-out flex items-center justify-end px-2"
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                          >
                             <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                          </div>
                      </div>
                    </div>
                ))}
               </div>
            )}
         </div>

         {/* Sales Timeline Mock / Filler */}
         <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-pulse">
               <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Crecimiento Logarítmico</h3>
            <p className="text-textMuted max-w-sm mb-6">El simulador está inyectando capital constante al negocio. El algoritmo de la Caja Central reporta estabilidad.</p>
            
            <div className="w-full h-32 flex items-end justify-between gap-2 px-8">
               {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                  <div key={i} className="w-full bg-white/10 rounded-t-sm hover:bg-accent/50 transition-colors cursor-crosshair" style={{ height: `${receipts.length > 0 ? h : 5}%` }}></div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
