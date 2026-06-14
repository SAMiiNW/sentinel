'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ScanSearch, ArrowRight } from 'lucide-react';

interface Props {
  onOpen: () => void;
  onCheck: () => void;
  checksDisabled: boolean;
  stats: {
    total: number;
    checks: number;
    compliant: number;
    flagged: number;
    blocked: number;
    cleanRate: number | null;
  };
}

// Compact, left-aligned label + single-line headline with an inline highlighted noun.
// Deliberately not a full-viewport centered hero and not a two-line accent headline.
export function HeadlineBand({ onOpen, onCheck, checksDisabled, stats }: Props) {
  return (
    <section id="overview" className="relative border-b border-white/8 px-5 pb-12 pt-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <span className="uplabel flex items-center gap-2 font-mono text-teal">
            <span className="h-2 w-2 animate-pulsechip rounded-full bg-teal" />
            Operations desk
          </span>
          <h1 className="max-w-3xl font-display text-[clamp(1.9rem,4vw,3.1rem)] font-700 leading-[1.05] tracking-tight text-mist">
            An AI moderator that settles{' '}
            <span className="gradient-text">content-policy rulings</span> under consensus.
          </h1>
          <p className="mt-2 max-w-2xl font-body text-haze">
            Publish rules in plain language, submit content against them, and every validator
            re-runs the judgment before it becomes a permanent record. No deposits, no custody, no
            backend.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={onOpen}
            className="focus-ring flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-5 py-3 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <ShieldCheck size={16} /> Publish a policy
          </button>
          <button
            type="button"
            onClick={onCheck}
            disabled={checksDisabled}
            className="focus-ring flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 font-mono text-sm font-600 uppercase tracking-wider text-mist transition-colors hover:border-teal/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ScanSearch size={16} /> Check content
          </button>
          <a
            href="#registry"
            className="focus-ring flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-haze hover:text-teal"
          >
            Jump to registry <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* inline metric strip, not a chip row of network/contract links */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4"
        >
          <Metric label="Policies" value={stats.total} />
          <Metric label="Checks" value={stats.checks} />
          <Metric
            label="Clean rate"
            value={stats.cleanRate === null ? 'n/a' : `${stats.cleanRate}%`}
            accent="text-teal"
          />
          <Metric label="Blocked" value={stats.blocked} accent="text-blocked" />
        </motion.dl>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-abyss-900/40 px-4 py-4">
      <dd className={`tabular font-display text-2xl font-700 ${accent ?? 'text-mist'}`}>{value}</dd>
      <dt className="uplabel mt-1 text-faint">{label}</dt>
    </div>
  );
}
