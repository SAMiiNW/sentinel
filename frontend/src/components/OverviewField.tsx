'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ScanSearch,
  ShieldPlus,
  ArrowRight,
  FileText,
  Network,
  ExternalLink,
  FileCode2,
  Layers,
  Activity,
  CircleCheck,
  TriangleAlert,
  Ban,
  Gauge,
} from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER } from '@/lib/contract';
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

// The overview is a responsive bento field. Panels sit in normal document flow
// inside a 12-column grid so they never overlap at any viewport. A decorative
// filament layer drifts behind everything as a pointer-events-none background,
// keeping the wired operations-desk feel without driving layout. On narrow
// screens the grid collapses to a single stacked column.
export function OverviewField({ onOpen, onCheck, checksDisabled, stats }: Props) {
  return (
    <section
      id="overview"
      className="relative mx-auto w-full max-w-[1180px] px-5 pb-16 pt-8 sm:px-8 lg:px-10"
    >
      <Filaments />

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7">
        {/* 1. MASTHEAD PLATE - upper left, angular clipped corner */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="plate bracket clip-masthead relative overflow-hidden p-7 sm:p-9 lg:col-span-7"
        >
          <span className="scanline pointer-events-none absolute inset-x-0 top-0 h-9" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-teal/10 blur-3xl" />
          <div className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-nodepulse" />
            Sentinel control field
            <span className="ml-auto text-faint">NODE-00</span>
          </div>
          <h1 className="relative mt-6 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-700 leading-[1.06] tracking-tight text-mist">
            Moderation that settles <span className="gradient-text">under consensus</span>.
          </h1>
          <p className="relative mt-4 max-w-md font-body text-sm leading-relaxed text-haze">
            Publish a policy in plain language, submit content against it, and every validator re-runs
            the ruling before it becomes a permanent record. No deposits, no custody, no backend.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="focus-ring flex items-center gap-2 bg-gradient-to-r from-teal to-violet px-5 py-3 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <ShieldPlus size={16} /> Publish a policy
            </button>
            <button
              type="button"
              onClick={onCheck}
              disabled={checksDisabled}
              className="focus-ring flex items-center gap-2 border border-white/14 bg-white/[0.03] px-5 py-3 font-mono text-sm font-600 uppercase tracking-wider text-mist transition-colors hover:border-teal/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ScanSearch size={16} /> Check content
            </button>
          </div>
        </motion.div>

        {/* 3. GATE INTAKE - upper right console window */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="plate bracket-violet bracket relative p-5 lg:col-span-5"
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-violet-soft">
            <span className="flex items-center gap-2">
              <ShieldCheck size={13} /> Gate intake
            </span>
            <span className="text-faint">NODE-01</span>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onOpen}
              className="focus-ring flex items-center justify-between border border-teal/35 bg-teal/[0.07] px-4 py-3 font-mono text-xs font-700 uppercase tracking-wider text-teal transition-colors hover:bg-teal/15"
            >
              Publish a policy <ShieldPlus size={15} />
            </button>
            <button
              type="button"
              onClick={onCheck}
              disabled={checksDisabled}
              className="focus-ring flex items-center justify-between border border-white/12 bg-white/[0.03] px-4 py-3 font-mono text-xs font-600 uppercase tracking-wider text-mist transition-colors hover:border-teal/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check content <ScanSearch size={15} />
            </button>
          </div>
          <div className="mt-5 space-y-2.5 border-t border-white/8 pt-4">
            <MicroStep icon={FileText} step="01" title="Publish" body="Write the rules in plain language." />
            <MicroStep icon={ScanSearch} step="02" title="Submit" body="Send content to be judged strictly." />
            <MicroStep icon={Network} step="03" title="Settle" body="Validators re-run, then it is sealed." />
          </div>
        </motion.div>

        {/* 2. SIGNAL CLUSTER - gauge nodes, lower left */}
        <div className="relative lg:col-span-7">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
            <Gauge size={12} className="text-teal" /> Signal cluster
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <GaugeNode icon={Layers} label="Policies" value={stats.total} delay={0.06} />
            <GaugeNode icon={Activity} label="Checks" value={stats.checks} delay={0.1} />
            <GaugeNode icon={CircleCheck} label="Compliant" value={stats.compliant} accent="text-compliant" delay={0.14} />
            <GaugeNode icon={TriangleAlert} label="Flagged" value={stats.flagged} accent="text-flagged" delay={0.18} />
            <GaugeNode icon={Ban} label="Blocked" value={stats.blocked} accent="text-blocked" delay={0.22} />
            {stats.cleanRate !== null && (
              <div className="plate bracket flex flex-col justify-center px-4 py-3">
                <span className="uplabel text-faint">Clean rate</span>
                <span className="tabular mt-1 font-display text-2xl font-700 text-teal">
                  {stats.cleanRate}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4. TELEMETRY TAG - lower right tag plate */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="plate clip-tag relative p-5 lg:col-span-5"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-teal">
              <span className="h-1.5 w-1.5 animate-pulsechip rounded-full bg-teal shadow-glow" />
              Desk online, Bradbury
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-faint">Chain 4221</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border border-white/8 bg-white/[0.02] px-3 py-2.5">
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

          <div className="mt-3 flex items-center gap-x-5 font-mono text-[11px] text-haze">
            <a
              href={`${EXPLORER}/tx/${DEPLOY_TX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-teal"
            >
              Sealed by {shortHash(DEPLOY_TX)} <ExternalLink size={11} />
            </a>
          </div>

          <a
            href="#registry"
            className="focus-ring mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-faint hover:text-teal"
          >
            Descend to registry <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Decorative filament layer. Drifting curved beziers with a flowing dashed
// animation and glowing junction nodes, drawn purely as a pointer-events-none
// background behind the grid. It no longer anchors panels, so it can never push
// content out of flow or cause overlaps. Hidden below lg.
function Filaments() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-0 hidden h-full w-full opacity-70 lg:block"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fil-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5eead4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <path
        d="M 60 120 C 320 60, 660 80, 940 140"
        fill="none"
        stroke="url(#fil-teal)"
        strokeWidth="1.2"
        className="connector-flow"
      />
      <path
        d="M 80 300 C 360 360, 640 260, 920 340"
        fill="none"
        stroke="url(#fil-teal)"
        strokeWidth="1.2"
        className="connector-flow"
      />
      <path
        d="M 120 480 C 380 420, 620 520, 900 470"
        fill="none"
        stroke="url(#fil-teal)"
        strokeWidth="1.2"
        className="connector-flow"
      />
      {[
        [60, 120],
        [940, 140],
        [80, 300],
        [920, 340],
        [120, 480],
        [900, 470],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#5eead4" className="junction" />
      ))}
    </svg>
  );
}

function GaugeNode({
  icon: Icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: typeof Gauge;
  label: string;
  value: string | number;
  accent?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay }}
      className="plate bracket flex flex-col px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <span className="uplabel text-faint">{label}</span>
        <Icon size={13} className={accent ?? 'text-faint'} />
      </div>
      <span className={`tabular mt-2 font-display text-2xl font-700 ${accent ?? 'text-mist'}`}>
        {value}
      </span>
    </motion.div>
  );
}

function MicroStep({
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
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/12 bg-white/[0.03]">
        <Icon size={13} className="text-violet-soft" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xs font-600 tracking-tight text-mist">
          {title} <span className="ml-1 font-mono text-[9px] tracking-widest text-faint">{step}</span>
        </p>
        <p className="font-body text-[11px] leading-snug text-haze">{body}</p>
      </div>
    </div>
  );
}
