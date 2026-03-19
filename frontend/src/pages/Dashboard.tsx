import { KpiCard } from '../components/KpiCard'
import { Flame, Clock, DollarSign, AlertTriangle, ChefHat } from 'lucide-react'
import { useSimulation } from '../context/SimulationContext'
import { useLanguage } from '../context/LanguageContext'

export function Dashboard() {
  const { t } = useLanguage()
  const { activeOrders: orders, kpis } = useSimulation()
  const alerts = [
    { item: 'Pato Pekín Fresco', stock_porcentaje: 8 },
    { item: 'Salsa de Ostras', stock_porcentaje: 15 },
    { item: 'Aceite de Sésamo', stock_porcentaje: 22 }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between mb-4 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-textMuted text-sm">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full bg-black/40 border border-white/10 px-6 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-accent/10">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/80"></div>
             <span className="text-sm font-semibold text-accent">{t('dashboard.wok1Online')}</span>
          </div>
          <div className="w-full bg-black/40 border border-white/10 px-6 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-accent/10">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/80"></div>
             <span className="text-sm font-semibold text-accent">{t('dashboard.wok2Online')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <KpiCard 
          title={t('dashboard.revenue')} 
          value={`$${kpis.revenue.toLocaleString()}`} 
          trend={`+ $${kpis.tips.toLocaleString()} ${t('dashboard.tips')}`} 
          icon={<DollarSign className="w-5 h-5 text-white" />}
          delay={0}
        />
        <KpiCard 
          title={t('dashboard.topDish')} 
          value="Pato Pekín" 
          trend={`${kpis.servedCustomers} clientes top hoy`} 
          icon={<ChefHat className="w-5 h-5 text-white" />}
          delay={100}
        />
        <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-inner shadow-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-textMuted">{t('dashboard.wok1')}</h3>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${kpis.wok1Time > 0 ? 'bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse' : 'bg-white/5'}`}>
              <Flame className={`w-5 h-5 transition-colors ${kpis.wok1Time > 0 ? 'text-orange-400' : 'text-white/30'}`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">{kpis.wok1Time} {t('dashboard.min')}</p>
          <p className="text-sm font-medium mt-2 text-green-400">{kpis.wok1Time > 0 ? 'Cocinando Fuego Vivo' : 'En Reposo'}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-inner shadow-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-textMuted">{t('dashboard.wok2')}</h3>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${kpis.wok2Time > 0 ? 'bg-primary/20 shadow-[0_0_15px_rgba(227,38,54,0.3)] animate-pulse' : 'bg-white/5'}`}>
              <Clock className={`w-5 h-5 transition-colors ${kpis.wok2Time > 0 ? 'text-primary' : 'text-white/30'}`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">{kpis.wok2Time} {t('dashboard.min')}</p>
          <p className="text-sm font-medium mt-2 text-primary font-bold">{kpis.wok2Time > 0 ? 'Cocinando Alto Vacío' : 'En Reposo'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        <div className="lg:col-span-2 glass rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[400px]">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-wide">{t('dashboard.activeOrders')}</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-white rounded-full">{orders.length} {t('dashboard.ticketsWait')}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
            <table className="w-full text-left text-sm text-textMuted">
              <thead className="bg-black/20 text-xs uppercase text-textMain sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('dashboard.ticketOrigin')}</th>
                  <th className="px-6 py-4 font-medium">{t('dashboard.summary')}</th>
                  <th className="px-6 py-4 font-medium">{t('dashboard.timer')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('dashboard.channel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{order.id}</div>
                      <div className="text-xs text-accent">Mesa {order.tableId} ({order.tipo})</div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{order.items.length} Platillos</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.minutos > 15 ? 'bg-primary/20 text-primary border-primary/30 animate-pulse' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {order.minutos} {t('dashboard.min')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-textMuted uppercase tracking-wider text-xs">
                      {order.status === 'pending' ? t('orders.pending') : t('orders.served')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl border border-primary/40 overflow-hidden shadow-2xl shadow-primary/20 h-[400px] flex flex-col relative">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
          <div className="p-5 border-b border-primary/20 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-primary drop-shadow-md" />
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">{t('dashboard.inventoryCritical')}</h2>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6 relative z-10 custom-scrollbar">
            <p className="text-sm text-textMuted mb-2">{t('dashboard.inventoryWarning')}</p>
            {alerts.map((alert, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-white">{alert.item}</span>
                  <span className="font-bold text-primary">{alert.stock_porcentaje}%</span>
                </div>
                <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-primary h-2.5 rounded-full" style={{ width: `${alert.stock_porcentaje}%` }}></div>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-auto py-3 rounded-xl bg-primary/20 hover:bg-primary/40 text-white border border-primary/40 font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 flex items-center justify-center gap-2 tracking-wide mt-8">
              <ChefHat className="w-5 h-5" />
              {t('dashboard.issueOrder')}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
