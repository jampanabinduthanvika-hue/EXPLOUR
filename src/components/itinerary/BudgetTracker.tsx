import React from 'react';
import { IndianRupee, PieChart, AlertCircle, CheckCircle2, TrendingUp, Bus, Utensils, Ticket, Shield } from 'lucide-react';
import { BudgetBreakdown } from '../../types';

interface BudgetTrackerProps {
  breakdown: BudgetBreakdown;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ breakdown }) => {
  const isOverBudget = breakdown.totalEstimatedSpend > breakdown.totalBudget;
  const isCloseToBudget = breakdown.percentageUsed > 85;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            Budget Intelligence Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated cost forecasting across entry tickets, transport, food & safety buffers
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Total Budget</div>
          <div className="text-lg font-extrabold text-white">
            ₹{breakdown.totalBudget.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">
            Estimated Spend: ₹{breakdown.totalEstimatedSpend.toLocaleString('en-IN')}
          </span>
          <span className={isOverBudget ? 'text-rose-400' : isCloseToBudget ? 'text-amber-400' : 'text-emerald-400'}>
            {breakdown.percentageUsed}% Utilized
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-rose-500'
                : isCloseToBudget
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-blue-500 to-emerald-500'
            }`}
            style={{ width: `${Math.min(100, breakdown.percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Ticket className="w-3.5 h-3.5 text-blue-400" /> Attractions
          </div>
          <div className="text-sm font-bold text-white">
            ₹{breakdown.attractionsCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Bus className="w-3.5 h-3.5 text-amber-400" /> Transport
          </div>
          <div className="text-sm font-bold text-white">
            ₹{breakdown.transportCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Utensils className="w-3.5 h-3.5 text-emerald-400" /> Meals & Snacks
          </div>
          <div className="text-sm font-bold text-white">
            ₹{breakdown.foodCost.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Shield className="w-3.5 h-3.5 text-purple-400" /> Buffer & Savings
          </div>
          <div className="text-sm font-bold text-emerald-400">
            ₹{breakdown.remainingBudget.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Daily Spending Distribution */}
      {breakdown.dailySpend.length > 0 && (
        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold uppercase text-slate-400 mb-2.5">
            Day-Wise Estimated Outlay
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {breakdown.dailySpend.map((d) => (
              <div
                key={d.day}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs"
              >
                <span className="font-medium text-slate-300">Day {d.day}</span>
                <span className="font-bold text-white">₹{d.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status banner */}
      <div
        className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
          isOverBudget
            ? 'bg-rose-950/40 border border-rose-800/50 text-rose-300'
            : 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-300'
        }`}
      >
        {isOverBudget ? (
          <>
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Budget exceeded! Use Dynamic Replanning below to optimize your itinerary.</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Itinerary perfectly balanced within budget. You have ₹{breakdown.remainingBudget.toLocaleString('en-IN')} remaining for shopping and souvenirs.
            </span>
          </>
        )}
      </div>
    </div>
  );
};
