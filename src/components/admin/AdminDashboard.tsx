"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "@/lib/WalletProvider";
import { STAKING, isStakingConfigured } from "@/lib/staking";
import { shortAddress } from "@/lib/monad";
import {
  useStaking,
  adminNotifyReward,
  adminMintWmon,
  adminSetDuration,
  adminSetPaused,
  adminRecoverToken,
  adminDrainRewards,
} from "@/lib/useStaking";

function fmt(v: string, dp = 2) {
  const n = Number(v);
  return isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: dp }) : "0";
}

export function AdminDashboard() {
  const { address, isMonad, connect, switchToMonad, hasWallet } = useWallet();
  const [refresh, setRefresh] = useState(0);
  const { data } = useStaking(address, refresh);

  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // form state
  const [rewardAmt, setRewardAmt] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [mintAmt, setMintAmt] = useState("");
  const [durationDays, setDurationDays] = useState("7");
  const [recoverToken, setRecoverToken] = useState("");
  const [recoverAmt, setRecoverAmt] = useState("");

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    setMsg(null);
    try {
      await fn();
      setMsg({ type: "ok", text: `${label} success!` });
      setRefresh((r) => r + 1);
    } catch (e) {
      const err = e as { shortMessage?: string; message?: string };
      setMsg({ type: "err", text: err?.shortMessage ?? err?.message ?? "Transaction failed." });
    } finally {
      setBusy(null);
    }
  };

  const periodFinishLabel =
    data.periodFinish > 0
      ? new Date(data.periodFinish * 1000).toLocaleString()
      : "—";
  const periodActive = data.periodFinish * 1000 > Date.now();

  return (
    <main className="min-h-screen py-10">
      <div className="container-x">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="font-display text-sm uppercase text-ocean hover:underline">
              ← Back to site
            </Link>
            <h1 className="stroke-title-yellow mt-2 text-4xl sm:text-5xl">Admin Dashboard</h1>
          </div>
          {address && (
            <span className="chip-comic rotate-0">
              {data.isOwner ? "👑 Owner" : "👤 Visitor"} · {shortAddress(address)}
            </span>
          )}
        </div>

        {/* Gating */}
        {!isStakingConfigured() ? (
          <Card>
            <Empty
              emoji="🛠️"
              title="Staking not configured"
              body="Deploy CrabStaking and set NEXT_PUBLIC_STAKING_ADDRESS / CRAB / WMON in .env.local."
            />
          </Card>
        ) : !address ? (
          <Card>
            <div className="py-8 text-center">
              <p className="mb-5 font-body text-lg text-ink">Connect the owner wallet to manage staking.</p>
              <button onClick={connect} disabled={!hasWallet} className="btn-cartoon rotate-0">
                {hasWallet ? "Connect Wallet" : "Install MetaMask"}
              </button>
            </div>
          </Card>
        ) : !isMonad ? (
          <Card>
            <div className="py-8 text-center">
              <p className="mb-5 font-body text-lg text-ink">Switch to Monad to continue.</p>
              <button onClick={switchToMonad} className="btn-cartoon-blue rotate-0">Switch to Monad</button>
            </div>
          </Card>
        ) : !data.isOwner ? (
          <Card>
            <Empty
              emoji="🚫"
              title="Not authorized"
              body={`This wallet is not the contract owner. Connect the owner account to access admin controls.`}
            />
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Total Staked" value={`${fmt(data.totalStaked)} CRAB`} bg="bg-[#d9ccff]" tilt="-rotate-2" />
              <Metric label="Reward / period" value={`${fmt(data.rewardForDuration)} WMON`} bg="bg-sunny" tilt="rotate-2" />
              <Metric label="Status" value={data.paused ? "Paused" : "Active"} bg={data.paused ? "bg-candy/30" : "bg-[#c2ecff]"} tilt="-rotate-2" />
              <Metric label="Period ends" value={periodActive ? "Running" : "Ended"} sub={periodFinishLabel} bg="bg-[#ffd7c2]" tilt="rotate-2" />
            </div>

            {msg && (
              <p
                className={`rounded-2xl border-[4px] border-ink px-4 py-3 text-center font-body ${
                  msg.type === "ok" ? "bg-bamboo/30 text-ink" : "bg-candy/20 text-candy"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Fund rewards */}
              <Card>
                <Section title="💰 Fund Rewards" desc="Mints fresh WMON to you, approves it, and (re)starts a reward period — all in one click.">
                  <label className="block font-body text-sm uppercase text-ink/70">WMON amount</label>
                  <input value={rewardAmt} onChange={(e) => setRewardAmt(e.target.value)} type="number" min="0" placeholder="70000" className="input-comic mt-1" />
                  <button
                    onClick={() => run("Fund rewards", () => adminNotifyReward(rewardAmt, true))}
                    disabled={!!busy || !rewardAmt}
                    className="btn-cartoon mt-4 w-full rotate-0 disabled:opacity-60"
                  >
                    {busy === "Fund rewards" ? "Minting & funding..." : "Mint + Fund Rewards"}
                  </button>
                </Section>
              </Card>

              {/* Mint WMON */}
              <Card>
                <Section title="🪙 Mint WMON" desc="Mint WMON to any address without starting a reward period (airdrops, top-ups, testing).">
                  <label className="block font-body text-sm uppercase text-ink/70">Recipient</label>
                  <input value={mintTo} onChange={(e) => setMintTo(e.target.value)} placeholder="0x… (defaults to you)" className="input-comic mt-1" />
                  <label className="mt-3 block font-body text-sm uppercase text-ink/70">WMON amount</label>
                  <input value={mintAmt} onChange={(e) => setMintAmt(e.target.value)} type="number" min="0" placeholder="1000" className="input-comic mt-1" />
                  <button
                    onClick={() => run("Mint WMON", () => adminMintWmon(mintTo || address!, mintAmt))}
                    disabled={!!busy || !mintAmt}
                    className="btn-cartoon-yellow mt-4 w-full rotate-0 disabled:opacity-60"
                  >
                    {busy === "Mint WMON" ? "Minting..." : "Mint WMON"}
                  </button>
                </Section>
              </Card>

              {/* Duration */}
              <Card>
                <Section title="⏱️ Reward Duration" desc="Set the length of a reward period. Only allowed when no period is active.">
                  <label className="block font-body text-sm uppercase text-ink/70">Days</label>
                  <input value={durationDays} onChange={(e) => setDurationDays(e.target.value)} type="number" min="1" className="input-comic mt-1" />
                  <button
                    onClick={() => run("Set duration", () => adminSetDuration(Math.round(Number(durationDays) * 86400)))}
                    disabled={!!busy || !durationDays || periodActive}
                    className="btn-cartoon-blue mt-4 w-full rotate-0 disabled:opacity-50"
                  >
                    {periodActive ? "Period active — wait" : busy === "Set duration" ? "Saving..." : "Set Duration"}
                  </button>
                </Section>
              </Card>

              {/* Pause */}
              <Card>
                <Section title="⏸️ Pause Controls" desc="Pausing blocks new stakes. Users can always unstake and claim — and emergency-withdraw.">
                  <div className="flex gap-3">
                    <button
                      onClick={() => run("Pause", () => adminSetPaused(true))}
                      disabled={!!busy || data.paused}
                      className="btn-cartoon flex-1 rotate-0 disabled:opacity-50"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => run("Unpause", () => adminSetPaused(false))}
                      disabled={!!busy || !data.paused}
                      className="btn-cartoon-yellow flex-1 rotate-0 disabled:opacity-50"
                    >
                      Unpause
                    </button>
                  </div>
                </Section>
              </Card>

              {/* Emergency / sweep */}
              <Card>
                <Section title="🚨 Emergency & Sweep" desc="Recover stray tokens or pull undistributed rewards. Staked CRAB principal is protected by the contract and can never be swept.">
                  <label className="block font-body text-sm uppercase text-ink/70">Token address</label>
                  <input value={recoverToken} onChange={(e) => setRecoverToken(e.target.value)} placeholder="0x… (e.g. WMON or stray token)" className="input-comic mt-1" />
                  <label className="mt-3 block font-body text-sm uppercase text-ink/70">Amount</label>
                  <input value={recoverAmt} onChange={(e) => setRecoverAmt(e.target.value)} type="number" min="0" className="input-comic mt-1" />
                  <button
                    onClick={() => run("Recover token", () => adminRecoverToken(recoverToken, recoverAmt))}
                    disabled={!!busy || !recoverToken || !recoverAmt}
                    className="btn-cartoon mt-4 w-full rotate-0 disabled:opacity-60"
                  >
                    {busy === "Recover token" ? "Recovering..." : "Recover ERC20"}
                  </button>

                  <div className="my-4 border-t-[3px] border-dashed border-ink/30" />

                  <button
                    onClick={() => {
                      if (confirm("Drain all undistributed WMON rewards back to owner and stop the reward stream? Staked principal is NOT affected.")) {
                        run("Drain rewards", () => adminDrainRewards());
                      }
                    }}
                    disabled={!!busy}
                    className="w-full rounded-2xl border-[4px] border-ink bg-candy py-3 font-display text-sm uppercase text-white shadow-comic-sm transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {busy === "Drain rewards" ? "Draining..." : "Emergency: Drain Rewards"}
                  </button>
                </Section>
              </Card>
            </div>

            {/* Contract reference */}
            <Card>
              <div className="font-body text-sm text-ink/70">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>Staking: <code className="text-ink">{shortAddress(STAKING.address, 6)}</code></span>
                  <span>CRAB: <code className="text-ink">{shortAddress(STAKING.crab, 6)}</code></span>
                  <span>WMON: <code className="text-ink">{shortAddress(STAKING.wmon, 6)}</code></span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="card-comic">{children}</div>;
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl uppercase text-ink">{title}</h3>
      <p className="mt-1 font-body text-sm text-ink/60">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Metric({ label, value, sub, bg, tilt }: { label: string; value: string; sub?: string; bg: string; tilt: string }) {
  return (
    <div className={`card-comic ${bg} ${tilt} p-4`}>
      <div className="font-body text-xs uppercase text-ink/70">{label}</div>
      <div className="mt-1 font-display text-2xl text-ink">{value}</div>
      {sub && <div className="mt-1 font-body text-[11px] text-ink/50">{sub}</div>}
    </div>
  );
}

function Empty({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="py-10 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <p className="font-display text-2xl uppercase text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md font-body text-sm text-ink/70">{body}</p>
    </div>
  );
}
