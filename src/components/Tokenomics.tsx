import Image from "next/image";
import { Reveal } from "./Reveal";

const ITEMS = [
  { value: "10B", name: "Total Supply", icon: "💰", bg: "bg-sunny", tilt: "-rotate-2" },
  { value: "MONAD", name: "Network", icon: "⚡", bg: "bg-[#d9ccff]", tilt: "rotate-2" },
  { value: "0 / 0", name: "Buy / Sell Tax", icon: "🪙", bg: "bg-[#c2ecff]", tilt: "-rotate-2" },
  { value: "100%", name: "LP Burned", icon: "🔥", bg: "bg-[#ffd7c2]", tilt: "rotate-2" },
];

export function Tokenomics() {
  return (
    <section
      id="tokenomics"
      className="relative overflow-hidden border-y-[5px] border-ink py-24"
    >
      <div className="absolute inset-0 z-0">
        <Image src="/img/tokenomicsBG.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-bamboo/25 mix-blend-multiply" />
      </div>

      <div className="container-x relative z-10">
        <Reveal className="flex justify-center">
          <Image
            src="/img/TokenomicsTitle.png"
            alt="Tokenomics"
            width={900}
            height={220}
            className="w-full max-w-2xl rotate-3 drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]"
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <div className={`card-comic ${item.bg} ${item.tilt} h-full text-center hover:rotate-0 hover:scale-105`}>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border-[4px] border-ink bg-white text-3xl">
                  {item.icon}
                </div>
                <div className="font-display text-3xl text-ink">{item.value}</div>
                <div className="mt-2 font-body text-sm uppercase text-ink/70">
                  {item.name}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
