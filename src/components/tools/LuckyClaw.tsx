"use client";

import { useState } from "react";
import { useMonadStats } from "@/lib/useMonadStats";

const FORTUNES = [
  "The claw favors the patient. HODL through the chop. 🦀",
  "A green candle approaches. Do not paperhand it. 📈",
  "The tide pulls back before the wave. Accumulate. 🌊",
  "Your bags are lighter than your conviction. Add more shell. 🐚",
  "Beware the rug merchant. Verify the contract. 🔍",
  "Today you pinch. Tomorrow you feast. 🍽️",
  "The Golden Claw smiles upon your next swap. ✨",
  "Sideways is just the crab walking. Stay scuttling. ↔️",
];

/**
 * Unique tool #2 — Lucky Claw.
 * Uses the latest Monad block hash as a verifiable entropy source to draw a
 * "degen fortune". Deterministic per block, tied to on-chain state.
 */
export function LuckyClaw() {
  const stats = useMonadStats(6000);
  const [revealed, setRevealed] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);
  const [luck, setLuck] = useState(0);

  const draw = () => {
    const seed = stats.latestBlockHash ?? `${Date.now()}`;
    let acc = 0;
    for (let i = 2; i < seed.length; i++) {
      acc = (acc * 31 + seed.charCodeAt(i)) % 1_000_003;
    }
    setFortune(FORTUNES[acc % FORTUNES.length]);
    setLuck((acc % 100) + 1);
    setRevealed(true);
  };

  return (
    <div className="card-comic-blue flex h-full flex-col">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full border-[4px] border-ink bg-candy text-2xl">
          🔮
        </span>
        <h3 className="font-display text-2xl uppercase text-ink">Lucky Claw</h3>
      </div>

      <p className="font-body text-ink/80">
        Draw a degen fortune seeded by the latest Monad block hash — real
        on-chain luck, not a coin flip.
      </p>

      <div className="mt-3 inline-flex w-fit rounded-full border-[3px] border-ink bg-white px-3 py-1 font-body text-xs text-ink">
        Seed block #{stats.blockNumber?.toLocaleString() ?? "—"}
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl border-[4px] border-dashed border-ink bg-white p-6 text-center">
        {revealed && fortune ? (
          <>
            <div className="mb-3 animate-bob text-4xl">🦀</div>
            <p className="font-body text-lg font-bold text-ink">{fortune}</p>
            <div className="mt-4 w-full">
              <div className="mb-1 flex justify-between font-body text-xs text-ink/60">
                <span>Luck meter</span>
                <span>{luck}/100</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full border-[3px] border-ink bg-white">
                <div
                  className="h-full rounded-full bg-candy transition-all duration-700"
                  style={{ width: `${luck}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <p className="font-body text-ink/50">Tap the claw to reveal your fortune!</p>
        )}
      </div>

      <button onClick={draw} className="btn-cartoon mt-5 w-full rotate-0 text-lg">
        {revealed ? "Draw Again" : "Pull the Claw"}
      </button>
    </div>
  );
}
