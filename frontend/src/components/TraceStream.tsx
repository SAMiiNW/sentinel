'use client';

import { motion } from 'framer-motion';
import { FilePlus2, ShieldCheck, ShieldAlert, ShieldX, ScanSearch, GitBranch } from 'lucide-react';
import type { ChronicleEntry } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel } from '@/lib/format';

const RULE_ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

// The trace stream is a wired vertical filament. Each ruling bead hangs off the
// spine on alternating sides, like signal taps on a console bus line.
export function TraceStream({ entries }: { entries: ChronicleEntry[] }) {
  if (entries.length === 0) return null;
  const ordered = [...entries].reverse().slice(0, 12);

  return (
    <section
      id="trace"
      className="relative mx-auto w-full max-w-[1180px] scroll-mt-6 px-5 py-20 sm:px-8 lg:px-10"
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-teal">
        <GitBranch size={13} /> Trace stream
      </div>
      <h2 className="mt-3 max-w-2xl font-display text-3xl font-700 leading-tight tracking-tight text-mist sm:text-4xl">
        Every ruling, <span className="gradient-text">on the record</span>.
      </h2>
      <p className="mt-3 max-w-xl font-body text-sm text-haze">
        An append-only stream of policy publications and moderation rulings, written under consensus
        and readable by anyone.
      </p>

      {/* central bus spine */}
      <div className="relative mt-12 lg:px-[8%]">
        <span className="railspine absolute left-4 top-0 bottom-0 w-px lg:left-1/2 lg:-translate-x-1/2" />
        <span className="animate-sweepdown absolute left-4 top-0 h-16 w-px bg-gradient-to-b from-transparent via-teal to-transparent lg:left-1/2 lg:-translate-x-1/2" />
        <div className="space-y-5">
          {ordered.map((e, i) => {
            const isCheck = e.event === 'CHECKED';
            const Icon = isCheck ? RULE_ICON[e.ruling] ?? ScanSearch : FilePlus2;
            const accent = isCheck ? rulingText[e.ruling] ?? 'text-haze' : 'text-violet-soft';
            const side = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.24) }}
                className={`relative pl-12 lg:w-1/2 lg:pl-0 ${
                  side ? 'lg:pr-12' : 'lg:ml-auto lg:pl-12'
                }`}
              >
                {/* bead on the spine */}
                <span
                  className={`absolute top-5 z-10 flex h-7 w-7 items-center justify-center border border-white/15 bg-abyss-900 left-[3px] lg:left-auto ${
                    side ? 'lg:-right-[14px]' : 'lg:-left-[14px]'
                  }`}
                >
                  <Icon size={13} className={accent} />
                </span>
                {/* tap line to spine */}
                <span
                  className={`absolute top-8 h-px w-7 bg-white/15 left-4 lg:left-auto ${
                    side ? 'lg:right-0' : 'lg:left-0'
                  }`}
                />
                <div className="plate bracket p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-sm font-600 text-mist">{e.title}</span>
                    {isCheck ? (
                      <span
                        className={`flex items-center gap-2 font-mono text-xs font-600 uppercase tracking-wider ${accent}`}
                      >
                        {rulingLabel[e.ruling] ?? e.ruling}
                        <span className="tabular border border-white/10 px-2 py-0.5 text-mist">
                          {e.severity}
                        </span>
                      </span>
                    ) : (
                      <span className="font-mono text-xs uppercase tracking-wider text-violet-soft">
                        Published
                      </span>
                    )}
                  </div>
                  {isCheck && e.excerpt && (
                    <p className="mt-2 line-clamp-2 font-body text-sm text-haze">
                      <span className="text-faint">Content: </span>
                      {e.excerpt}
                    </p>
                  )}
                  {isCheck && e.rationale && (
                    <p className="mt-1.5 font-body text-sm italic text-mist/75">{e.rationale}</p>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-faint">
                    {e.policy} <span className="text-white/15">|</span> by {shortAddr(e.by)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
