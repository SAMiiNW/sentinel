'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchPolicies,
  fetchChronicle,
  fetchStats,
  type Policy,
  type ChronicleEntry,
  type Stats,
} from '@/lib/contract';

const POLL_MS = 95000;

export interface ContractData {
  policies: Policy[];
  chronicle: ChronicleEntry[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  derived: {
    total: number;
    checks: number;
    compliant: number;
    flagged: number;
    blocked: number;
    cleanRate: number | null;
  };
  refresh: () => Promise<void>;
  setTxInFlight: (v: boolean) => void;
}

export function useContractData(): ContractData {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const txInFlight = useRef(false);
  const alive = useRef(true);

  const loadAll = useCallback(async () => {
    try {
      const allPolicies: Policy[] = [];
      let start = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchPolicies(start);
        allPolicies.push(...page);
        if (page.length < 20) break;
        start += 20;
      }
      const allChron: ChronicleEntry[] = [];
      start = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchChronicle(start);
        allChron.push(...page);
        if (page.length < 20) break;
        start += 20;
      }
      const s = await fetchStats();
      if (!alive.current) return;
      setPolicies(allPolicies);
      setChronicle(allChron);
      setStats(s);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      const msg = String(e);
      if (/contract not found|execution reverted/i.test(msg)) {
        setError(
          'No contract responded at the configured address on Bradbury. The deployment may need repair.',
        );
      } else {
        setError('Could not reach the contract.');
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const setTxInFlight = useCallback((v: boolean) => {
    txInFlight.current = v;
  }, []);

  useEffect(() => {
    alive.current = true;
    loadAll();
    const id = setInterval(() => {
      if (!txInFlight.current) loadAll();
    }, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [loadAll]);

  const derived = useMemo(() => {
    const total = policies.length;
    const checks = policies.reduce((acc, p) => acc + p.checks, 0);
    const compliant = stats?.compliant ?? 0;
    const flagged = stats?.flagged ?? 0;
    const blocked = stats?.blocked ?? 0;
    const totalChecks = stats?.checks ?? checks;
    return {
      total,
      checks: totalChecks,
      compliant,
      flagged,
      blocked,
      cleanRate: totalChecks > 0 ? Math.round((compliant / totalChecks) * 100) : null,
    };
  }, [policies, stats]);

  return { policies, chronicle, stats, loading, error, derived, refresh, setTxInFlight };
}
