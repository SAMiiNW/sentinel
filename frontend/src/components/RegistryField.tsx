'use client';

import { useMemo, useState } from 'react';
import { Layers } from 'lucide-react';
import type { Policy } from '@/lib/contract';
import { PolicyPanel } from './PolicyPanel';
import { Skeleton, EmptyState, ErrorState } from './States';

type Filter = 'ALL' | 'PENDING' | 'COMPLIANT' | 'FLAGGED' | 'BLOCKED';

interface Props {
  policies: Policy[];
  loading: boolean;
  error: string | null;
  total: number;
  onRetry: () => void;
  onOpen: () => void;
  onCheck: (p: Policy) => void;
}

// The registry is an off-grid field: a vertical filter stub clings to the left
// edge while policy panels stagger down the right in alternating indents and
// mixed widths. Deliberately not a uniform card grid.
export function RegistryField({
  policies,
  loading,
  error,
  total,
  onRetry,
  onOpen,
  onCheck,
}: Props) {
  const [filter, setFilter] = useState<Filter>('ALL');

  const sorted = useMemo(() => [...policies].sort((a, b) => b.index - a.index), [policies]);

  const counts = useMemo(() => {
    const ruled = policies.filter((p) => p.checks > 0);
    return {
      all: total,
      pending: policies.filter((p) => p.checks === 0).length,
      compliant: ruled.filter((p) => p.last_ruling === 'COMPLIANT').length,
      flagged: ruled.filter((p) => p.last_ruling === 'FLAGGED').length,
      blocked: ruled.filter((p) => p.last_ruling === 'BLOCKED').length,
    };
  }, [policies, total]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return sorted;
    if (filter === 'PENDING') return sorted.filter((p) => p.checks === 0);
    return sorted.filter((p) => p.checks > 0 && p.last_ruling === filter);
  }, [sorted, filter]);

  const filters: { key: Filter; label: string; n: number }[] = [
    { key: 'ALL', label: 'All', n: counts.all },
    { key: 'PENDING', label: 'Awaiting', n: counts.pending },
    { key: 'COMPLIANT', label: 'Compliant', n: counts.compliant },
    { key: 'FLAGGED', label: 'Flagged', n: counts.flagged },
    { key: 'BLOCKED', label: 'Blocked', n: counts.blocked },
  ];

  return (
    <section
      id="registry"
      className="relative mx-auto w-full max-w-[1180px] scroll-mt-6 px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        {/* VERTICAL FILTER STUB - clings to the field's left edge */}
        <div className="shrink-0 lg:sticky lg:top-8 lg:h-fit lg:w-[188px]">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-teal">
            <Layers size={13} /> Policy registry
          </div>
          <h2 className="mt-3 font-display text-2xl font-700 leading-tight tracking-tight text-mist">
            Live policies and rulings
          </h2>
          <div className="mt-6 flex flex-col gap-1.5">
            {filters.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`focus-ring flex items-center justify-between border-l-2 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    on
                      ? 'border-teal bg-teal/10 text-teal'
                      : 'border-white/10 text-haze hover:border-teal/40 hover:text-mist'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="tabular text-faint">{f.n}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STAGGERED PANEL COLUMN */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={onRetry} />
          ) : policies.length === 0 ? (
            <EmptyState onOpen={onOpen} />
          ) : filtered.length === 0 ? (
            <div className="plate bracket px-6 py-14 text-center font-body text-haze">
              No policies match this filter yet.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filtered.map((p, i) => {
                // alternating indent + mixed widths to break the grid
                const offset =
                  i % 3 === 0
                    ? 'lg:ml-0 lg:w-[94%]'
                    : i % 3 === 1
                      ? 'lg:ml-auto lg:w-[88%]'
                      : 'lg:ml-[6%] lg:w-[82%]';
                return (
                  <div key={p.id} className={offset}>
                    <PolicyPanel
                      policy={p}
                      onCheck={onCheck}
                      tag={`SIG-${String(p.index).padStart(2, '0')}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
