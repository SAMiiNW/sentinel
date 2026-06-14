'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ScanSearch, ArrowRight, FileText, Network, Gauge } from 'lucide-react';

interface Props {
  onOpen: () => void;
  onCheck: () => void;
  checksDisabled: boolean;
  onRegistry: () => void;
}

// The dominant "command window" floating off-center on the desk. Holds the
// brand sigil, a single headline, the primary publish/check entry, and a
// compact three-step pipeline along its base.
export function CommandWindow({ onOpen, onCheck, checksDisabled, onRegistry }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      aria-label="Command window"
      className="oswin-strong relative overflow-hidden rounded-[1.75rem] p-6 sm:p-9"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-teal/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-violet/15 blur-3xl" />

      {/* faux window title rail */}
      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
            <ShieldCheck size={22} className="text-teal" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-700 tracking-tight text-mist">Sentinel</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
              Moderation OS, command window
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="hidden items-center gap-1.5 sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-compliant/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-flagged/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-blocked/70" />
        </span>
      </div>

      <h1 className="relative mt-7 max-w-lg font-display text-[clamp(1.9rem,3.6vw,3rem)] font-700 leading-[1.07] tracking-tight text-mist">
        Moderation that settles <span className="gradient-text">under consensus</span>.
      </h1>
      <p className="relative mt-3 max-w-md font-body text-sm leading-relaxed text-haze">
        Publish a policy in plain language, submit content against it, and every validator re-runs
        the ruling before it becomes a permanent record. No deposits, no custody, no backend.
      </p>

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
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
        <button
          type="button"
          onClick={onRegistry}
          className="focus-ring flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-haze hover:text-teal"
        >
          Open registry <ArrowRight size={14} />
        </button>
      </div>

      {/* pipeline along the base of the window */}
      <div className="relative mt-8 border-t border-white/8 pt-5">
        <span className="uplabel flex items-center gap-2 font-mono text-teal">
          <Gauge size={13} /> How the gate works
        </span>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          <Step icon={FileText} step="01" title="Publish" body="Write the rules in plain language." />
          <Step icon={ScanSearch} step="02" title="Submit" body="Send content to be judged strictly." />
          <Step icon={Network} step="03" title="Settle" body="Validators re-run, then it is sealed." />
        </ol>
      </div>
    </motion.section>
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
