'use client';

import { ShieldCheck, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

// Masthead-style footer: a single full-bleed band, not a three-column grid.
export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
              <ShieldCheck size={24} className="text-teal" />
            </span>
            <div>
              <p className="font-display text-2xl font-700 tracking-tight text-mist">Sentinel</p>
              <p className="font-body text-sm text-haze">
                An on-chain AI content-policy gate on GenLayer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-haze">
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-teal"
            >
              Contract {shortAddr(CONTRACT_ADDRESS)}
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
            <a
              href={`${EXPLORER}/tx/${DEPLOY_TX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal"
            >
              Deploy {shortHash(DEPLOY_TX)} <ExternalLink size={11} />
            </a>
            <a
              href={FAUCET}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal"
            >
              Faucet <ExternalLink size={11} />
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal"
            >
              GenLayer docs <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-white/8 pt-6 text-center font-mono text-xs text-faint">
          Built on GenLayer Bradbury Testnet. Rulings are AI judgments under validator consensus,
          provided as is, not professional moderation or legal advice.
        </p>
      </div>
    </footer>
  );
}
