import React from 'react';
import { Check, Clock, RotateCcw, MoreVertical } from 'lucide-react';

export function SalesTransactionsWidget({ data }) {
  const { transactions = [] } = data;

  const statusConfig = {
    completed: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Check, label: 'Completed' },
    pending: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'Pending' },
    refunded: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: RotateCcw, label: 'Refunded' },
  };

  return (
    <div className="h-full overflow-y-auto pr-1 select-none scrollbar-thin flex flex-col">
      <div className="w-full min-w-[700px]">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-2 bg-bg-primary/20 border-b border-border text-[10px] text-text-muted font-medium uppercase tracking-wider select-none shrink-0">
          <div className="w-24 shrink-0">ID</div>
          <div className="w-40 shrink-0">Customer</div>
          <div className="flex-1">Product</div>
          <div className="w-28 shrink-0">Status</div>
          <div className="w-16 shrink-0 text-right">Qty</div>
          <div className="w-8 shrink-0"></div>
        </div>

        {/* Rows */}
        {transactions.map((tx, i) => {
          const status = statusConfig[tx.status.toLowerCase()] || statusConfig.completed;
          const Icon = status.icon;

          return (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-2.5 border-b border-border last:border-0 hover:bg-bg-hover/10 transition-colors"
            >
              {/* ID */}
              <div className="w-24 shrink-0 text-xs font-mono font-medium text-text-primary">
                {tx.id}
              </div>

              {/* Customer */}
              <div className="w-40 shrink-0 text-xs font-medium text-text-secondary truncate">
                {tx.customer}
              </div>

              {/* Product */}
              <div className="flex-1 text-xs text-text-muted truncate pr-4">
                {tx.product}
              </div>

              {/* Status */}
              <div className="w-28 shrink-0">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                  <Icon size={10} />
                  {status.label}
                </span>
              </div>

              {/* Qty */}
              <div className="w-16 shrink-0 text-xs font-mono font-medium text-text-secondary text-right tabular-nums">
                {tx.qty}
              </div>

              {/* Actions */}
              <div className="w-8 shrink-0 flex justify-end">
                <button className="p-1 rounded hover:bg-bg-hover text-text-muted shrink-0">
                  <MoreVertical size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
