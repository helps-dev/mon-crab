const ITEMS = [
  "GRAB THE $CRAB",
  "BUILT ON MONAD",
  "PINCH THE CHARTS",
  "DEGEN MOGUL",
  "TO THE REEF",
  "WAGMI",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y-[5px] border-ink bg-candy py-3">
      <div className="flex w-max animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-6 font-display text-2xl uppercase tracking-wide text-white text-stroke-sm">
              {item}
            </span>
            <span className="text-2xl">🦀</span>
          </div>
        ))}
      </div>
    </div>
  );
}
