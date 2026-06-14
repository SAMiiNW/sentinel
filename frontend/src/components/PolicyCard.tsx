'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, FileText, ScanSearch } from 'lucide-react';
import type { Policy } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel, rulingDot, rulingGlow } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

export function PolicyCard({
  policy,
  fresh,
  pending,
  onCheck,
}: {
  policy: Policy;
  fresh?: boolean;
  pending?: boolean;
  onCheck?: (p: Policy) => void;
}) {
  const ruled = policy.checks > 0 && policy.last_ruling !== '';
  const Icon = ruled ? ICON[policy.last_ruling] ?? FileText : FileText;
  const accent = ruled ? rulingText[policy.last_ruling] ?? 'text-haze' : 'text-violet-soft';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`glass group relative flex flex-col rounded-4xl p-6 transition-transform hover:-translate-y-1 ${
        fresh ? 'animate-flashframe' : ''
      } ${ruled ? rulingGlow[policy.last_ruling] ?? '' : ''} ${
        pending ? 'border-dashed opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
            <Icon size={19} className={accent} />
          </span>
          <div>
            <span
              className={`flex items-center gap-1.5 font-mono text-xs font-600 uppercase tracking-wider ${accent}`}
            >
              {ruled && (
                <span className={`h-1.5 w-1.5 rounded-full ${rulingDot[policy.last_ruling] ?? 'bg-haze'}`} />
              )}
              {ruled ? rulingLabel[policy.last_ruling] : 'Awaiting content'}
            </span>
            <span className="font-mono text-[11px] text-faint">{policy.id}</span>
          </div>
        </div>
        {ruled && (
          <div className="text-right">
            <div className={`tabular font-display text-3xl font-700 ${accent}`}>
              {policy.last_severity}
            </div>
            <div className="uplabel text-faint">severity</div>
          </div>
        )}
      </div>

      <h3 className="mt-5 font-display text-lg font-600 leading-snug tracking-tight text-mist">
        {policy.title}
      </h3>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <p className="uplabel text-faint">Policy rules</p>
        <p className="mt-1 line-clamp-4 font-body text-sm leading-relaxed text-haze">
          {policy.policy}
        </p>
      </div>

      {ruled && policy.last_rationale && (
        <div className="mt-3 border-l-2 border-teal/40 pl-3">
          <p className="uplabel text-faint">Moderator rationale</p>
          <p className="mt-1 font-body text-sm italic text-mist/85">{policy.last_rationale}</p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-xs text-faint">
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
            <ScanSearch size={13} /> Check content
          </button>
        )}
      </div>

      {pending && (
        <span className="absolute -top-3 left-5 animate-pulsechip rounded-full border border-flagged bg-abyss-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-flagged">
          Pending
        </span>
      )}
    </motion.article>
  );
}
