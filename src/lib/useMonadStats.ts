"use client";

import { useEffect, useRef, useState } from "react";
import { MONAD_TESTNET } from "./monad";

export type MonadStats = {
  blockNumber: number | null;
  gasPriceGwei: string | null;
  latestBlockHash: string | null;
  online: boolean;
  loading: boolean;
};

let rpcId = 0;

async function rpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const res = await fetch(MONAD_TESTNET.rpcUrls[0], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++rpcId, method, params }),
  });
  if (!res.ok) throw new Error(`RPC ${method} failed: ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? "RPC error");
  return json.result as T;
}

/**
 * Polls the public Monad testnet RPC for live network vitals.
 * Used by the Network section and the on-chain "Lucky Claw".
 */
export function useMonadStats(intervalMs = 6000): MonadStats {
  const [stats, setStats] = useState<MonadStats>({
    blockNumber: null,
    gasPriceGwei: null,
    latestBlockHash: null,
    online: false,
    loading: true,
  });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const [blockHex, gasHex] = await Promise.all([
          rpc<string>("eth_blockNumber"),
          rpc<string>("eth_gasPrice"),
        ]);
        const blockNumber = parseInt(blockHex, 16);
        const gasWei = BigInt(gasHex);
        const gasPriceGwei = (Number(gasWei) / 1e9).toFixed(2);

        // Pull the latest block to grab its hash (entropy source for tools).
        const block = await rpc<{ hash: string } | null>("eth_getBlockByNumber", [
          blockHex,
          false,
        ]);

        if (cancelled) return;
        setStats({
          blockNumber,
          gasPriceGwei,
          latestBlockHash: block?.hash ?? null,
          online: true,
          loading: false,
        });
      } catch {
        if (cancelled) return;
        setStats((s) => ({ ...s, online: false, loading: false }));
      }
    }

    tick();
    timer.current = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [intervalMs]);

  return stats;
}
