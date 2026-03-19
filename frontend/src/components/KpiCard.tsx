import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  icon: ReactNode;
  delay?: number;
}

export function KpiCard({ title, value, trend, isPositive = true, icon, delay = 0 }: KpiCardProps) {
  return (
    <div 
      className="glass p-6 rounded-2xl hover-lift flex flex-col justify-between"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 group-hover:border-primary/30 transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md",
            isPositive ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-textMuted text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
      </div>
    </div>
  );
}
