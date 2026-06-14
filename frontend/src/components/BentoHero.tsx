'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ScanSearch,
  ArrowRight,
  FileText,
  Network,
  Droplets,
  ExternalLink,
  FileCode2,
  Gauge,
  Layers,
  Activity,
  CircleCheck,
  TriangleAlert,
  Ban,
} from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Stats {
  total: number;
  checks: number;
  compliant: number;
  flagged: number;
  blocked: number;
  cleanRate: number | null;
}

interface Props {
  onOpen: () => void;
  onCheck: () => void;
  checksDisabled: boolean;
  stats: Stats;
}

// Control-room bento: one dominant tile plus smaller frosted tiles for live
// stats, a compact how-it-works tile, and a network/contract tile. No tall
// centered hero, and no separate centered chip row.
export function BentoHero({ onOpen, onCheck, checksDisabled, stats }: Props) {
  return (
    <section id="overview" className="relative px-5 pb-10 pt-6 sm:px-8 sm:pt-10">
      <div
        className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(9rem,auto)]"
      >
        {/* DOMINANT TILE: brand, one short headline, primary action */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass relative col-span-2 flex flex-col overflow-hidden rounded-4xl p-7 sm:p-9 lg:col-span-6 lg:row-span-2"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-violet/15 blur-3xl" />

          <div className="relative flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
              <ShieldCheck size={22} className="text-teal" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-700 tracking-tight text-mist">Sentinel</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                Policy control room
              </span>
            </span>
          </div>

          <h1 className="relative mt-7 max-w-md font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-700 leading-[1.08] tracking-tight text-mist">
            Moderation that settles <span className="gradient-text">under consensus</span>.
          </h1>
          <p className="relative mt-3 max-w-sm font-body text-sm leading-relaxed text-haze">
            Publish a policy in plain language, submit content against it, and every validator
            re-runs the ruling before it becomes a permanent record. No deposits, no custody, no
            backend.
          </p>

          <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-7">
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
              Registry <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* STAT TILES: policies, checks (top band beside the dominant tile) */}
        <StatTile
          icon={Layers}
          label="Policies"
          value={stats.total}
          delay={0.06}
          className="lg:col-span-3"
        />
        <StatTile
          icon={Activity}
          label="Checks"
          value={stats.checks}
          delay={0.1}
          className="lg:col-span-3"
        />

        {/* NETWORK TILE: badge + contract + faucet/explorer links (no chip row) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="glass col-span-2 flex flex-col gap-3 rounded-3xl p-5 lg:col-span-6"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-teal">
              <span className="h-2 w-2 animate-pulsechip rounded-full bg-teal shadow-glow" />
              Desk live on Bradbury
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
              Chain 4221
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-haze hover:text-teal"
            >
              <FileCode2 size={13} className="shrink-0 text-faint" />
              <span className="truncate">Gate contract {shortAddr(CONTRACT_ADDRESS)}</span>
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-haze">
            <a
              href={`${EXPLORER}/tx/${DEPLOY_TX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-teal"
            >
              Deck deploy {shortHash(DEPLOY_TX)} <ExternalLink size={11} />
            </a>
            <a
              href={FAUCET}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-teal hover:text-teal-soft"
            >
              <Droplets size={12} /> Top up test GEN
            </a>
            <a
              href={EXPLORER}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-teal"
            >
              Inspect on explorer <ExternalLink size={11} />
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-teal"
            >
              Desk docs <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* HOW IT WORKS TILE: three short steps inline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="glass col-span-2 rounded-3xl p-5 lg:col-span-6"
        >
          <span className="uplabel flex items-center gap-2 font-mono text-teal">
            <Gauge size={13} /> How the gate works
          </span>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            <Step icon={FileText} step="01" title="Publish" body="Write the rules in plain language." />
            <Step icon={ScanSearch} step="02" title="Submit" body="Send content to be judged strictly." />
            <Step icon={Network} step="03" title="Settle" body="Validators re-run, then it is sealed." />
          </ol>
        </motion.div>

        {/* RULING STAT TILES: compliant, flagged, blocked */}
        <StatTile
          icon={CircleCheck}
          label="Compliant"
          value={stats.compliant}
          accent="text-compliant"
          delay={0.2}
          className="col-span-2 sm:col-span-1 lg:col-span-2"
        />
        <StatTile
          icon={TriangleAlert}
          label="Flagged"
          value={stats.flagged}
          accent="text-flagged"
          delay={0.24}
          className="sm:col-span-1 lg:col-span-2"
        />
        <StatTile
          icon={Ban}
          label="Blocked"
          value={stats.blocked}
          accent="text-blocked"
          delay={0.28}
          className="col-span-2 sm:col-span-2 lg:col-span-2"
          hint={stats.cleanRate === null ? undefined : `Clean rate ${stats.cleanRate}%`}
        />
      </div>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
  delay,
  className,
  hint,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  accent?: string;
  delay: number;
  className?: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass flex flex-col justify-between rounded-3xl p-5 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="uplabel font-mono text-faint">{label}</span>
        <Icon size={15} className={accent ?? 'text-faint'} />
      </div>
      <div>
        <div className={`tabular mt-4 font-display text-3xl font-700 ${accent ?? 'text-mist'}`}>
          {value}
        </div>
        {hint && <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-teal">{hint}</div>}
      </div>
    </motion.div>
  );
}

function Step({
  icon: Icon,
  step,
  title,
  body,
}: {
  icon: typeof FileText;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/12 bg-white/5">
          <Icon size={15} className="text-violet-soft" />
        </span>
        <span className="font-mono text-[10px] tracking-widest text-faint">{step}</span>
      </div>
      <p className="mt-2.5 font-display text-sm font-600 tracking-tight text-mist">{title}</p>
      <p className="mt-1 font-body text-xs leading-relaxed text-haze">{body}</p>
    </li>
  );
}
