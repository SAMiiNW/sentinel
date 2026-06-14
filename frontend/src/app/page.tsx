'use client';

import { useMemo, useState } from 'react';
import { LayoutList } from 'lucide-react';
import { ControlBar } from '@/components/ControlBar';
import { BentoHero } from '@/components/BentoHero';
import { Chronicle } from '@/components/Chronicle';
import { MeshCanvas } from '@/components/MeshCanvas';
import { PolicyTile } from '@/components/PolicyTile';
import { Skeleton, EmptyState, ErrorState } from '@/components/States';
import { SubmitModal, type ModalMode } from '@/components/SubmitModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Policy } from '@/lib/contract';

type Filter = 'ALL' | 'PENDING' | 'COMPLIANT' | 'FLAGGED' | 'BLOCKED';

function Dashboard() {
  const wallet = useWallet();
  const data = useContractData();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('publish');
  const [target, setTarget] = useState<Policy | null>(null);
  const [filter, setFilter] = useState<Filter>('ALL');
  const txApi = useTransaction(() => {
    void data.refresh();
  });

  const openPublish = () => {
    setMode('publish');
    setTarget(null);
    setModalOpen(true);
  };
  const openCheck = (p: Policy) => {
    setMode('check');
    setTarget(p);
    setModalOpen(true);
  };

  const sorted = useMemo(
    () => [...data.policies].sort((a, b) => b.index - a.index),
    [data.policies],
  );

  const openFirstCheck = () => {
    if (sorted.length > 0) openCheck(sorted[0]);
  };

  const filtered = useMemo(() => {
    if (filter === 'ALL') return sorted;
    if (filter === 'PENDING') return sorted.filter((p) => p.checks === 0);
    return sorted.filter((p) => p.checks > 0 && p.last_ruling === filter);
  }, [sorted, filter]);

  const ruledCounts = useMemo(() => {
    const ruled = data.policies.filter((p) => p.checks > 0);
    return {
      pending: data.policies.filter((p) => p.checks === 0).length,
      compliant: ruled.filter((p) => p.last_ruling === 'COMPLIANT').length,
      flagged: ruled.filter((p) => p.last_ruling === 'FLAGGED').length,
      blocked: ruled.filter((p) => p.last_ruling === 'BLOCKED').length,
    };
  }, [data.policies]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'ALL', label: `All ${data.derived.total}` },
    { key: 'PENDING', label: `Awaiting ${ruledCounts.pending}` },
    { key: 'COMPLIANT', label: `Compliant ${ruledCounts.compliant}` },
    { key: 'FLAGGED', label: `Flagged ${ruledCounts.flagged}` },
    { key: 'BLOCKED', label: `Blocked ${ruledCounts.blocked}` },
  ];

  return (
    <div className="relative min-h-screen">
      {/* living aurora mesh, fixed behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <MeshCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss-900/30 via-transparent to-abyss-900/70" />
      </div>

      <ControlBar wallet={wallet} onOpen={openPublish} />

      <main className="min-h-screen">
        <BentoHero
          onOpen={openPublish}
          onCheck={openFirstCheck}
          checksDisabled={sorted.length === 0}
          stats={data.derived}
        />

        {/* REGISTRY: title, then a segmented control on its own line, then a
            2-column masonry of policy tiles. Distinct from the sibling
            kicker + pills-on-the-right + 3-col grid. */}
        <section id="registry" className="relative px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2">
              <LayoutList size={16} className="text-teal" />
              <span className="uplabel font-mono text-teal">Policy registry</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-700 tracking-tight text-mist sm:text-3xl">
              Live policies and rulings
            </h2>

            {/* segmented filter control on its own line, full width */}
            <div className="mt-5 flex w-full flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`focus-ring flex-1 rounded-xl px-3 py-2 text-center font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    filter === f.key ? 'bg-teal/15 text-teal' : 'text-haze hover:text-mist'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-7">
              {data.loading ? (
                <Skeleton />
              ) : data.error ? (
                <ErrorState message={data.error} onRetry={() => data.refresh()} />
              ) : data.policies.length === 0 ? (
                <EmptyState onOpen={openPublish} />
              ) : filtered.length === 0 ? (
                <div className="glass rounded-3xl px-6 py-14 text-center font-body text-haze">
                  No policies match this filter yet.
                </div>
              ) : (
                <div className="columns-1 gap-5 md:columns-2">
                  {filtered.map((p) => (
                    <PolicyTile key={p.id} policy={p} onCheck={openCheck} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <Chronicle entries={data.chronicle} />

        {/* compact single-row footer strip, not a 3-column grid */}
        <footer className="border-t border-white/8 px-5 py-6 sm:px-8">
          <p className="mx-auto max-w-6xl text-center font-mono text-[11px] text-faint">
            Built on GenLayer Bradbury Testnet. Rulings are AI judgments under validator consensus,
            provided as is, not professional moderation or legal advice.
          </p>
        </footer>
      </main>

      <SubmitModal
        open={modalOpen}
        mode={mode}
        target={target}
        onClose={() => setModalOpen(false)}
        address={wallet.address}
        chainOk={wallet.chainOk}
        onConnect={wallet.connect}
        txApi={txApi}
        setTxInFlight={data.setTxInFlight}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
