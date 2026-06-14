'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, FileText, ScanSearch, ChevronDown } from 'lucide-react';
import type { Policy } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel, rulingDot } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

// Table-like expanding row. Replaces the old card-grid item.
export function PolicyRow({
  policy,
  fresh,
  onCheck,
}: {
  policy: Policy;
  fresh?: boolean;
  onCheck?: (p: Policy) => void;
}) {
  const [open, setOpen] = useState(false);
  const ruled = policy.checks > 0 && policy.last_ruling !== '';
  const Icon = ruled ? ICON[policy.last_ruling] ?? FileText : FileText;
  const accent = ruled ? rulingText[policy.last_ruling] ?? 'text-haze' : 'text-violet-soft';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden border-b border-white/8 transition-colors last:border-0 hover:bg-white/[0.025] ${
        fresh ? 'animate-flashframe' : ''
      }`}
    >
      {/* row header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="focus-ring grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 text-left sm:px-6"
      >
        {/* status icon + dot */}
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/5">
          <Icon size={17} className={accent} />
        </span>

        {/* title + meta */}
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate font-display text-base font-600 tracking-tight text-mist">
              {policy.title}
            </span>
            {ruled && (
              <span
                className={`hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wider sm:inline-flex ${accent}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${rulingDot[policy.last_ruling] ?? 'bg-haze'}`} />
                {rulingLabel[policy.last_ruling]}
              </span>
            )}
          </span>
          <span className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-faint">
            <span>{policy.id}</span>
            <span className="text-white/15">|</span>
            <span>by {shortAddr(policy.publisher)}</span>
            <span className="text-white/15">|</span>
            <span>
              {policy.checks} {policy.checks === 1 ? 'check' : 'checks'}
            </span>
          </span>
        </span>

        {/* severity + chevron */}
        <span className="flex items-center gap-4">
          {ruled ? (
            <span className="text-right">
              <span className={`tabular block font-display text-2xl font-700 ${accent}`}>
                {policy.last_severity}
              </span>
              <span className="uplabel block text-faint">severity</span>
            </span>
          ) : (
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-violet-soft sm:block">
              Awaiting
            </span>
          )}
          <ChevronDown
            size={18}
            className={`shrink-0 text-faint transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 px-4 pb-6 sm:grid-cols-[1.4fr_1fr] sm:px-6">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="uplabel text-faint">Policy rules</p>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-haze">
                  {policy.policy}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {ruled && policy.last_rationale ? (
                  <div className="border-l-2 border-teal/40 pl-3">
                    <p className="uplabel text-faint">Moderator rationale</p>
                    <p className="mt-1 font-body text-sm italic text-mist/85">
                      {policy.last_rationale}
                    </p>
                  </div>
                ) : (
                  <div className="border-l-2 border-violet/40 pl-3">
                    <p className="uplabel text-faint">Status</p>
                    <p className="mt-1 font-body text-sm text-haze">
                      No content checked yet. Submit content to get the first ruling.
                    </p>
                  </div>
                )}

                {onCheck && (
                  <button
                    type="button"
                    onClick={() => onCheck(policy)}
                    className="focus-ring mt-auto flex items-center justify-center gap-1.5 self-start rounded-full border border-teal/40 bg-teal/10 px-4 py-2 font-mono text-xs font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20"
                  >
                    <ScanSearch size={14} /> Check content
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
