'use client';

import { useMemo, useState } from 'react';
import { CommandRail, useActiveSection } from '@/components/CommandRail';
import { OverviewField } from '@/components/OverviewField';
import { RegistryField } from '@/components/RegistryField';
import { TraceStream } from '@/components/TraceStream';
import { MeshCanvas } from '@/components/MeshCanvas';
import { SubmitModal, type ModalMode } from '@/components/SubmitModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Policy } from '@/lib/contract';

const SECTIONS = ['overview', 'registry', 'trace'];

function Console() {
  const wallet = useWallet();
  const data = useContractData();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('publish');
  const [target, setTarget] = useState<Policy | null>(null);
  const active = useActiveSection(SECTIONS);
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

  return (
    <div className="relative min-h-screen">
      {/* ambient aurora mesh, far behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <MeshCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-abyss-900/55 via-abyss-900/35 to-abyss-900/80" />
        <div className="grid-faint absolute inset-0 opacity-40" />
      </div>

      <CommandRail wallet={wallet} onPublish={openPublish} active={active} />

      {/* operations field, offset right of the command rail */}
      <main className="relative min-h-screen pl-[68px] lg:pl-[232px]">
        <OverviewField
          onOpen={openPublish}
          onCheck={openFirstCheck}
          checksDisabled={sorted.length === 0}
          stats={data.derived}
        />

        <RegistryField
          policies={data.policies}
          loading={data.loading}
          error={data.error}
          total={data.derived.total}
          onRetry={() => data.refresh()}
          onOpen={openPublish}
          onCheck={openCheck}
        />

        <TraceStream entries={data.chronicle} />

        {/* thin disclaimer ribbon pinned at the bottom of the field */}
        <footer className="border-t border-white/8 px-5 py-6 sm:px-8 lg:px-10">
          <p className="mx-auto max-w-3xl text-center font-mono text-[11px] leading-relaxed text-faint">
            Sentinel runs on the GenLayer Bradbury testnet, where each ruling is an AI judgment
            confirmed by validator consensus. The desk holds no deposits and takes no custody, and
            its calls are not professional moderation or legal advice.
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
      <Console />
    </ToastProvider>
  );
}
