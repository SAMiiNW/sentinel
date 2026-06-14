'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, FileText, ScanSearch } from 'lucide-react';
import type { Policy } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel, rulingDot } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

// Masonry tile for the control-room registry. Heights vary with the length of
// the policy text, so the column layout reads as a true masonry rather than a
// uniform card grid.
export function PolicyTile({
  policy,
  fresh,
  onCheck,
}: {
  policy: Policy;
  fresh?: boolean;
  onCheck?: (p: Policy) => void;
}) {
  const ruled = policy.checks > 0 && policy.last_ruling !== '';
  const Icon = ruled ? ICON[policy.last_ruling] ?? FileText : FileText;
  const accent = ruled ? rulingText[policy.last_ruling] ?? 'text-haze' : 'text-violet-soft';

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`glass mb-5 block break-inside-avoid rounded-3xl p-5 ${
        fresh ? 'animate-flashframe' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
            <Icon size={18} className={accent} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-600 tracking-tight text-mist">
              {policy.title}
            </h3>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
              {policy.id}
              {ruled && (
                <>
                  <span className="text-white/15">|</span>
                  <span className={`flex items-center gap-1 ${accent}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${rulingDot[policy.last_ruling] ?? 'bg-haze'}`}
                    />
                    {rulingLabel[policy.last_ruling]}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
        {ruled ? (
          <div className="shrink-0 text-right">
            <div className={`tabular font-display text-2xl font-700 ${accent}`}>
              {policy.last_severity}
            </div>
            <div className="uplabel text-faint">severity</div>
          </div>
        ) : (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-violet-soft">
            Awaiting
          </span>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <p className="uplabel text-faint">Policy rules</p>
        <p className="mt-1 font-body text-sm leading-relaxed text-haze">{policy.policy}</p>
      </div>

      {ruled && policy.last_rationale && (
        <div className="mt-3 border-l-2 border-teal/40 pl-3">
          <p className="uplabel text-faint">Moderator rationale</p>
          <p className="mt-1 font-body text-sm italic text-mist/85">{policy.last_rationale}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-xs text-faint">
        <span>
          by {shortAddr(policy.publisher)} <span className="text-white/15">|</span>{' '}
          {policy.checks} {policy.checks === 1 ? 'check' : 'checks'}
        </span>
        {onCheck && (
          <button
            type="button"
            onClick={() => onCheck(policy)}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3 py-1.5 font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20"
          >
            <ScanSearch size={13} /> Check
          </button>
        )}
      </div>
    </motion.article>
  );
}
