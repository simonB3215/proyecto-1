import { Receipt as ReceiptIcon, ChefHat, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function Orders() {
  const { receipts, kpis } = useSimulation();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <ReceiptIcon className="w-8 h-8 text-primary" />
            Historial de Ventas
          </h1>
          <p className="text-textMuted text-sm">Registro de comprobantes físicos generados por las transacciones del simulador.</p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-4 rounded-3xl flex flex-col border border-accent/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <span className="text-xs text-accent font-bold uppercase mb-1">Recaudación Bruta</span>
              <span className="text-3xl font-black text-white">${kpis.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
           </div>
           <div className="glass px-6 py-4 rounded-3xl flex flex-col border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <span className="text-xs text-green-400 font-bold uppercase mb-1">Carga de Propinas</span>
              <span className="text-3xl font-black text-white">${kpis.tips.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {receipts.length === 0 ? (
           <div className="col-span-full py-32 flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-3xl shadow-inner">
              <ChefHat className="w-20 h-20 mb-6 opacity-30" />
              <p className="text-2xl font-bold tracking-tight text-white/50 mb-2">Las cajas están vacías.</p>
              <p className="text-sm font-medium">Inicia la máquina de Simulación Vip para que la gente comience a comer.</p>
           </div>
        ) : (
          [...receipts].sort((a,b) => a.guestName.localeCompare(b.guestName)).map((rec) => (
            <div key={rec.id} className="bg-[#f0eade] p-6 rounded-sm shadow-2xl relative overflow-hidden text-black font-mono text-sm group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
               {/* Ticket saw-tooth effect top */}
               <div className="absolute top-0 left-0 w-full h-[6px] bg-repeat-x flex" style={{ backgroundImage: 'radial-gradient(circle at 3px 0, transparent 4px, #f0eade 5px)', backgroundSize: '12px 6px' }}></div>
               
               <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4 mt-2">
                  <h2 className="font-black text-xl tracking-widest text-[#111]">DRAGÓN DORADO</h2>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Alta Cocina China</p>
                  <div className="mt-4 flex flex-col gap-1 items-center">
                    <p className="text-xs text-gray-600 bg-black/5 px-3 py-1 rounded-full font-bold">Ticket N° {rec.id}</p>
                    <p className="text-xs text-gray-500">{rec.timePaid.toLocaleTimeString()} • Cód. Trx: 0x{rec.id.substring(4)}</p>
                  </div>
               </div>
               
               <div className="flex justify-between font-bold mb-4 bg-gray-200 border border-gray-300 p-2 rounded">
                  <span className="uppercase text-gray-700">Mesa {rec.tableId}</span>
                  <span>{rec.guestName}</span>
               </div>

               <div className="flex flex-col space-y-3 mb-6 min-h-[100px]">
                 {rec.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                       <span className="truncate pr-4 text-gray-800">1x {item}</span>
                       <span className="text-gray-500">Auto</span>
                    </div>
                 ))}
               </div>

               <div className="border-t-2 border-dashed border-gray-400 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600 font-medium">
                     <span>Subtotal Consumos</span>
                     <span>${rec.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                     <span>Gratuidad Propina (15%)</span>
                     <span>${rec.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl mt-3 pt-3 border-t-2 border-gray-400 text-green-700">
                     <span>TOTAL VENTA</span>
                     <span>${rec.total.toFixed(2)}</span>
                  </div>
               </div>
               
               <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
                 <CheckCircle2 className="w-8 h-8 text-black" />
                 <span className="text-[10px] font-bold tracking-widest uppercase">Pagado • ¡Vuelva Pronto!</span>
               </div>

               {/* Ticket saw-tooth effect bottom */}
               <div className="absolute bottom-0 left-0 w-full h-[6px] bg-repeat-x" style={{ backgroundImage: 'radial-gradient(circle at 3px 6px, transparent 4px, #f0eade 5px)', backgroundSize: '12px 6px', backgroundPosition: '0 bottom' }}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
