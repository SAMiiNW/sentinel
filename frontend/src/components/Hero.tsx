'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ArrowDown, Sparkles } from 'lucide-react';
import { MeshCanvas } from './MeshCanvas';
import { FAUCET } from '@/lib/contract';

interface Props {
  onOpen: () => void;
  stats: {
    total: number;
    checks: number;
    compliant: number;
    flagged: number;
    blocked: number;
    cleanRate: number | null;
  };
}

export function Hero({ onOpen, stats }: Props) {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* living mesh */}
      <div className="absolute inset-0">
        <MeshCanvas />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyss-900/20 via-transparent to-abyss-900" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        {/* left: headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-teal backdrop-blur-md"
          >
            <Sparkles size={13} /> On-chain AI content-policy gate
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-[clamp(2.6rem,6.5vw,5.4rem)] font-800 leading-[0.98] tracking-tight text-mist"
          >
            Moderation that <span className="gradient-text">settles on-chain</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl font-body text-lg text-haze"
          >
            Publish a policy in plain language, then submit content to be checked against it. An
            injection-resistant AI moderator rules compliant, flagged, or blocked with a severity
            score, and every validator re-runs the judgment before it becomes a permanent,
            auditable record. No deposits, no custody.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={onOpen}
              className="focus-ring flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-7 py-4 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <ShieldCheck size={18} /> Publish a policy
            </button>
            <a
              href="#registry"
              className="focus-ring flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-7 py-4 font-mono text-sm font-600 uppercase tracking-wider text-mist backdrop-blur-md transition-colors hover:border-teal/50"
            >
              View the registry <ArrowDown size={16} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 font-mono text-xs text-faint"
          >
            Live on Bradbury Testnet.{' '}
            <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
              Claim test GEN
            </a>{' '}
            to publish or check.
          </motion.div>
        </div>

        {/* right: floating frosted stat card (dominant bento cell motif preview) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="glass animate-floaty rounded-4xl p-7"
        >
          <div className="flex items-center justify-between">
            <span className="uplabel font-mono text-faint">Live ledger</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-teal">
              <span className="h-2 w-2 animate-pulsechip rounded-full bg-teal" /> on-chain
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <StatCell label="Policies" value={stats.total} accent="text-mist" />
            <StatCell label="Checks" value={stats.checks} accent="text-mist" />
            <StatCell label="Clean rate" value={stats.cleanRate === null ? '\u2014' : `${stats.cleanRate}%`} accent="text-teal" />
            <StatCell label="Deposit" value="None" accent="text-violet" small />
          </div>

          <div className="mt-6 space-y-2 border-t border-white/8 pt-5">
            <RulingBar label="Compliant" count={stats.compliant} total={stats.checks} cls="bg-compliant" />
            <RulingBar label="Flagged" count={stats.flagged} total={stats.checks} cls="bg-flagged" />
            <RulingBar label="Blocked" count={stats.blocked} total={stats.checks} cls="bg-blocked" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCell({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string | number;
  accent: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
      <div className={`tabular font-display font-700 ${small ? 'text-2xl' : 'text-3xl'} ${accent}`}>
        {value}
      </div>
      <div className="uplabel mt-1 text-faint">{label}</div>
    </div>
  );
}

function RulingBar({
  label,
  count,
  total,
  cls,
}: {
  label: string;
  count: number;
  total: number;
  cls: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] text-haze">
        <span>{label}</span>
        <span className="tabular text-mist">{count}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full ${cls}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
