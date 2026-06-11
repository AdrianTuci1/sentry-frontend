import React from 'react';

export function CampaignRoiWidget({ data }) {
  const { spend = 43000, revenue = 212000, roas = 4.94, spendPercent = 20, returnPercent = 80, retained = 169000 } = data;

  return (
    <div className="h-full p-4 flex flex-col justify-between select-none">
      {/* 3 Metric columns */}
      <div className="grid grid-cols-3 gap-2 border-b border-border pb-3 shrink-0">
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Spend</span>
          <span className="text-sm font-semibold text-text-primary block mt-1 tabular-nums">${(spend / 1000).toFixed(0)}K</span>
        </div>
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Revenue</span>
          <span className="text-sm font-semibold text-text-primary block mt-1 tabular-nums">${(revenue / 1000).toFixed(0)}K</span>
        </div>
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">ROAS</span>
          <span className="text-sm font-semibold text-text-primary block mt-1 tabular-nums">{roas.toFixed(2)}x</span>
        </div>
      </div>

      {/* Progress bar mix */}
      <div className="flex flex-col gap-1.5 my-3 shrink-0">
        <div className="flex justify-between text-[10px] text-text-muted font-medium">
          <span>Spend vs return mix</span>
          <span>{spendPercent}% / {returnPercent}%</span>
        </div>
        <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden flex">
          {/* Spend fraction */}
          <div className="h-full bg-text-muted" style={{ width: `${spendPercent}%` }} />
          {/* Return fraction */}
          <div className="h-full bg-text-primary" style={{ width: `${returnPercent}%` }} />
        </div>
      </div>

      {/* Bottom detailed rows */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0" />
            <span className="text-text-secondary">Ad spend</span>
          </div>
          <span className="text-text-primary font-mono font-medium tabular-nums">${spend.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary shrink-0" />
            <span className="text-text-secondary">Revenue retained</span>
          </div>
          <span className="text-text-primary font-mono font-medium tabular-nums">${retained.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
