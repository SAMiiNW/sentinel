import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import type { GenLayerClient } from 'genlayer-js/types';

export const CONTRACT_ADDRESS = '0x216c90ae3FB104640563f1391B2BbF44b7B9258B' as const;
export const DEPLOY_TX =
  '0x645d51c1175541fea0115d673c3a56a61a45fa5b0c740f19fd758b5546a2ffb4' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const CHAIN_ID = 4221;

export type Ruling = 'COMPLIANT' | 'FLAGGED' | 'BLOCKED' | '';

export interface Policy {
  id: string;
  title: string;
  policy: string;
  publisher: string;
  checks: number;
  last_ruling: Ruling;
  last_severity: number;
  last_rationale: string;
  index: number;
}

export interface ChronicleEntry {
  policy: string;
  title: string;
  event: 'PUBLISHED' | 'CHECKED';
  ruling: Ruling;
  severity: number;
  rationale: string;
  excerpt: string;
  by: string;
}

export interface Stats {
  policies: number;
  checks: number;
  compliant: number;
  flagged: number;
  blocked: number;
  owner: string;
}

export const readClient: GenLayerClient<typeof testnetBradbury> = createClient({
  chain: testnetBradbury,
});

export function makeWalletClient(account: `0x${string}`) {
  return createClient({ chain: testnetBradbury, account } as Parameters<typeof createClient>[0]);
}

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|-32/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function pick(raw: unknown, k: string): unknown {
  if (raw instanceof Map) return raw.get(k);
  if (raw && typeof raw === 'object') return (raw as Record<string, unknown>)[k];
  return undefined;
}

function asRuling(v: unknown): Ruling {
  const r = String(v ?? '').toUpperCase();
  return (['COMPLIANT', 'FLAGGED', 'BLOCKED'].includes(r) ? r : '') as Ruling;
}

function normalizePolicy(raw: unknown): Policy {
  return {
    id: String(pick(raw, 'id') ?? ''),
    title: String(pick(raw, 'title') ?? ''),
    policy: String(pick(raw, 'policy') ?? ''),
    publisher: String(pick(raw, 'publisher') ?? ''),
    checks: Number(pick(raw, 'checks') ?? 0),
    last_ruling: asRuling(pick(raw, 'last_ruling')),
    last_severity: Number(pick(raw, 'last_severity') ?? 0),
    last_rationale: String(pick(raw, 'last_rationale') ?? ''),
    index: Number(pick(raw, 'index') ?? 0),
  };
}

function normalizeChronicle(raw: unknown): ChronicleEntry {
  return {
    policy: String(pick(raw, 'policy') ?? ''),
    title: String(pick(raw, 'title') ?? ''),
    event: (String(pick(raw, 'event') ?? 'CHECKED').toUpperCase() === 'PUBLISHED'
      ? 'PUBLISHED'
      : 'CHECKED') as ChronicleEntry['event'],
    ruling: asRuling(pick(raw, 'ruling')),
    severity: Number(pick(raw, 'severity') ?? 0),
    rationale: String(pick(raw, 'rationale') ?? ''),
    excerpt: String(pick(raw, 'excerpt') ?? ''),
    by: String(pick(raw, 'by') ?? ''),
  };
}

function normalizeStats(raw: unknown): Stats {
  return {
    policies: Number(pick(raw, 'policies') ?? 0),
    checks: Number(pick(raw, 'checks') ?? 0),
    compliant: Number(pick(raw, 'compliant') ?? 0),
    flagged: Number(pick(raw, 'flagged') ?? 0),
    blocked: Number(pick(raw, 'blocked') ?? 0),
    owner: String(pick(raw, 'owner') ?? ''),
  };
}

export async function fetchPolicies(start = 0): Promise<Policy[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_policies',
      args: [start],
    }),
  );
  return Array.isArray(res) ? res.map(normalizePolicy) : [];
}

export async function fetchChronicle(start = 0): Promise<ChronicleEntry[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_chronicle',
      args: [start],
    }),
  );
  return Array.isArray(res) ? res.map(normalizeChronicle) : [];
}

export async function fetchStats(): Promise<Stats> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_stats',
      args: [],
    }),
  );
  return normalizeStats(res);
}

export async function publishPolicy(
  client: ReturnType<typeof makeWalletClient>,
  title: string,
  policy: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'publish_policy',
    args: [title, policy],
    value: 0n,
  }) as Promise<`0x${string}`>;
}

export async function submitContent(
  client: ReturnType<typeof makeWalletClient>,
  policyId: string,
  content: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'submit_content',
    args: [policyId, content],
    value: 0n,
  }) as Promise<`0x${string}`>;
}
