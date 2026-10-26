import React from 'react';
import { DollarSign, Home, Utensils, Compass, Bus, ShieldAlert } from 'lucide-react';
import { BudgetBreakdown } from '../types/trip';

interface BudgetOverviewProps {
  budget: BudgetBreakdown;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget }) => {
  const totalSafe = budget.total > 0 ? budget.total : 1;
  const categories = [
    { label: 'Lodging & Stays', amount: budget.accommodation, icon: Home, color: 'bg-blue-500', pct: Math.round((budget.accommodation / totalSafe) * 100) },
    { label: 'Food & Dining', amount: budget.food, icon: Utensils, color: 'bg-teal-500', pct: Math.round((budget.food / totalSafe) * 100) },
    { label: 'Experiences & Tours', amount: budget.activities, icon: Compass, color: 'bg-emerald-500', pct: Math.round((budget.activities / totalSafe) * 100) },
    { label: 'Local Transit', amount: budget.transportation, icon: Bus, color: 'bg-indigo-500', pct: Math.round((budget.transportation / totalSafe) * 100) },
    { label: 'Contingency Buffer', amount: budget.buffer, icon: ShieldAlert, color: 'bg-amber-500', pct: Math.round((budget.buffer / totalSafe) * 100) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Estimated Budget Breakdown</h3>
            <p className="text-[11px] text-slate-500">Realistic per-group forecast</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Est.</span>
          <span className="text-base font-extrabold text-slate-900">
            {budget.currency} {budget.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-100 flex overflow-hidden">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`${c.color} transition-all duration-300`}
            style={{ width: `${c.pct}%` }}
            title={`${c.label}: ${c.pct}%`}
          />
        ))}
      </div>

      {/* Breakdown Items */}
      <div className="space-y-2.5 pt-1 text-xs">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${c.color}`} />
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 font-medium">{c.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">
                  {budget.currency} {c.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">({c.pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
