'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  ShieldPlus,
  Boxes,
  ScrollText,
  Wallet,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

export type ModuleKey = 'overview' | 'publish' | 'registry' | 'audit';

interface Props {
  active: ModuleKey;
  onModule: (key: ModuleKey) => void;
  wallet: WalletState & { connect: () => void; disconnect: () => void };
}

const MODULES: { key: ModuleKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'Overview module', icon: LayoutDashboard },
  { key: 'publish', label: 'Publish a policy', icon: ShieldPlus },
  { key: 'registry', label: 'Policy registry', icon: Boxes },
  { key: 'audit', label: 'Audit trail', icon: ScrollText },
];

// A fixed vertical icon dock pinned to the left edge on desktop, and a slim
// docked bar along the bottom on small screens. Holds the module glyphs and a
// wallet puck. No horizontal top navigation exists anywhere in the OS.
export function Dock({ active, onModule, wallet }: Props) {
  const [menu, setMenu] = useState(false);
  const connected = !!wallet.address;

  return (
    <nav
      aria-label="Moderation OS dock"
      className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-0 sm:h-screen"
    >
      <div className="dockrail flex items-center justify-between gap-1 px-2 py-2 sm:m-3 sm:h-[calc(100vh-1.5rem)] sm:flex-col sm:justify-start sm:gap-3 sm:rounded-3xl sm:px-2.5 sm:py-4">
        {/* OS sigil */}
        <span
          aria-hidden="true"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow sm:flex"
        >
          <ShieldCheck size={20} className="text-teal" />
        </span>

        <div className="flex flex-1 items-center justify-around gap-1 sm:flex-none sm:flex-col sm:justify-start sm:gap-2.5">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const on = active === m.key;
            return (
              <button
                key={m.key}
                type="button"
                aria-label={m.label}
                aria-current={on ? 'true' : undefined}
                title={m.label}
                onClick={() => onModule(m.key)}
                className={`focus-ring group relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border transition-colors ${
                  on
                    ? 'border-teal/50 bg-teal/15 text-teal shadow-glow'
                    : 'border-white/10 bg-white/5 text-haze hover:border-teal/40 hover:text-mist'
                }`}
              >
                <Icon size={19} />
                <span
                  aria-hidden="true"
                  className={`absolute left-1 hidden h-5 w-0.5 -translate-x-3 rounded-full bg-teal transition-opacity sm:block ${
                    on ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Wallet puck pinned to the bottom of the dock */}
        <div className="relative shrink-0 sm:mt-auto">
          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              aria-label={wallet.connecting ? 'Connecting wallet' : 'Connect wallet'}
              title="Connect wallet"
              className="focus-ring flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-teal/40 bg-teal/10 text-teal transition-colors hover:bg-teal/20 disabled:opacity-60"
            >
              <Wallet size={19} className={wallet.connecting ? 'animate-pulse' : ''} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-label="Wallet menu"
              aria-expanded={menu}
              title={shortAddr(wallet.address as string)}
              className="focus-ring relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-mist"
            >
              <Wallet size={18} />
              <span
                className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${
                  wallet.chainOk ? 'bg-teal shadow-glow' : 'bg-flagged'
                }`}
              />
            </button>
          )}

          {menu && connected && (
            <div className="oswin-strong absolute bottom-14 right-0 z-50 w-72 rounded-2xl p-4 sm:bottom-auto sm:left-14 sm:top-auto sm:-translate-y-full">
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
      </div>
    </nav>
  );
}
