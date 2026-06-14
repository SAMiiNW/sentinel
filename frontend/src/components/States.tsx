'use client';

import { ShieldPlus, RefreshCw, TriangleAlert, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';

export function Skeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`plate bracket p-6 ${i % 2 === 1 ? 'lg:ml-auto lg:w-[88%]' : 'lg:w-[94%]'}`}>
          <div className="flex justify-between">
            <div className="h-9 w-28 animate-pulse bg-white/8" />
            <div className="h-12 w-12 animate-pulse bg-white/8" />
          </div>
          <div className="mt-5 h-6 w-3/4 animate-pulse bg-white/8" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse bg-white/8" />
            <div className="h-3 w-5/6 animate-pulse bg-white/8" />
            <div className="h-3 w-2/3 animate-pulse bg-white/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="plate bracket flex flex-col items-center px-6 py-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center border border-teal/30 bg-teal/10 shadow-glow">
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
        className="focus-ring mt-7 flex items-center gap-2 bg-gradient-to-r from-teal to-violet px-6 py-3 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
      >
        <ShieldPlus size={16} /> Publish the first policy
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="plate bracket flex flex-col items-center border-blocked/30 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center border border-blocked/50 bg-blocked/10">
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
          className="focus-ring flex items-center gap-2 bg-gradient-to-r from-teal to-violet px-5 py-2.5 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 transition-transform hover:-translate-y-0.5"
        >
          <RefreshCw size={14} /> Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 border border-white/12 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-haze hover:text-mist"
        >
          Trace on explorer <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
