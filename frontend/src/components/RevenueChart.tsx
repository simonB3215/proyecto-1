import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
}

interface Props {
  data: RevenueData[];
}

export function RevenueChart({ data }: Props) {
  return (
    <div className="glass p-6 rounded-2xl h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
          <p className="text-sm text-textMuted">Daily revenue performance</p>
        </div>
        <select className="bg-background border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-primary">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div className="flex-1 min-h-[0]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff10', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
