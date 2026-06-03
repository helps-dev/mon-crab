"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { useWallet } from "@/lib/WalletProvider";
import { STAKING } from "@/lib/staking";
import {
  useStaking,
  approveCrab,
  stakeCrab,
  withdrawCrab,
  claimReward,
  emergencyWithdraw,
  faucetCrab,
  faucetWmon,
} from "@/lib/useStaking";

type Tab = "stake" | "unstake";

function fmt(v: string, dp = 2) {
  const n = Number(v);
  if (!isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: dp });
}

export function StakingSection() {
  const { address, isMonad, connect, switchToMonad, hasWallet } = useWallet();
  const [refresh, setRefresh] = useState(0);
  const { data } = useStaking(address, refresh);

  const [tab, setTab] = useState<Tab>("stake");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const needsApproval =
    tab === "stake" &&
    amount !== "" &&
    Number(data.allowance) < Number(amount || "0");

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    setMsg(null);
    try {
      await fn();
      setMsg({ type: "ok", text: `${label} success!` });
      setAmount("");
      setRefresh((r) => r + 1);
    } catch (e) {
      const err = e as { shortMessage?: string; message?: string };
      setMsg({ type: "err", text: err?.shortMessage ?? err?.message ?? "Transaction failed." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section id="staking" className="relative py-24">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <span className="chip-comic mb-5">🥩 Stake & Earn</span>
            <h2 className="stroke-title-yellow text-5xl sm:text-6xl">Crab Staking</h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg font-bold text-ink">
              Stake your $CRAB (launched on nad.fun) and earn WMON rewards every
              second. Pinch now, feast later.
            </p>
          </div>
        </Reveal>

        {/* Stat ribbon */}
        <Reveal delay={0.05}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="APR (est.)" value={data.apr != null ? `${fmt(String(data.apr), 1)}%` : "—"} tilt="-rotate-2" bg="bg-sunny" />
            <Stat label="Total Staked" value={`${fmt(data.totalStaked)} CRAB`} tilt="rotate-2" bg="bg-[#d9ccff]" />
            <Stat label="Your Stake" value={`${fmt(data.staked)} CRAB`} tilt="-rotate-2" bg="bg-[#c2ecff]" />
            <Stat label="Your Rewards" value={`${fmt(data.earned, 4)} WMON`} tilt="rotate-2" bg="bg-[#ffd7c2]" />
          </div>
        </Reveal>

        {/* Staking panel */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-xl">
            <div className="card-comic">
              {!STAKING.address ? (
                <NotConfigured />
              ) : !address ? (
                <div className="py-8 text-center">
                  <p className="mb-5 font-body text-lg text-ink">
                    Connect your wallet to start staking.
                  </p>
                  <button onClick={connect} disabled={!hasWallet} className="btn-cartoon rotate-0">
                    {hasWallet ? "Connect Wallet" : "Install MetaMask"}
                  </button>
                </div>
              ) : !isMonad ? (
                <div className="py-8 text-center">
                  <p className="mb-5 font-body text-lg text-ink">
                    Switch to the Monad network to stake.
                  </p>
                  <button onClick={switchToMonad} className="btn-cartoon-blue rotate-0">
                    Switch to Monad
                  </button>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="mb-5 flex gap-2 rounded-2xl border-[4px] border-ink bg-[#eaf7ff] p-1.5">
                    {(["stake", "unstake"] as Tab[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTab(t);
                          setAmount("");
                          setMsg(null);
                        }}
                        className={`flex-1 rounded-xl py-2.5 font-display text-lg uppercase transition-colors ${
                          tab === t ? "bg-candy text-white" : "text-ink/60 hover:text-ink"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Balance row */}
                  <div className="mb-2 flex items-center justify-between font-body text-sm text-ink/70">
                    <span>{tab === "stake" ? "Wallet" : "Staked"}</span>
                    <button
                      className="font-display uppercase text-ocean hover:underline"
                      onClick={() =>
                        setAmount(tab === "stake" ? data.crabBalance : data.staked)
                      }
                    >
                      Max: {fmt(tab === "stake" ? data.crabBalance : data.staked, 4)} CRAB
                    </button>
                  </div>

                  <input
                    type="number"
                    min="0"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-comic font-display text-2xl"
                  />

                  {/* Actions */}
                  <div className="mt-5 space-y-3">
                    {tab === "stake" ? (
                      needsApproval ? (
                        <button
                          onClick={() => run("Approve", () => approveCrab(amount))}
                          disabled={!!busy || !amount}
                          className="btn-cartoon-yellow w-full rotate-0 disabled:opacity-60"
                        >
                          {busy === "Approve" ? "Approving..." : "Approve CRAB"}
                        </button>
                      ) : (
                        <button
                          onClick={() => run("Stake", () => stakeCrab(amount))}
                          disabled={!!busy || !amount || data.paused}
                          className="btn-cartoon w-full rotate-0 disabled:opacity-60"
                        >
                          {data.paused ? "Staking Paused" : busy === "Stake" ? "Staking..." : "Stake CRAB"}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => run("Unstake", () => withdrawCrab(amount))}
                        disabled={!!busy || !amount}
                        className="btn-cartoon w-full rotate-0 disabled:opacity-60"
                      >
                        {busy === "Unstake" ? "Unstaking..." : "Unstake CRAB"}
                      </button>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => run("Claim", () => claimReward())}
                        disabled={!!busy || Number(data.earned) <= 0}
                        className="btn-cartoon-blue flex-1 rotate-0 text-base disabled:opacity-50"
                      >
                        Claim {fmt(data.earned, 4)} WMON
                      </button>
                    </div>

                    <button
                      onClick={() => run("Emergency withdraw", () => emergencyWithdraw())}
                      disabled={!!busy || Number(data.staked) <= 0}
                      className="w-full rounded-2xl border-[3px] border-ink bg-white py-2.5 font-display text-sm uppercase text-candy transition-colors hover:bg-candy hover:text-white disabled:opacity-40"
                    >
                      Emergency Withdraw (forfeit rewards)
                    </button>
                  </div>

                  {/* Testnet faucets */}
                  <div className="mt-5 rounded-2xl border-[3px] border-dashed border-ink/40 bg-[#eaf7ff] p-3">
                    <p className="mb-2 text-center font-body text-xs uppercase text-ink/60">
                      Testnet faucets — grab tokens to try staking
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => run("CRAB faucet", () => faucetCrab())}
                        disabled={!!busy}
                        className="flex-1 rounded-xl border-[3px] border-ink bg-sunny py-2 font-display text-sm uppercase text-ink transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        Get CRAB
                      </button>
                      <button
                        onClick={() => run("WMON faucet", () => faucetWmon())}
                        disabled={!!busy}
                        className="flex-1 rounded-xl border-[3px] border-ink bg-[#d9ccff] py-2 font-display text-sm uppercase text-ink transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        Get WMON
                      </button>
                    </div>
                  </div>

                  {data.paused && (
                    <p className="mt-4 rounded-xl border-[3px] border-ink bg-sunny px-3 py-2 text-center font-body text-sm text-ink">
                      ⚠️ Staking is paused by admin. You can still unstake and claim.
                    </p>
                  )}

                  {msg && (
                    <p
                      className={`mt-4 rounded-xl border-[3px] border-ink px-3 py-2 text-center font-body text-sm ${
                        msg.type === "ok" ? "bg-bamboo/30 text-ink" : "bg-candy/20 text-candy"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}
                </>
              )}
            </div>

            <p className="mt-4 text-center font-body text-xs text-ink/50">
              Staking is non-custodial. The contract cannot seize your staked
              principal — admin powers are limited to rewards and stray tokens.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, value, tilt, bg }: { label: string; value: string; tilt: string; bg: string }) {
  return (
    <div className={`card-comic ${bg} ${tilt} p-4 text-center`}>
      <div className="font-display text-xl text-ink sm:text-2xl">{value}</div>
      <div className="mt-1 font-body text-xs uppercase text-ink/70">{label}</div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="py-8 text-center">
      <div className="mb-3 text-4xl">🛠️</div>
      <p className="font-display text-xl uppercase text-ink">Staking coming soon</p>
      <p className="mx-auto mt-2 max-w-sm font-body text-sm text-ink/70">
        The staking contract isn&apos;t live yet. Deploy <code>CrabStaking</code>{" "}
        from the <code>/contracts</code> folder and set the addresses in
        <code> .env.local</code> to switch this on.
      </p>
    </div>
  );
}
