import React, { useState } from 'react';
import { CheckSquare, Square, Luggage, Lightbulb, CloudSun } from 'lucide-react';

interface PackingListProps {
  packingTips: string[];
  localTips: string[];
  weatherAdvice?: string;
}

export const PackingList: React.FC<PackingListProps> = ({ packingTips, localTips, weatherAdvice }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
      {/* Weather Alert */}
      {weatherAdvice && (
        <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start space-x-2.5 text-xs text-sky-900">
          <CloudSun className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sky-950">Expected Weather:</span>
            <span>{weatherAdvice}</span>
          </div>
        </div>
      )}

      {/* Packing Checklist */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Luggage className="w-4 h-4 text-teal-600" />
          <h4 className="font-bold text-sm text-slate-900">Smart Packing Checklist</h4>
        </div>
        <div className="space-y-2 text-xs">
          {packingTips.map((tip, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-start space-x-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                  isChecked ? 'bg-slate-50 text-slate-400 line-through' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{tip}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Insider Tips */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h4 className="font-bold text-sm text-slate-900">Local Insider Tips</h4>
        </div>
        <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
          {localTips.map((tip, idx) => (
            <li key={idx} className="leading-relaxed">
              <span className="text-slate-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
