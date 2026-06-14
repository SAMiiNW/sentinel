'use client';

import { FileCode2, Droplets, ExternalLink, ScrollText } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  online: boolean;
  onAudit: () => void;
}

// The OS taskbar: a single horizontal strip docked above the bottom dock on
// mobile and along the bottom of the desk on larger screens. Carries network
// status, the gate contract address, gas top-up, explorer trace, and a path to
// the disclaimer that also lives in the Audit panel.
export function Taskbar({ online, onAudit }: Props) {
  return (
    <div className="oswin rounded-2xl px-3 py-2.5 sm:px-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-haze">
        <span className="flex items-center gap-2 text-teal">
          <span
            className={`h-2 w-2 rounded-full ${
              online ? 'animate-pulsechip bg-teal shadow-glow' : 'bg-haze/50'
            }`}
          />
          Desk online, Bradbury
        </span>

        <span className="hidden text-white/12 sm:inline">|</span>

        <span className="flex min-w-0 items-center gap-2">
          <FileCode2 size={13} className="shrink-0 text-faint" />
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-teal"
          >
            Gate {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
        </span>

        <span className="hidden text-white/12 sm:inline">|</span>

        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-teal hover:text-teal-soft"
        >
          <Droplets size={12} /> Top up gas
        </a>

        <a
          href={EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-teal"
        >
          Trace on explorer <ExternalLink size={11} />
        </a>

        <button
          type="button"
          onClick={onAudit}
          className="focus-ring ml-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-wider text-haze transition-colors hover:border-teal/40 hover:text-teal"
        >
          <ScrollText size={12} /> Audit and disclaimer
        </button>
      </div>
    </div>
  );
}
