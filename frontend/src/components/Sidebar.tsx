'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  LayoutList,
  Workflow,
  ScrollText,
  Gauge,
  Droplets,
  FileCode2,
} from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface DerivedStats {
  total: number;
  checks: number;
  compliant: number;
  flagged: number;
  blocked: number;
  cleanRate: number | null;
}

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  stats: DerivedStats;
  onOpen: () => void;
}

const NAV = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'how', label: 'How the gate works', icon: Workflow },
  { id: 'registry', label: 'Policy registry', icon: LayoutList },
  { id: 'chronicle', label: 'Audit trail', icon: ScrollText },
];

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</span>
      <span className={`tabular font-display text-base font-700 ${accent ?? 'text-mist'}`}>
        {value}
      </span>
    </div>
  );
}

function WalletBlock({
  wallet,
}: {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
}) {
  const [open, setOpen] = useState(false);
  const connected = !!wallet.address;

  if (!connected) {
    return (
      <button
        type="button"
        onClick={wallet.connect}
        disabled={wallet.connecting}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-2xl border border-teal/40 bg-teal/10 px-4 py-3 font-mono text-xs font-600 uppercase tracking-wider text-teal transition-colors hover:bg-teal/20 disabled:opacity-60"
      >
        <Wallet size={15} />
        {wallet.connecting ? 'Connecting' : 'Connect wallet'}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center justify-between gap-2 font-mono text-xs text-mist"
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${wallet.chainOk ? 'bg-teal shadow-glow' : 'bg-flagged'}`}
          />
          {shortAddr(wallet.address as string)}
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-3 border-t border-white/8 pt-3">
          <p className="uplabel text-faint">Connected wallet</p>
          <div className="mt-1 flex items-center justify-between gap-2 break-all font-mono text-[11px] text-haze">
            <span>{wallet.address}</span>
            <CopyButton value={wallet.address as string} label="Copy address" />
          </div>
          {!wallet.chainOk && (
            <p className="mt-2 rounded-xl border border-flagged/40 bg-flagged/10 p-2 font-mono text-[11px] text-flagged">
              Wrong network. Switch to Bradbury (4221).
            </p>
          )}
          <button
            type="button"
            onClick={wallet.disconnect}
            className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 font-mono text-[11px] uppercase tracking-wider text-haze transition-colors hover:border-blocked hover:text-blocked"
          >
            <LogOut size={13} /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

function SidebarBody({
  wallet,
  stats,
  onOpen,
  onNavigate,
}: Props & { onNavigate?: () => void }) {
  const goTo = (id: string) => {
    onNavigate?.();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      {/* brand */}
      <a
        href="#overview"
        onClick={(e) => {
          e.preventDefault();
          goTo('overview');
        }}
        className="focus-ring flex items-center gap-2.5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
          <ShieldCheck size={20} className="text-teal" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-700 tracking-tight text-mist">Sentinel</span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            Policy desk
          </span>
        </span>
      </a>

      {/* wallet */}
      <WalletBlock wallet={wallet} />

      {/* primary action */}
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onOpen();
        }}
        className="focus-ring flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-4 py-3 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
      >
        <ShieldCheck size={16} /> Publish policy
      </button>

      {/* live stats stack */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2">
        <p className="uplabel mb-1 mt-1 flex items-center gap-1.5 font-mono text-faint">
          <Gauge size={12} /> Live ledger
        </p>
        <StatRow label="Policies" value={stats.total} />
        <StatRow label="Checks" value={stats.checks} />
        <StatRow label="Compliant" value={stats.compliant} accent="text-compliant" />
        <StatRow label="Flagged" value={stats.flagged} accent="text-flagged" />
        <StatRow label="Blocked" value={stats.blocked} accent="text-blocked" />
        <StatRow
          label="Clean rate"
          value={stats.cleanRate === null ? 'n/a' : `${stats.cleanRate}%`}
          accent="text-teal"
        />
      </div>

      {/* nav */}
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => goTo(n.id)}
            className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wider text-haze transition-colors hover:bg-white/5 hover:text-teal"
          >
            <n.icon size={15} className="text-faint group-hover:text-teal" />
            {n.label}
          </button>
        ))}
      </nav>

      {/* resources, pushed to the bottom */}
      <div className="mt-auto space-y-3 border-t border-white/8 pt-4">
        <div className="flex items-center justify-between font-mono text-[11px] text-haze">
          <a
            href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-teal"
          >
            <FileCode2 size={12} /> Gate contract {shortAddr(CONTRACT_ADDRESS)}
          </a>
          <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
        </div>
        <a
          href={`${EXPLORER}/tx/${DEPLOY_TX}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] text-haze hover:text-teal"
        >
          Deck deploy {shortHash(DEPLOY_TX)} <ExternalLink size={11} />
        </a>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono text-[11px] text-haze hover:text-teal"
        >
          GenLayer docs <ExternalLink size={11} />
        </a>
        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 font-mono text-[11px] uppercase tracking-wider text-teal transition-colors hover:border-teal/40 hover:bg-teal/5"
        >
          <Droplets size={13} /> Top up gas
        </a>
      </div>
    </div>
  );
}

export function Sidebar({ wallet, stats, onOpen }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop: persistent full-height frosted rail */}
      <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto border-r border-white/10 lg:block">
        <SidebarBody wallet={wallet} stats={stats} onOpen={onOpen} />
      </aside>

      {/* Mobile: collapsed top bar */}
      <div className="glass fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 px-4 lg:hidden">
        <a href="#overview" className="focus-ring flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
            <ShieldCheck size={18} className="text-teal" />
          </span>
          <span className="font-display text-lg font-700 tracking-tight text-mist">Sentinel</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="focus-ring flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal to-violet px-3 py-2 font-mono text-[11px] font-700 uppercase tracking-wider text-abyss-900 shadow-glow"
          >
            <ShieldCheck size={14} /> Publish
          </button>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mist"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-abyss-900/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="glass-strong absolute inset-y-0 left-0 w-[min(88vw,20rem)] overflow-y-auto border-r border-white/10">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="focus-ring absolute right-4 top-5 z-10 text-faint hover:text-mist"
            >
              <X size={22} />
            </button>
            <SidebarBody
              wallet={wallet}
              stats={stats}
              onOpen={onOpen}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
