"use client";

import { useMemo } from "react";
import { useWallet } from "@/lib/WalletProvider";
import { shortAddress } from "@/lib/monad";

type Tier = {
  name: string;
  emoji: string;
  min: number;
  blurb: string;
  bg: string;
};

const TIERS: Tier[] = [
  { name: "Plankton", emoji: "🦠", min: 0, blurb: "Just washed ashore.", bg: "bg-white" },
  { name: "Shrimp", emoji: "🦐", min: 1, blurb: "Tiny but mighty.", bg: "bg-[#ffd7e6]" },
  { name: "Crab", emoji: "🦀", min: 10, blurb: "Walking sideways with style.", bg: "bg-[#ffd7c2]" },
  { name: "Lobster", emoji: "🦞", min: 50, blurb: "Pinching with authority.", bg: "bg-sunny" },
  { name: "Kraken", emoji: "🐙", min: 200, blurb: "The deep fears you.", bg: "bg-[#d9ccff]" },
];

function tierFor(balance: number): { tier: Tier; next: Tier | null; progress: number } {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (balance >= TIERS[i].min) idx = i;
  }
  const tier = TIERS[idx];
  const next = TIERS[idx + 1] ?? null;
  const progress = next
    ? Math.min(100, ((balance - tier.min) / (next.min - tier.min)) * 100)
    : 100;
  return { tier, next, progress };
}

/**
 * Unique tool #3 — Crab Tier.
 * Reads the connected wallet's live MON balance and assigns a crustacean rank.
 */
export function CrabTier() {
  const { address, balance, isMonad, connect, switchToMonad, hasWallet } = useWallet();
  const data = useMemo(() => tierFor(parseFloat(balance ?? "0")), [balance]);

  return (
    <div className="card-comic flex h-full flex-col">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full border-[4px] border-ink bg-ocean text-2xl">
          🏆
        </span>
        <h3 className="font-display text-2xl uppercase text-ink">Crab Tier</h3>
      </div>

      {!address ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 font-body text-ink/80">
            Connect your wallet to find your crustacean rank from your live MON
            balance.
          </p>
          <button onClick={connect} className="btn-cartoon w-full rotate-0" disabled={!hasWallet}>
            {hasWallet ? "Connect Wallet" : "Install MetaMask"}
          </button>
        </div>
      ) : !isMonad ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 font-body text-ink/80">
            You&apos;re connected, but not on Monad. Switch to read your tier.
          </p>
          <button onClick={switchToMonad} className="btn-cartoon-blue w-full rotate-0">
            Switch to Monad
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col items-center text-center">
            <div className={`grid h-28 w-28 animate-bob place-items-center rounded-full border-[5px] border-ink ${data.tier.bg} text-6xl shadow-comic-sm`}>
              {data.tier.emoji}
            </div>
            <div className="mt-4 font-display text-3xl uppercase text-ink">{data.tier.name}</div>
            <p className="mt-1 font-body text-ink/70">{data.tier.blurb}</p>
            <div className="mt-2 rounded-full border-[3px] border-ink bg-[#eaf7ff] px-3 py-1 font-body text-xs text-ink">
              {shortAddress(address)} · {balance} MON
            </div>
          </div>

          {data.next ? (
            <div className="mt-6">
              <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
                <span>To {data.next.name}</span>
                <span>{data.next.min} MON</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full border-[3px] border-ink bg-white">
                <div className="h-full rounded-full bg-bamboo transition-all duration-700" style={{ width: `${data.progress}%` }} />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-center font-display text-lg text-candy">
              Maxed out. You rule the reef! 👑
            </p>
          )}
        </div>
      )}
    </div>
  );
}
