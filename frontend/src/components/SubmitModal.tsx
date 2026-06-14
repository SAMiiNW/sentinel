'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldCheck, ScanSearch, TriangleAlert, ExternalLink, Wallet } from 'lucide-react';
import type { useTransaction } from '@/hooks/useTransaction';
import type { Policy } from '@/lib/contract';
import { ConsensusStage } from './ConsensusStage';
import { PolicyCard } from './PolicyCard';
import { EXPLORER, FAUCET } from '@/lib/contract';

const MAX_TITLE = 120;
const MAX_POLICY = 600;
const MAX_CONTENT = 800;

export type ModalMode = 'publish' | 'check';

interface Props {
  open: boolean;
  mode: ModalMode;
  target: Policy | null;
  onClose: () => void;
  address: `0x${string}` | null;
  chainOk: boolean;
  onConnect: () => void;
  txApi: ReturnType<typeof useTransaction>;
  setTxInFlight: (v: boolean) => void;
}

export function SubmitModal({
  open,
  mode,
  target,
  onClose,
  address,
  chainOk,
  onConnect,
  txApi,
  setTxInFlight,
}: Props) {
  const { state, submitPublish, submitCheck, reset } = txApi;
  const [title, setTitle] = useState('');
  const [policy, setPolicy] = useState('');
  const [content, setContent] = useState('');
  const [confirming, setConfirming] = useState(false);
  const firstRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (open && state.phase === 'idle') {
      setTitle('');
      setPolicy('');
      setContent('');
      setConfirming(false);
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open, mode, state.phase]);

  if (!open) return null;

  const busy = state.phase === 'wallet' || state.phase === 'submitted' || state.phase === 'consensus';

  const titleErr = title.trim().length === 0 ? 'Required' : title.length > MAX_TITLE ? 'Too long' : '';
  const policyErr =
    policy.trim().length === 0 ? 'Required' : policy.length > MAX_POLICY ? 'Too long' : '';
  const contentErr =
    content.trim().length === 0 ? 'Required' : content.length > MAX_CONTENT ? 'Too long' : '';
  const valid = mode === 'publish' ? !titleErr && !policyErr : !contentErr;

  function handleClose() {
    if (busy) return;
    setConfirming(false);
    reset();
    onClose();
  }

  function startConfirm() {
    if (!valid) return;
    if (!address) {
      onConnect();
      return;
    }
    setConfirming(true);
  }

  async function doSubmit() {
    if (!address) return;
    setConfirming(false);
    if (mode === 'publish') {
      await submitPublish(address, title.trim(), policy.trim(), setTxInFlight);
    } else if (target) {
      await submitCheck(address, target.id, content.trim(), setTxInFlight);
    }
  }

  const heading = mode === 'publish' ? 'Publish a policy' : 'Check content';
  const HeadIcon = mode === 'publish' ? ShieldCheck : ScanSearch;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-abyss-900/80 p-0 backdrop-blur-md sm:p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong relative flex h-full w-full max-w-2xl flex-col overflow-y-auto rounded-none sm:h-auto sm:max-h-[90vh] sm:rounded-4xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-abyss-800/80 px-6 py-4 backdrop-blur-xl">
            <span className="flex items-center gap-2 font-display text-lg font-700 tracking-tight text-mist">
              <HeadIcon size={20} className="text-teal" /> {heading}
            </span>
            {!busy && (
              <button
                type="button"
                aria-label="Close"
                onClick={handleClose}
                className="focus-ring text-faint hover:text-mist"
              >
                <X size={22} />
              </button>
            )}
          </div>

          <div className="p-6">
            {/* FORM */}
            {state.phase === 'idle' && !confirming && (
              <div>
                {mode === 'check' && target && (
                  <div className="mb-5 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="uplabel text-faint">Checking against</p>
                    <p className="mt-1 font-display text-base text-mist">{target.title}</p>
                    <p className="mt-2 font-body text-xs leading-relaxed text-haze">{target.policy}</p>
                  </div>
                )}

                {mode === 'publish' ? (
                  <>
                    <label className="block">
                      <span className="uplabel font-mono text-faint">Policy title</span>
                      <input
                        ref={firstRef as React.RefObject<HTMLInputElement>}
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE + 10))}
                        placeholder="A short name for this policy"
                        className="focus-ring mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-body text-mist placeholder:text-faint"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-blocked">{title.length > 0 ? titleErr : ''}</span>
                        <span className={title.length > MAX_TITLE ? 'text-blocked' : 'text-faint'}>
                          {title.length}/{MAX_TITLE}
                        </span>
                      </div>
                    </label>

                    <label className="mt-4 block">
                      <span className="uplabel font-mono text-faint">Policy rules</span>
                      <textarea
                        value={policy}
                        onChange={(e) => setPolicy(e.target.value.slice(0, MAX_POLICY + 30))}
                        rows={6}
                        placeholder="Spell out what is allowed and what is not. The moderator judges content strictly against these rules."
                        className="focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-body text-mist placeholder:text-faint"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-blocked">{policy.length > 0 ? policyErr : ''}</span>
                        <span className={policy.length > MAX_POLICY ? 'text-blocked' : 'text-faint'}>
                          {policy.length}/{MAX_POLICY}
                        </span>
                      </div>
                    </label>
                  </>
                ) : (
                  <label className="block">
                    <span className="uplabel font-mono text-faint">Content to check</span>
                    <textarea
                      ref={firstRef as React.RefObject<HTMLTextAreaElement>}
                      value={content}
                      onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT + 40))}
                      rows={7}
                      placeholder="Paste the content to be moderated. The moderator judges only against the published policy."
                      className="focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-body text-mist placeholder:text-faint"
                    />
                    <div className="mt-1 flex justify-between font-mono text-xs">
                      <span className="text-blocked">{content.length > 0 ? contentErr : ''}</span>
                      <span className={content.length > MAX_CONTENT ? 'text-blocked' : 'text-faint'}>
                        {content.length}/{MAX_CONTENT}
                      </span>
                    </div>
                  </label>
                )}

                {!address ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet py-3.5 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <Wallet size={16} /> Connect wallet
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!valid}
                    onClick={startConfirm}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal to-violet py-3.5 font-mono text-sm font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HeadIcon size={16} />
                    {mode === 'publish' ? 'Publish the policy' : 'Send to the moderator'}
                  </button>
                )}
                {!chainOk && address && (
                  <p className="mt-3 text-center font-mono text-xs text-flagged">
                    Switch your wallet to Bradbury (4221) before submitting.
                  </p>
                )}
              </div>
            )}

            {/* CONFIRM */}
            {state.phase === 'idle' && confirming && (
              <div className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-teal/40 bg-teal/10 shadow-glow">
                  <TriangleAlert size={28} className="text-teal" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-600 tracking-tight text-mist">
                  Confirm submission
                </h3>
                <p className="mt-3 font-body text-sm text-haze">
                  This submits a transaction on Bradbury Testnet. Network fees apply (mostly refunded
                  after the AI write). No deposit is taken. Continue?
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="focus-ring flex-1 rounded-2xl border border-white/12 py-3 font-mono text-xs font-600 uppercase tracking-wider text-haze hover:text-mist"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={doSubmit}
                    className="focus-ring flex-1 rounded-2xl bg-gradient-to-r from-teal to-violet py-3 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* WALLET / SUBMITTED */}
            {(state.phase === 'wallet' || state.phase === 'submitted') && (
              <div className="flex flex-col items-center py-10 text-center">
                <ShieldCheck size={44} className="animate-pulse text-teal" />
                <h3 className="mt-5 font-display text-2xl font-600 tracking-tight text-mist">
                  {state.phase === 'wallet' ? 'Confirm in your wallet' : 'Submitted to Bradbury'}
                </h3>
                <p className="mt-2 font-body text-sm text-haze">
                  {state.phase === 'wallet'
                    ? 'Approve the transaction to proceed.'
                    : 'Your submission is queued. Consensus is beginning.'}
                </p>
                {state.hash && (
                  <a
                    href={`${EXPLORER}/tx/${state.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 font-mono text-xs text-teal hover:underline"
                  >
                    View transaction <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* CONSENSUS */}
            {state.phase === 'consensus' && (
              <div className="py-4">
                <ConsensusStage tx={state} />
              </div>
            )}

            {/* CONFIRMED */}
            {state.phase === 'confirmed' && (
              <div>
                <p className="text-center font-display text-2xl font-700 tracking-tight text-mist">
                  {state.kind === 'publish' ? 'Policy is on the registry' : 'The moderator has ruled'}
                </p>
                <p className="mt-2 text-center font-body text-sm text-haze">
                  {state.kind === 'publish'
                    ? 'Anyone can now submit content to be checked against it.'
                    : 'Sealed under validator consensus and written on-chain.'}
                </p>
                {state.result && (
                  <div className="mt-6">
                    <PolicyCard policy={state.result} fresh />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="focus-ring mt-6 w-full rounded-2xl bg-gradient-to-r from-teal to-violet py-3 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900 shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  Done
                </button>
              </div>
            )}

            {/* ERROR */}
            {state.phase === 'error' && (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blocked/50 bg-blocked/10">
                  <TriangleAlert size={28} className="text-blocked" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-600 tracking-tight text-mist">
                  Submission failed
                </h3>
                <p className="mt-2 max-w-sm font-body text-sm text-haze">{state.error}</p>
                {/fee reserve|LackOfFundForMaxFee/i.test(state.error ?? '') && (
                  <a
                    href={FAUCET}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 font-mono text-xs text-teal hover:underline"
                  >
                    Claim test GEN
                  </a>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="focus-ring rounded-2xl bg-gradient-to-r from-teal to-violet px-6 py-2.5 font-mono text-xs font-700 uppercase tracking-wider text-abyss-900"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="focus-ring rounded-2xl border border-white/12 px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-haze hover:text-mist"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
