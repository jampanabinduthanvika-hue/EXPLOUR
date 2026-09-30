import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, IndianRupee, Calendar, Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { useItineraryStore } from '../../store/useItineraryStore';
import { TransportPreference } from '../../types';

interface DynamicReplannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DynamicReplannerModal: React.FC<DynamicReplannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentItinerary, applyReplanning, isGenerating, replanningHistory } = useItineraryStore();

  const [budget, setBudget] = useState(currentItinerary?.total_budget || 5000);
  const [days, setDays] = useState<1 | 2 | 3>(
    (currentItinerary?.number_of_days as 1 | 2 | 3) || 2
  );

  if (!isOpen || !currentItinerary) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await applyReplanning(budget, days);
    onClose();
  };

  const budgetPresets = [
    { label: 'Budget Saver', amount: Math.round(currentItinerary.total_budget * 0.7) },
    { label: 'Moderate', amount: currentItinerary.total_budget },
    { label: 'Comfort / Premium', amount: Math.round(currentItinerary.total_budget * 1.4) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Dynamic Context Replanner</h3>
            <p className="text-xs text-slate-400">
              Modify budget or duration. Explour algorithm recalculates route, transport and timings in real-time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target Budget Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-300 flex items-center justify-between">
              <span>Adjusted Target Budget</span>
              <span className="text-blue-400 font-bold font-mono">₹{budget.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min={1500}
              max={30000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex gap-2 pt-1">
              {budgetPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setBudget(preset.amount)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                    budget === preset.amount
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}: ₹{preset.amount.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-300">
              Trip Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDays(d as 1 | 2 | 3)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    days === d
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {d} Day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Replanning Explanation Box */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2 text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Automated Rebalancing Engine
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If budget is reduced, high-fare private cabs are automatically switched to metro/public transport, and entry ticket fees are optimized to prevent debt while keeping highest-ranked attractions intact.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply & Replan
                </>
              )}
            </button>
          </div>
        </form>

        {/* History of recent replanning adjustments */}
        {replanningHistory.length > 0 && (
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="text-xs font-semibold uppercase text-slate-400">Recent Replanning Audit</div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {replanningHistory.map((adj, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{adj.summary}</span>
                    <span className="text-emerald-400">Saved ₹{adj.savedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <ul className="text-slate-400 list-disc list-inside">
                    {adj.changes.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
