'use client';

import { useState } from 'react';
import { ShieldCheck, ChevronDown, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onOpen: () => void;
}

export function Header({ wallet, onOpen }: Props) {
  const [menu, setMenu] = useState(false);
  const connected = !!wallet.address;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-abyss-900/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="focus-ring flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
            <ShieldCheck size={18} className="text-teal" />
          </span>
          <span className="font-display text-lg font-700 tracking-tight text-mist">Sentinel</span>
        </a>

        {/* Network and contract folded into the header (varying skeleton). */}
        <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 font-mono text-xs text-haze lg:flex">
          <span
            className={`h-2 w-2 rounded-full ${
              connected && wallet.chainOk ? 'bg-teal shadow-glow' : 'bg-haze/50'
            }`}
          />
          Bradbury
          <span className="mx-1 text-white/15">|</span>
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal"
          >
            {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
        </div>

        <div className="flex items-center gap-3">
          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="focus-ring flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-2 font-mono text-xs font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20 disabled:opacity-60"
            >
              <Wallet size={15} />
              {wallet.connecting ? 'Connecting' : 'Connect'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-mist"
              >
                <span className="h-2 w-2 rounded-full bg-teal" />
                {shortAddr(wallet.address as string)}
                <ChevronDown size={14} />
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
            className="focus-ring hidden items-center gap-2 rounded-full bg-gradient-to-r from-teal to-violet px-4 py-2 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5 md:flex"
          >
            <ShieldCheck size={15} /> Publish policy
          </button>
        </div>
      </div>
    </header>
  );
}
