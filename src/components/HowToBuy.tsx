import Image from "next/image";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "1",
    text: "Create a wallet by installing MetaMask, then add the Monad network with one click in our Network section.",
  },
  {
    n: "2",
    text: "Get some test MON from the Monad faucet, or deposit MON into your freshly created wallet address.",
  },
  {
    n: "3",
    text: "Head to a Monad DEX, paste the $CRAB token address, swap your MON, and approve the transaction.",
  },
  {
    n: "4",
    text: "You're now a $CRAB holder. Welcome to the reef — you've achieved financial freedom. 🦀",
  },
];

export function HowToBuy() {
  return (
    <section id="how" className="relative py-24">
      <div className="container-x">
        <Reveal className="flex justify-center">
          <Image
            src="/img/HowTobuy.png"
            alt="How to buy"
            width={900}
            height={220}
            className="w-full max-w-2xl drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]"
          />
        </Reveal>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="space-y-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div
                  className={`flex items-center gap-5 rounded-[1.75rem] border-[5px] border-ink bg-white p-5 shadow-comic ${
                    i % 2 ? "rotate-1" : "-rotate-1"
                  }`}
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[4px] border-ink bg-candy font-display text-3xl text-white text-stroke-sm">
                    {s.n}
                  </span>
                  <p className="font-body text-lg text-ink">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
