"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { useStaking } from "@/lib/useStaking";
import { useWallet } from "@/lib/WalletProvider";

function fmt(v: string, dp = 1) {
  const n = Number(v);
  return isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: dp }) : "0";
}

export function StakingTeaser() {
  const { address } = useWallet();
  const { data } = useStaking(address, 0);

  return (
    <section id="staking" className="relative py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-ink bg-ocean p-8 shadow-comic-lg sm:p-12">
            {/* Decorative crab */}
            <div className="pointer-events-none absolute -right-8 -top-8 opacity-20 sm:opacity-30">
              <Image
                src="/img/crab-hero.png"
                alt=""
                width={280}
                height={280}
                className="w-48 rotate-12 sm:w-64"
              />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-white">
                <h2 className="font-display text-4xl uppercase text-stroke-sm sm:text-5xl">
                  🥩 Stake $CRAB
                </h2>
                <p className="mt-3 max-w-md font-body text-lg">
                  Stake token $CRAB kamu dan dapatkan reward WMON setiap detik.
                  Non-custodial, aman, dan bisa unstake kapan saja.
                </p>

                {/* Quick stats */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                    APR: {data.apr != null ? `${fmt(String(data.apr))}%` : "—"}
                  </span>
                  <span className="rounded-full border-[3px] border-ink bg-white px-3 py-1 font-display text-sm text-ink">
                    Total: {fmt(data.totalStaked)} CRAB
                  </span>
                  <span className="rounded-full border-[3px] border-ink bg-sunny px-3 py-1 font-display text-sm text-ink">
                    Reward: WMON
                  </span>
                </div>
              </div>

              <Link href="/stake" className="btn-cartoon-yellow shrink-0 text-xl">
                Stake Sekarang →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
