"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { useMonadStats } from "@/lib/useMonadStats";
import { useWallet } from "@/lib/WalletProvider";
import { MONAD_TESTNET, addMonadNetwork } from "@/lib/monad";
import { SITE } from "@/lib/site";

function StatCard({
  label,
  value,
  suffix,
  live,
  tilt,
}: {
  label: string;
  value: string;
  suffix?: string;
  live?: boolean;
  tilt: string;
}) {
  return (
    <div className={`card-comic-blue ${tilt} hover:rotate-0 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <span className="font-body text-sm uppercase text-ink/60">{label}</span>
        {live && (
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-bamboo opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-ink bg-bamboo" />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl text-ink">
        {value}
        {suffix && <span className="ml-1 text-lg text-ocean">{suffix}</span>}
      </div>
    </div>
  );
}

export function NetworkSection() {
  const stats = useMonadStats();
  const { hasWallet } = useWallet();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleAdd = async () => {
    setErr(null);
    setAdding(true);
    try {
      await addMonadNetwork();
      setAdded(true);
    } catch (e) {
      const m = e as { message?: string };
      setErr(m?.message ?? "Failed to add network.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section id="network" className="relative py-24">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <span className="chip-comic mb-5">⚡ Powered by Monad</span>
            <h2 className="stroke-title-yellow text-5xl sm:text-6xl">
              Live Network
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg font-bold text-ink">
              $CRAB rides on Monad — a super-fast EVM chain. These numbers are
              pulled live from the testnet, right now.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Network" value={stats.online ? "Online" : "Offline"} live={stats.online} tilt="-rotate-2" />
            <StatCard label="Latest Block" value={stats.blockNumber ? `#${stats.blockNumber.toLocaleString()}` : "—"} tilt="rotate-2" />
            <StatCard label="Gas Price" value={stats.gasPriceGwei ?? "—"} suffix="Gwei" tilt="-rotate-2" />
            <StatCard label="Chain ID" value={String(MONAD_TESTNET.chainIdDec)} tilt="rotate-2" />
          </div>
        </Reveal>

        {/* Add network panel */}
        <Reveal delay={0.2}>
          <div className="mt-10 rounded-[2rem] border-[5px] border-ink bg-ocean p-8 shadow-comic sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="text-white">
                <h3 className="font-display text-3xl uppercase text-stroke-sm">
                  Add Monad to your wallet
                </h3>
                <p className="mt-3 max-w-md font-body text-lg">
                  One click to add Monad Testnet to MetaMask. Then grab some test
                  MON from the faucet and start pinching!
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                    MON
                  </span>
                  <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                    Chain {MONAD_TESTNET.chainIdDec}
                  </span>
                  <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                    testnet-rpc
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button
                  onClick={handleAdd}
                  disabled={adding || !hasWallet}
                  className="btn-cartoon-yellow disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {!hasWallet ? "Install MetaMask" : adding ? "Adding..." : added ? "✓ Added" : "Add Network"}
                </button>
                <a href={SITE.links.faucet} target="_blank" rel="noreferrer" className="btn-cartoon">
                  Get Test MON
                </a>
              </div>
            </div>
            {err && (
              <p className="mt-4 rounded-xl border-[3px] border-ink bg-white px-3 py-2 font-body text-sm text-candy">
                {err}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
