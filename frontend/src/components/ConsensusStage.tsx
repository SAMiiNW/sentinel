'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';
import type { TxState } from '@/hooks/useTransaction';
import { rulingText, rulingLabel } from '@/lib/format';

const STAGE_ORDER = ['SUBMITTED', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED'];

function stageIndex(status: string): number {
  if (status === 'PENDING' || status === '') return 0;
  if (status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT') return 1;
  const i = STAGE_ORDER.indexOf(status);
  return i < 0 ? 1 : i;
}

const STAGES = [
  { key: 'SUBMITTED', label: 'Submitted', note: 'Transaction broadcast to Bradbury' },
  { key: 'PROPOSING', label: 'Moderator drafting', note: 'Leader runs the moderation prompt' },
  { key: 'COMMITTING', label: 'Validators re-running', note: 'Each re-judges the content' },
  { key: 'REVEALING', label: 'Revealing votes', note: 'Independent rulings compared' },
  { key: 'ACCEPTED', label: 'Recorded on-chain', note: 'Ruling written under consensus' },
];

const ICON: Record<string, typeof ShieldCheck> = {
  COMPLIANT: ShieldCheck,
  FLAGGED: ShieldAlert,
  BLOCKED: ShieldX,
};

export function ConsensusStage({ tx }: { tx: TxState }) {
  const idx = stageIndex(tx.liveStatus);
  const rotating = tx.liveStatus === 'LEADER_TIMEOUT' || tx.liveStatus === 'VALIDATORS_TIMEOUT';
  const draft = tx.draft;
  const DraftIcon = draft ? ICON[draft.ruling] ?? ShieldAlert : ShieldAlert;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-teal/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-5 rounded-full border border-violet/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-10 rounded-full bg-teal/10 blur-xl" />
        <ShieldCheck size={50} className="relative text-teal" />
      </div>

      <p className="uplabel mt-6 font-mono text-teal">
        {rotating ? 'Rotating leader, still working' : 'Consensus in progress'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-600 tracking-tight text-mist">
        The moderator deliberates
      </h3>
      <p className="mt-2 max-w-md font-body text-sm text-haze">
        An AI write on Bradbury takes one to five minutes. Validators are re-judging the content
        independently. This panel updates live.
      </p>

      <div className="mt-8 w-full max-w-md space-y-2">
        {STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                active
                  ? 'border-teal/40 bg-teal/5'
                  : done
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/8 bg-white/[0.02]'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${
                  done
                    ? 'border-compliant text-compliant'
                    : active
                      ? 'border-teal text-teal'
                      : 'border-white/15 text-faint'
                }`}
              >
                {active ? <Loader2 size={13} className="animate-spin" /> : done ? '\u2713' : i + 1}
              </span>
              <div className="min-w-0">
                <p
                  className={`font-mono text-xs uppercase tracking-wider ${
                    done || active ? 'text-mist' : 'text-faint'
                  }`}
                >
                  {s.label}
                </p>
                <p className="font-body text-xs text-faint">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-6 w-full max-w-md rounded-3xl border border-dashed border-teal/40 p-4 text-left"
        >
          <p className="uplabel text-faint">Leader draft, sealing under consensus</p>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`flex items-center gap-2 font-mono text-sm font-600 uppercase ${
                rulingText[draft.ruling] ?? 'text-mist'
              }`}
            >
              <DraftIcon size={16} />
              {rulingLabel[draft.ruling] ?? draft.ruling}
            </span>
            {typeof draft.severity === 'number' && (
              <span
                className={`tabular font-display text-3xl font-700 ${
                  rulingText[draft.ruling] ?? 'text-mist'
                }`}
              >
                {draft.severity}
              </span>
            )}
          </div>
          {draft.rationale && (
            <p className="mt-2 font-body text-sm italic text-mist/80">{draft.rationale}</p>
          )}
        </motion.div>
      )}

      <p className="mt-6 font-mono text-xs text-faint">
        Status: <span className="text-mist">{tx.liveStatus || 'PENDING'}</span>
      </p>
    </div>
  );
}
