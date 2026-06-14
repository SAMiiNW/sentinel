'use client';

import { ShieldPlus, RefreshCw, TriangleAlert, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';

export function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-4xl p-6">
          <div className="flex justify-between">
            <div className="h-9 w-28 animate-pulse rounded-full bg-white/8" />
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/8" />
          </div>
          <div className="mt-5 h-6 w-3/4 animate-pulse rounded-lg bg-white/8" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-white/8" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-white/8" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="glass flex flex-col items-center rounded-4xl px-6 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-teal/30 bg-teal/10 shadow-glow">
        <ShieldPlus size={34} className="text-teal" />
      </span>
      <h3 className="mt-7 font-display text-2xl font-600 tracking-tight text-mist">
        No policies published yet
      </h3>
      <p className="mt-3 max-w-md font-body text-haze">
        The registry is empty. Publish the first policy, write its rules in plain language, and let
        the moderator rule once content is submitted.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="focus-ring mt-7 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-6 py-3 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
      >
        <ShieldPlus size={16} /> Publish the first policy
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass flex flex-col items-center rounded-4xl border border-blocked/30 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blocked/50 bg-blocked/10">
        <TriangleAlert size={28} className="text-blocked" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-600 tracking-tight text-mist">
        Could not reach the contract
      </h3>
      <p className="mt-2 max-w-md font-body text-sm text-haze">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-5 py-2.5 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 transition-transform hover:-translate-y-0.5"
        >
          <RefreshCw size={14} /> Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 rounded-2xl border border-white/12 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-haze hover:text-mist"
        >
          Explorer <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
