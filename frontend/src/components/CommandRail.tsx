'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldPlus,
  Radar,
  Layers,
  GitBranch,
  Wallet,
  LogOut,
  ExternalLink,
  Power,
  Droplets,
  BookOpen,
} from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onPublish: () => void;
  active: string;
}

const NODES = [
  { id: 'overview', label: 'Overview', short: 'OV', icon: Radar },
  { id: 'registry', label: 'Registry', short: 'RG', icon: Layers },
  { id: 'trace', label: 'Trace', short: 'TR', icon: GitBranch },
];

// Vertical command rail pinned to the left edge. This is the only navigation
// surface on the page. No horizontal bar exists anywhere. It carries the sigil,
// a wired node spine for section jumps, a publish trigger, and the wallet dock.
export function CommandRail({ wallet, onPublish, active }: Props) {
  const [menu, setMenu] = useState(false);
  const connected = !!wallet.address;

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[68px] flex-col items-center justify-between border-r border-teal/15 bg-abyss-900/85 py-5 backdrop-blur-xl lg:w-[232px] lg:items-stretch lg:px-4">
      {/* SIGIL */}
      <div className="flex flex-col items-center lg:items-stretch">
        <div className="flex items-center gap-3 lg:px-1">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-teal/40 bg-teal/10">
            <span className="absolute left-1 top-1 h-2 w-2 border-l border-t border-teal/70" />
            <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-teal/70" />
            <ShieldCheck size={20} className="text-teal" />
          </span>
          <span className="hidden flex-col leading-none lg:flex">
            <span className="font-display text-base font-700 tracking-tight text-mist">Sentinel</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.34em] text-faint">
              Desk
            </span>
          </span>
        </div>

        {/* WALLET DOCK pinned at the TOP, always visible (popover opens downward) */}
        <div className="relative mt-6 w-full">
          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="focus-ring flex w-full items-center justify-center gap-2 border border-teal bg-gradient-to-b from-teal/25 to-violet/15 py-3 font-mono text-[10px] font-700 uppercase tracking-[0.18em] text-teal shadow-glow transition-colors hover:from-teal/35 hover:to-violet/25 disabled:opacity-60 lg:justify-start lg:px-3"
              aria-label="Connect wallet"
            >
              <Power size={15} className="text-teal" />
              <span className="hidden lg:inline">{wallet.connecting ? 'Connecting' : 'Connect wallet'}</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="focus-ring flex w-full items-center justify-center gap-2 border border-teal/40 bg-teal/5 py-3 font-mono text-[10px] text-mist lg:justify-start lg:px-3"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    wallet.chainOk ? 'bg-teal shadow-glow' : 'bg-flagged'
                  }`}
                />
                <span className="hidden truncate lg:inline">{shortAddr(wallet.address as string)}</span>
              </button>
              {menu && (
                <div className="plate bracket absolute left-0 top-14 z-50 w-[244px] p-4">
                  <p className="uplabel text-faint">Linked wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-xs text-haze">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address as string} label="Copy address" />
                  </div>
                  {!wallet.chainOk && (
                    <p className="mt-3 border border-flagged/40 bg-flagged/10 p-2 font-mono text-[11px] text-flagged">
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
                    className="focus-ring mt-4 flex w-full items-center justify-center gap-2 border border-white/10 py-2 font-mono text-xs uppercase tracking-wider text-haze transition-colors hover:border-blocked hover:text-blocked"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* WIRED NODE SPINE */}
        <nav className="relative mt-10 flex flex-col gap-7 lg:mt-12 lg:gap-8">
          <span className="railspine pointer-events-none absolute left-[19px] top-1 bottom-1 w-px lg:left-[11px]" />
          {NODES.map((n) => {
            const on = active === n.id;
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => jump(n.id)}
                className="focus-ring group relative flex items-center gap-3"
                aria-label={n.label}
              >
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border transition-colors lg:h-6 lg:w-6 ${
                    on
                      ? 'border-teal bg-teal/15 text-teal shadow-glow'
                      : 'border-white/12 bg-abyss-900 text-faint group-hover:border-teal/50 group-hover:text-haze'
                  }`}
                >
                  <Icon size={15} className="lg:hidden" />
                  <span
                    className={`hidden h-1.5 w-1.5 rounded-full lg:block ${
                      on ? 'bg-teal animate-nodepulse' : 'bg-faint'
                    }`}
                  />
                </span>
                <span
                  className={`hidden font-mono text-[11px] uppercase tracking-[0.18em] transition-colors lg:inline ${
                    on ? 'text-mist' : 'text-faint group-hover:text-haze'
                  }`}
                >
                  {n.label}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-3 font-mono text-[8px] tracking-widest text-faint lg:hidden">
                  {n.short}
                </span>
              </button>
            );
          })}
        </nav>

        {/* PUBLISH TRIGGER */}
        <button
          type="button"
          onClick={onPublish}
          className="focus-ring mt-12 flex h-11 items-center justify-center gap-2 border border-teal/45 bg-gradient-to-b from-teal/20 to-violet/15 text-teal transition-colors hover:from-teal/30 hover:to-violet/25 lg:mt-14 lg:justify-start lg:px-3"
          aria-label="Publish a policy"
        >
          <ShieldPlus size={17} />
          <span className="hidden font-mono text-[11px] font-700 uppercase tracking-[0.18em] lg:inline">
            Publish
          </span>
        </button>
      </div>

      {/* UTILITY LINKS spread along the rail foot, not bunched in content */}
      <div className="hidden w-full flex-col gap-2 lg:flex">
        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-teal"
        >
          <Droplets size={12} className="text-teal" /> Top up gas
        </a>
        <a
          href={EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-teal"
        >
          <ExternalLink size={11} /> Explorer
        </a>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-teal"
        >
          <BookOpen size={11} /> Docs
        </a>
      </div>
    </aside>
  );
}

/** Tracks which floating section is in view, for rail highlighting. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.1, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}
