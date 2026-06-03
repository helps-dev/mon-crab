"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWallet } from "@/lib/WalletProvider";
import { useMonadStats } from "@/lib/useMonadStats";
import { STAKING } from "@/lib/staking";
import { shortAddress } from "@/lib/monad";
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
import { WalletButton } from "@/components/WalletButton";
import { Reveal } from "@/components/Reveal";

type Tab = "stake" | "unstake";

function fmt(v: string, dp = 2) {
  const n = Number(v);
  if (!isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: dp });
}

export function StakePage() {
  const { address, isMonad, connect, switchToMonad, hasWallet } = useWallet();
  const stats = useMonadStats();
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
      setMsg({ type: "ok", text: `${label} berhasil!` });
      setAmount("");
      setRefresh((r) => r + 1);
    } catch (e) {
      const err = e as { shortMessage?: string; message?: string };
      setMsg({ type: "err", text: err?.shortMessage ?? err?.message ?? "Transaksi gagal." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 py-3">
        <div className="container-x">
          <nav className="flex items-center justify-between rounded-full border-[4px] border-ink bg-white px-3 py-2 shadow-comic">
            <Link href="/" className="flex items-center gap-2 pl-1">
              <Image
                src="/logo-crabsui.png"
                alt="Crab logo"
                width={44}
                height={44}
                className="h-10 w-10 rounded-full border-[3px] border-ink object-cover"
              />
              <span className="font-display text-xl uppercase text-ink">
                Crab<span className="text-candy">/Mon</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/" className="hidden rounded-full px-4 py-2 font-display text-base uppercase text-ink/80 hover:bg-sunny hover:text-ink sm:block">
                Home
              </Link>
              <Link href="/admin" className="hidden rounded-full px-4 py-2 font-display text-base uppercase text-ink/80 hover:bg-sunny hover:text-ink sm:block">
                Admin
              </Link>
              <WalletButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Hero banner */}
      <section className="relative overflow-hidden pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image src="/img/HeroBG.jpg" alt="" fill className="object-cover object-bottom opacity-60" />
        </div>
        <div className="pointer-events-none absolute left-[10%] top-32 h-14 w-28 animate-bob rounded-full bg-white/70 blur-[1px]" />
        <div className="pointer-events-none absolute right-[15%] top-40 h-10 w-20 animate-bob rounded-full bg-white/60 blur-[1px] [animation-delay:1.2s]" />

        <div className="container-x relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="chip-comic mb-5">🥩 Stake & Earn</span>
            <h1 className="stroke-title-yellow text-5xl sm:text-7xl">Crab Staking</h1>
            <p className="mx-auto mt-5 max-w-xl font-body text-xl font-bold text-ink">
              Stake $CRAB dan dapatkan reward WMON setiap detik. Pinch now, feast later.
            </p>
          </motion.div>

          {/* Live chain chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="chip-comic rotate-0 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full border-2 border-ink ${stats.online ? "bg-bamboo" : "bg-candy"}`} />
              Monad {stats.online ? "Live" : "..."}
            </span>
            <span className="chip-comic rotate-0 text-xs">
              Block #{stats.blockNumber?.toLocaleString() ?? "—"}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="relative -mt-6 z-20">
        <div className="container-x">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="APR (est.)" value={data.apr != null ? `${fmt(String(data.apr), 1)}%` : "—"} tilt="-rotate-2" bg="bg-sunny" />
              <StatCard label="Total Staked" value={`${fmt(data.totalStaked)}`} sub="CRAB" tilt="rotate-2" bg="bg-[#d9ccff]" />
              <StatCard label="Your Stake" value={`${fmt(data.staked)}`} sub="CRAB" tilt="-rotate-2" bg="bg-[#c2ecff]" />
              <StatCard label="Rewards" value={`${fmt(data.earned, 4)}`} sub="WMON" tilt="rotate-2" bg="bg-[#ffd7c2]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main staking panel */}
      <section className="py-16">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: staking card */}
            <Reveal>
              <div className="card-comic">
                {!STAKING.address ? (
                  <NotConfigured />
                ) : !address ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-5xl">🦀</div>
                    <p className="mb-5 font-body text-lg text-ink">
                      Connect wallet untuk mulai staking.
                    </p>
                    <button onClick={connect} disabled={!hasWallet} className="btn-cartoon rotate-0">
                      {hasWallet ? "Connect Wallet" : "Install MetaMask"}
                    </button>
                  </div>
                ) : !isMonad ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-5xl">⚡</div>
                    <p className="mb-5 font-body text-lg text-ink">
                      Switch ke Monad network untuk staking.
                    </p>
                    <button onClick={switchToMonad} className="btn-cartoon-blue rotate-0">
                      Switch to Monad
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Tabs */}
                    <div className="mb-6 flex gap-2 rounded-2xl border-[4px] border-ink bg-[#eaf7ff] p-1.5">
                      {(["stake", "unstake"] as Tab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTab(t); setAmount(""); setMsg(null); }}
                          className={`flex-1 rounded-xl py-3 font-display text-xl uppercase transition-colors ${
                            tab === t ? "bg-candy text-white shadow-comic-sm" : "text-ink/60 hover:text-ink"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Balance row */}
                    <div className="mb-2 flex items-center justify-between font-body text-sm text-ink/70">
                      <span>{tab === "stake" ? "Wallet balance" : "Staked balance"}</span>
                      <button
                        className="font-display uppercase text-ocean hover:underline"
                        onClick={() => setAmount(tab === "stake" ? data.crabBalance : data.staked)}
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
                      className="input-comic font-display text-3xl"
                    />

                    {/* Actions */}
                    <div className="mt-6 space-y-3">
                      {tab === "stake" ? (
                        needsApproval ? (
                          <button
                            onClick={() => run("Approve", () => approveCrab(amount))}
                            disabled={!!busy || !amount}
                            className="btn-cartoon-yellow w-full rotate-0 text-xl disabled:opacity-60"
                          >
                            {busy === "Approve" ? "Approving..." : "Approve CRAB"}
                          </button>
                        ) : (
                          <button
                            onClick={() => run("Stake", () => stakeCrab(amount))}
                            disabled={!!busy || !amount || data.paused}
                            className="btn-cartoon w-full rotate-0 text-xl disabled:opacity-60"
                          >
                            {data.paused ? "Staking Paused" : busy === "Stake" ? "Staking..." : "Stake CRAB 🦀"}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => run("Unstake", () => withdrawCrab(amount))}
                          disabled={!!busy || !amount}
                          className="btn-cartoon w-full rotate-0 text-xl disabled:opacity-60"
                        >
                          {busy === "Unstake" ? "Unstaking..." : "Unstake CRAB"}
                        </button>
                      )}

                      <button
                        onClick={() => run("Claim", () => claimReward())}
                        disabled={!!busy || Number(data.earned) <= 0}
                        className="btn-cartoon-blue w-full rotate-0 text-lg disabled:opacity-50"
                      >
                        Claim {fmt(data.earned, 4)} WMON 💰
                      </button>

                      <button
                        onClick={() => run("Emergency withdraw", () => emergencyWithdraw())}
                        disabled={!!busy || Number(data.staked) <= 0}
                        className="w-full rounded-2xl border-[3px] border-ink bg-white py-3 font-display text-sm uppercase text-candy transition-colors hover:bg-candy hover:text-white disabled:opacity-40"
                      >
                        Emergency Withdraw (forfeit rewards)
                      </button>
                    </div>

                    {data.paused && (
                      <p className="mt-4 rounded-xl border-[3px] border-ink bg-sunny px-3 py-2 text-center font-body text-sm text-ink">
                        ⚠️ Staking sedang di-pause oleh admin. Unstake dan claim tetap bisa.
                      </p>
                    )}

                    {msg && (
                      <p className={`mt-4 rounded-xl border-[3px] border-ink px-3 py-2 text-center font-body text-sm ${
                        msg.type === "ok" ? "bg-bamboo/30 text-ink" : "bg-candy/20 text-candy"
                      }`}>
                        {msg.text}
                      </p>
                    )}
                  </>
                )}
              </div>
            </Reveal>

            {/* Right: info sidebar */}
            <div className="space-y-5">
              <Reveal delay={0.1}>
                <div className="card-comic -rotate-1 bg-sunny">
                  <h3 className="font-display text-xl uppercase text-ink">Cara Staking</h3>
                  <ol className="mt-3 space-y-2 font-body text-sm text-ink">
                    <li className="flex gap-2"><span className="font-display text-candy">1.</span> Connect wallet ke Monad</li>
                    <li className="flex gap-2"><span className="font-display text-candy">2.</span> Ambil CRAB dari faucet (atau beli)</li>
                    <li className="flex gap-2"><span className="font-display text-candy">3.</span> Approve lalu Stake</li>
                    <li className="flex gap-2"><span className="font-display text-candy">4.</span> Claim WMON kapan saja!</li>
                  </ol>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="card-comic rotate-1 bg-[#eaf7ff]">
                  <h3 className="font-display text-xl uppercase text-ink">Info Kontrak</h3>
                  <div className="mt-3 space-y-2 font-body text-xs text-ink/70">
                    <div>Staking: <code className="text-ink">{shortAddress(STAKING.address, 6)}</code></div>
                    <div>CRAB: <code className="text-ink">{shortAddress(STAKING.crab, 6)}</code></div>
                    <div>WMON: <code className="text-ink">{shortAddress(STAKING.wmon, 6)}</code></div>
                    <div className="pt-2 text-[11px] text-ink/50">
                      Non-custodial. Admin tidak bisa mengambil staked principal Anda.
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Faucets */}
              {address && isMonad && (
                <Reveal delay={0.2}>
                  <div className="card-comic -rotate-1">
                    <h3 className="font-display text-lg uppercase text-ink">Faucet (Testing)</h3>
                    <p className="mt-2 font-body text-xs text-ink/60">
                      Ambil token gratis untuk mencoba staking.
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => run("CRAB faucet", () => faucetCrab())}
                        disabled={!!busy}
                        className="flex-1 rounded-xl border-[3px] border-ink bg-sunny py-2.5 font-display text-sm uppercase text-ink transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        Get CRAB
                      </button>
                      <button
                        onClick={() => run("WMON faucet", () => faucetWmon())}
                        disabled={!!busy}
                        className="flex-1 rounded-xl border-[3px] border-ink bg-[#d9ccff] py-2.5 font-display text-sm uppercase text-ink transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        Get WMON
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[4px] border-ink py-6">
        <div className="container-x flex flex-col items-center justify-between gap-3 sm:flex-row">
          <Link href="/" className="font-display text-lg uppercase text-ink">
            Crab<span className="text-candy">/Mon</span>
          </Link>
          <p className="font-body text-xs text-ink/50">
            $CRAB is a meme token. DYOR. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value, sub, tilt, bg }: { label: string; value: string; sub?: string; tilt: string; bg: string }) {
  return (
    <div className={`card-comic ${bg} ${tilt} p-4 text-center hover:rotate-0 hover:scale-105`}>
      <div className="font-display text-2xl text-ink sm:text-3xl">
        {value}
        {sub && <span className="ml-1 text-base text-ink/60">{sub}</span>}
      </div>
      <div className="mt-1 font-body text-xs uppercase text-ink/70">{label}</div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="py-12 text-center">
      <div className="mb-3 text-5xl">🛠️</div>
      <p className="font-display text-2xl uppercase text-ink">Staking Coming Soon</p>
      <p className="mx-auto mt-2 max-w-sm font-body text-sm text-ink/70">
        Kontrak staking belum dikonfigurasi. Deploy CrabStaking dan set alamat di .env.local.
      </p>
    </div>
  );
}
