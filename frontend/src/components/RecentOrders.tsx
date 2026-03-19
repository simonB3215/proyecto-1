import { clsx } from 'clsx';

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  customers: { name: string; email: string };
  products: { name: string };
}

interface Props {
  orders: Order[];
}

export function RecentOrders({ orders }: Props) {
  return (
    <div className="glass p-6 rounded-2xl flex-1 flex flex-col h-full">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
        <p className="text-sm text-textMuted">Latest customer orders</p>
      </div>
      
      <div className="overflow-y-auto flex-1 min-h-[300px] pr-2 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-textMuted text-sm sticky top-0 bg-card/80 backdrop-blur-md">
              <th className="pb-3 font-medium px-4">Customer</th>
              <th className="pb-3 font-medium px-4">Amount</th>
              <th className="pb-3 font-medium px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr 
                key={order.id} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white group-hover:text-primary transition-colors text-sm">{order.customers?.name || 'Unknown'}</span>
                    <span className="text-xs text-textMuted truncate w-32">{order.products?.name || 'Product'}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-white text-sm">${order.amount?.toFixed(2) || '0.00'}</td>
                <td className="py-4 px-4 text-right">
                  <span className={clsx(
                    "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md",
                    order.status === 'COMPLETED' ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" :
                    order.status === 'PENDING' ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" :
                    "text-rose-400 bg-rose-400/10 border border-rose-400/20"
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
