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

// Console signal panel for one policy. Bracket-framed solid plate with a node
// tag, severity readout, rationale, and a check trigger. Used in the registry
// field and reused inside the modal confirmation screen.
export function PolicyPanel({
  policy,
  fresh,
  onCheck,
  tag,
}: {
  policy: Policy;
  fresh?: boolean;
  onCheck?: (p: Policy) => void;
  tag?: string;
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
      className={`plate bracket relative p-5 ${fresh ? 'animate-flashframe' : ''}`}
    >
      {tag && (
        <span className="absolute -top-2.5 left-5 bg-abyss-900 px-2 font-mono text-[9px] uppercase tracking-[0.24em] text-faint">
          {tag}
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/12 bg-white/[0.03]">
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

      <div className="mt-4 border-l-2 border-teal/30 bg-white/[0.02] py-2 pl-3">
        <p className="uplabel text-faint">Policy rules</p>
        <p className="mt-1 font-body text-sm leading-relaxed text-haze">{policy.policy}</p>
      </div>

      {ruled && policy.last_rationale && (
        <div className="mt-3 border-l-2 border-violet/40 pl-3">
          <p className="uplabel text-faint">Moderator rationale</p>
          <p className="mt-1 font-body text-sm italic text-mist/85">{policy.last_rationale}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-xs text-faint">
        <span>
          by {shortAddr(policy.publisher)} <span className="text-white/15">|</span> {policy.checks}{' '}
          {policy.checks === 1 ? 'check' : 'checks'}
        </span>
        {onCheck && (
          <button
            type="button"
            onClick={() => onCheck(policy)}
            className="focus-ring flex items-center gap-1.5 border border-teal/40 bg-teal/10 px-3 py-1.5 font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20"
          >
            <ScanSearch size={13} /> Check
          </button>
        )}
      </div>
    </motion.article>
  );
}
