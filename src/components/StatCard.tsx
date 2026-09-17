import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

interface StatCardProps {
  title: string;
  value: number;         // Always a plain number — formatting is done here
  prefix?: string;       // e.g. "₹"
  subtitle: string;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  duration?: number;     // animation duration in ms
}

export const StatCard: React.FC<StatCardProps> = ({
  title, value, prefix = '', subtitle, icon,
  color = 'bg-teal-50', trend, duration = 1400
}) => {
  const animated = useCountUp(value, duration);

  const formatted = prefix === '₹'
    ? `₹${animated.toLocaleString('en-IN')}`
    : animated.toLocaleString();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>

      {/* Animated count value */}
      <div className="text-3xl font-bold text-gray-900 mb-1 font-mono tracking-tight tabular-nums">
        {formatted}
      </div>

      <div className="text-sm font-medium text-gray-700 mb-0.5">{title}</div>
      <div className="text-xs text-gray-400">{subtitle}</div>
    </div>
  );
};
