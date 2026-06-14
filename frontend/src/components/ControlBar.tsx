'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  LogOut,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onOpen: () => void;
}

// Thin control-room status bar. Holds only wallet state and the primary action.
// Brand and network details live inside the bento tiles, not here.
export function ControlBar({ wallet, onOpen }: Props) {
  const [menu, setMenu] = useState(false);
  const connected = !!wallet.address;

  return (
    <div className="sticky top-0 z-40 border-b border-white/8 bg-abyss-900/55 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-haze">
          <span
            className={`h-2 w-2 rounded-full ${
              connected && wallet.chainOk ? 'bg-teal shadow-glow' : 'bg-haze/50'
            }`}
          />
          <span className="hidden sm:inline">Sentinel desk</span>
          <span className="sm:hidden">Sentinel</span>
        </span>

        <div className="flex items-center gap-2.5">
          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="focus-ring flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-2 font-mono text-xs font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20 disabled:opacity-60"
            >
              <Wallet size={14} />
              {wallet.connecting ? 'Connecting' : 'Connect'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-mist"
              >
                <span
                  className={`h-2 w-2 rounded-full ${wallet.chainOk ? 'bg-teal' : 'bg-flagged'}`}
                />
                {shortAddr(wallet.address as string)}
                <ChevronDown size={14} className={`transition-transform ${menu ? 'rotate-180' : ''}`} />
              </button>
              {menu && (
                <div className="glass-strong absolute right-0 top-12 w-72 rounded-2xl p-4">
                  <p className="uplabel text-faint">Connected wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-xs text-haze">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address as string} label="Copy address" />
                  </div>
                  {!wallet.chainOk && (
                    <p className="mt-3 rounded-xl border border-flagged/40 bg-flagged/10 p-2 font-mono text-[11px] text-flagged">
                      Wrong network. Switch to Bradbury (4221).
                    </p>
                  )}
                  <a
                    href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-3 flex items-center gap-1 font-mono text-xs text-teal hover:underline"
                  >
                    View contract <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      wallet.disconnect();
                      setMenu(false);
                    }}
                    className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 font-mono text-xs uppercase tracking-wider text-haze transition-colors hover:border-blocked hover:text-blocked"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onOpen}
            className="focus-ring hidden items-center gap-2 rounded-full bg-gradient-to-r from-teal to-violet px-4 py-2 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5 sm:flex"
          >
            <ShieldCheck size={14} /> Publish
          </button>
        </div>
      </div>
    </div>
  );
}
