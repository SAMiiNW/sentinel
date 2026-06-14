'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Chronicle } from '@/components/Chronicle';
import { Footer } from '@/components/Footer';
import { PolicyCard } from '@/components/PolicyCard';
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

  const filtered = useMemo(() => {
    const list = [...data.policies].sort((a, b) => b.index - a.index);
    if (filter === 'ALL') return list;
    if (filter === 'PENDING') return list.filter((p) => p.checks === 0);
    return list.filter((p) => p.checks > 0 && p.last_ruling === filter);
  }, [data.policies, filter]);

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
    <>
      <Header wallet={wallet} onOpen={openPublish} />
      <main>
        <Hero onOpen={openPublish} stats={data.derived} />
        <HowItWorks />

        {/* REGISTRY */}
        <section id="registry" className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="uplabel flex items-center gap-2 font-mono text-teal">
                  <LayoutGrid size={14} /> The policy registry
                </span>
                <h2 className="mt-3 font-display text-4xl font-700 leading-tight tracking-tight text-mist sm:text-5xl">
                  Live policies and rulings
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`focus-ring rounded-full border px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                      filter === f.key
                        ? 'border-teal bg-teal/15 text-teal'
                        : 'border-white/10 text-haze hover:border-teal/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12">
              {data.loading ? (
                <Skeleton />
              ) : data.error ? (
                <ErrorState message={data.error} onRetry={() => data.refresh()} />
              ) : data.policies.length === 0 ? (
                <EmptyState onOpen={openPublish} />
              ) : filtered.length === 0 ? (
                <div className="glass rounded-4xl px-6 py-14 text-center font-body text-haze">
                  No policies match this filter yet.
                </div>
              ) : (
                <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <PolicyCard key={p.id} policy={p} onCheck={openCheck} />
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <div className="glass mt-16 flex flex-col items-center justify-between gap-6 rounded-4xl p-8 sm:flex-row">
              <div>
                <h3 className="flex items-center gap-2 font-display text-2xl font-700 tracking-tight text-mist">
                  <ShieldCheck size={22} className="text-teal" /> Have rules to enforce?
                </h3>
                <p className="mt-2 max-w-xl font-body text-haze">
                  Publish a policy in plain language. When content arrives, the moderator rules under
                  consensus and the chain keeps the record.
                </p>
              </div>
              <button
                type="button"
                onClick={openPublish}
                className="focus-ring flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet px-7 py-4 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
              >
                <ShieldCheck size={18} /> Publish a policy
              </button>
            </div>
          </div>
        </section>

        <Chronicle entries={data.chronicle} />
      </main>

      <Footer />

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
    </>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
