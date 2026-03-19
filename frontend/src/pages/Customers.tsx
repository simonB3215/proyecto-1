import { useState, useEffect } from 'react'
import { Search, Users as UsersIcon, Star, Clock, Plus, Edit2, Trash2 } from 'lucide-react'
import { CustomerModal } from '../components/CustomerModal'
import { format } from 'date-fns'
import { useLanguage } from '../context/LanguageContext'
import { useSimulation, CUSTOMER_POOL } from '../context/SimulationContext'

export function Customers() {
  const { t } = useLanguage();
  const { receipts } = useSimulation();

  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);

  const fetchDbCustomers = async () => {
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${url}/api/customers`);
      if (res.ok) {
        const data = await res.json();
        setDbCustomers(data);
      }
    } catch (err) {
      console.warn("Backend Customers API no conectada. Simulando DB local.", err);
    }
  };

  useEffect(() => {
    fetchDbCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('customers.deleteConfirm'))) return;
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${url}/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDbCustomers(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error al borrar cliente', err);
    }
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: any) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  // Calcular métricas CRM dinámicas a partir de la simulación
  const simulatedData = CUSTOMER_POOL.map((name, index) => {
    const customerReceipts = receipts.filter(r => r.guestName === name);
    const totalSpent = customerReceipts.reduce((acc, r) => acc + r.total, 0);
    const visits = customerReceipts.length;
    
    return {
      id: `SIM-${index}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}@vip.nexus`,
      status: visits >= 3 ? 'DIAMANTE' : visits > 0 ? 'VIP' : 'PASIVO',
      totalSpent,
      visits,
      lastVisit: visits > 0 ? customerReceipts[0].timePaid.toLocaleTimeString() : 'Nunca',
      isSimulated: true,
      rawCustomer: null
    };
  });

  // Normalizar clientes reales de la base de datos
  const normalizedDb = dbCustomers.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      status: c.status === 'ACTIVE' ? 'MANUAL' : 'INACTIVO',
      totalSpent: 0,
      visits: 0,
      lastVisit: c.created_at ? format(new Date(c.created_at), 'MMM dd, yyyy') : 'Desconocido',
      isSimulated: false,
      rawCustomer: c
  }));

  // Combinar ambas Listas: Clientes de Base de Datos + Clientes I.A (Simulador)
  const customersData = [...normalizedDb, ...simulatedData]
    .filter(c => c.isSimulated === false || c.visits > 0 || c.id.includes('SIM-0') || c.id.includes('SIM-1')) // Ocultar gran cantidad de simulados pasivos para limpieza
    .sort((a, b) => a.name.localeCompare(b.name)); // Orden alfabético por Nombre

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
             <UsersIcon className="w-8 h-8 text-primary" />
             CRM Dual (IA & DB)
          </h1>
          <p className="text-textMuted text-sm">Registro de clientes manuales conectados a la API y avatares virtuales de la simulación.</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('customers.addBtn')}
        </button>
      </div>

      <div className="glass rounded-3xl border border-white/10 overflow-hidden mt-8 shadow-2xl">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input 
              type="text" 
              placeholder="Buscar por Nombre VIP..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium shadow-inner"
            />
          </div>
          <div className="px-4 py-2 bg-primary/20 text-primary font-bold rounded-xl text-xs flex items-center gap-2 tracking-wider">
             <Star className="w-4 h-4" />
             {customersData.filter(c => c.visits > 0).length} CLIENTES ACTIVOS HOY
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-textMuted whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-white font-bold tracking-widest text-xs uppercase">
              <tr>
                <th className="px-8 py-5">Perfil de Cliente</th>
                <th className="px-6 py-5">Rango (Status)</th>
                <th className="px-6 py-5 text-right">Inversión (Total)</th>
                <th className="px-6 py-5 text-center">Ticket / Útlima Vez</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customersData.map(customer => {
                 const isDiamante = customer.status === 'DIAMANTE';
                 const isVIP = customer.status === 'VIP';
                 
                 return (
                  <tr key={customer.id} className="hover:bg-white/10 transition-colors group cursor-crosshair">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${
                           isDiamante || customer.status === 'DIAMANTE' ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-cyan-500/30' : 
                           isVIP || customer.status === 'VIP' ? 'bg-gradient-to-tr from-accent to-yellow-600 text-black shadow-accent/30' : 
                           customer.status === 'MANUAL' ? 'bg-primary/20 text-primary border border-primary/20 shadow-primary/10' :
                           'bg-white/5 text-white/30 border border-white/10'
                        }`}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-bold text-base truncate ${customer.visits > 0 || !customer.isSimulated ? 'text-white' : 'text-textMuted'}`}>{customer.name}</span>
                          <span className="text-[11px] text-textMuted tracking-wider font-mono opacity-60 truncate">{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        customer.status === 'DIAMANTE' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse' :
                        customer.status === 'VIP' ? 'bg-accent/20 text-accent border-accent/30' : 
                        customer.status === 'MANUAL' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        'bg-white/5 text-white/30 border-white/10'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-5 text-right">
                       {customer.isSimulated ? (
                           <span className={`font-black tracking-tight ${customer.totalSpent > 0 ? 'text-green-400 text-lg' : 'text-white/20'}`}>
                              ${customer.totalSpent.toFixed(2)}
                           </span>
                       ) : (
                           <span className="text-white/30 text-xs tracking-wider">REGISTRO DB</span>
                       )}
                    </td>
                    
                    <td className="px-6 py-5 text-center relative">
                       {customer.isSimulated ? (
                          customer.visits > 0 ? (
                            <div className="flex flex-col items-center">
                               <div className="flex gap-1 mb-1 relative">
                                  {[...Array(Math.min(customer.visits, 5))].map((_, i) => (
                                     <div key={i} className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div>
                                  ))}
                                  {customer.visits > 5 && <span className="absolute -right-4 -top-1.5 text-[8px] font-bold text-accent">+{customer.visits - 5}</span>}
                               </div>
                               <div className="flex items-center justify-center gap-1 text-[10px] text-white/50 font-medium">
                                  <Clock className="w-3 h-3" />
                                  {customer.lastVisit}
                               </div>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-white/20">PASIVO</span>
                          )
                       ) : (
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-xl backdrop-blur-md">
                            <button 
                              onClick={() => openEditModal(customer.rawCustomer)}
                              className="p-2 text-textMuted hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(customer.id)}
                              className="p-2 text-textMuted hover:text-white bg-red-500/10 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                       )}
                    </td>
                  </tr>
                 )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customer={editingCustomer} 
        onSaved={fetchDbCustomers}
      />
    </>
  );
}
