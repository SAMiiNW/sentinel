'use client';

import { motion } from 'framer-motion';
import { FilePlus2, ShieldCheck, ShieldAlert, ShieldX, ScanSearch } from 'lucide-react';
import type { ChronicleEntry } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel } from '@/lib/format';

const RULE_ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

export function Chronicle({ entries }: { entries: ChronicleEntry[] }) {
  if (entries.length === 0) return null;
  const ordered = [...entries].reverse().slice(0, 12);

  return (
    <section id="chronicle" className="relative py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="uplabel font-mono text-teal">The audit trail</span>
          <h2 className="mt-3 font-display text-4xl font-700 leading-tight tracking-tight text-mist sm:text-5xl">
            Every ruling, <span className="gradient-text">on the record</span>.
          </h2>
          <p className="mt-4 font-body text-haze">
            An append-only chronicle of policy publications and moderation rulings, written under
            consensus and readable by anyone.
          </p>
        </div>

        <div className="relative mt-12 pl-6">
          <span className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-teal/50 via-violet/30 to-transparent" />
          <div className="space-y-4">
            {ordered.map((e, i) => {
              const isCheck = e.event === 'CHECKED';
              const Icon = isCheck ? RULE_ICON[e.ruling] ?? ScanSearch : FilePlus2;
              const accent = isCheck ? rulingText[e.ruling] ?? 'text-haze' : 'text-violet-soft';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                  className="glass relative rounded-3xl p-5"
                >
                  <span className="absolute -left-[1.65rem] top-6 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-abyss-800">
                    <Icon size={13} className={accent} />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-sm font-600 text-mist">{e.title}</span>
                    {isCheck ? (
                      <span
                        className={`flex items-center gap-2 font-mono text-xs font-600 uppercase tracking-wider ${accent}`}
                      >
                        {rulingLabel[e.ruling] ?? e.ruling}
                        <span className="tabular rounded-full border border-white/10 px-2 py-0.5 text-mist">
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
