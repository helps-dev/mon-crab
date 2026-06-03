"use client";

import { useMemo, useState } from "react";

const TOTAL_SUPPLY = 10_000_000_000; // 10B $CRAB
const SCENARIOS = [
  { label: "Shrimp", cap: 100_000, emoji: "🦐" },
  { label: "Crab", cap: 1_000_000, emoji: "🦀" },
  { label: "Lobster", cap: 10_000_000, emoji: "🦞" },
  { label: "Kraken", cap: 100_000_000, emoji: "🐙" },
];

/**
 * Unique tool #1 — Crab Claw Calculator.
 * Estimates how many $CRAB a given MON spend buys, then projects the
 * holding value across playful market-cap scenarios. Front-end simulation.
 */
export function ClawCalculator() {
  const [monAmount, setMonAmount] = useState("10");
  const [monPrice, setMonPrice] = useState("2.5");
  const [entryCap, setEntryCap] = useState("250000");

  const result = useMemo(() => {
    const mon = parseFloat(monAmount) || 0;
    const price = parseFloat(monPrice) || 0;
    const cap = parseFloat(entryCap) || 0;
    const usdIn = mon * price;
    if (cap <= 0 || usdIn <= 0) {
      return { tokens: 0, usdIn, rows: [] as { label: string; emoji: string; value: number; x: number }[] };
    }
    const tokenPriceAtEntry = cap / TOTAL_SUPPLY;
    const tokens = usdIn / tokenPriceAtEntry;
    const rows = SCENARIOS.map((s) => {
      const priceAt = s.cap / TOTAL_SUPPLY;
      const value = tokens * priceAt;
      return { label: s.label, emoji: s.emoji, value, x: value / usdIn };
    });
    return { tokens, usdIn, rows };
  }, [monAmount, monPrice, entryCap]);

  return (
    <div className="card-comic flex h-full flex-col">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full border-[4px] border-ink bg-sunny text-2xl">
          🧮
        </span>
        <h3 className="font-display text-2xl uppercase text-ink">Claw Calculator</h3>
      </div>

      <div className="space-y-3">
        <Field label="MON to spend">
          <input type="number" min="0" value={monAmount} onChange={(e) => setMonAmount(e.target.value)} className="input-comic" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="MON price ($)">
            <input type="number" min="0" step="0.01" value={monPrice} onChange={(e) => setMonPrice(e.target.value)} className="input-comic" />
          </Field>
          <Field label="Entry mcap ($)">
            <input type="number" min="0" value={entryCap} onChange={(e) => setEntryCap(e.target.value)} className="input-comic" />
          </Field>
        </div>
      </div>

      <div className="mt-5 -rotate-1 rounded-2xl border-[4px] border-ink bg-sunny px-4 py-3">
        <div className="flex items-baseline justify-between">
          <span className="font-body text-sm uppercase text-ink/70">You&apos;d hold</span>
          <span className="font-display text-xl text-ink">
            {result.tokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} $CRAB
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {result.rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-xl border-[3px] border-ink bg-[#eaf7ff] px-3 py-2">
            <span className="flex items-center gap-2 font-body text-ink">
              <span className="text-lg">{r.emoji}</span>
              {r.label}
            </span>
            <span className="text-right">
              <span className="font-display text-ink">
                ${r.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="ml-2 font-display text-sm text-candy">{r.x.toFixed(1)}x</span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-body text-[11px] leading-relaxed text-ink/40">
        Just a fun simulation. Memecoins are super risky. Not financial advice.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-body text-sm uppercase text-ink/70">{label}</span>
      {children}
    </label>
  );
}
