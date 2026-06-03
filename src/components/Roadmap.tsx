import Image from "next/image";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    step: "Step 1",
    text: "Crab Walk Onto the Scene — make a flashy entrance into the Monad world, getting everyone talking about $CRAB.",
    tilt: "rotate-2",
    bg: "bg-sunny",
  },
  {
    step: "Step 2",
    text: "Shell Out the Supply — release $CRAB tokens wisely to hype up demand and create a buzz across the reef.",
    tilt: "-rotate-2",
    bg: "bg-[#ffd7c2]",
  },
  {
    step: "Step 3",
    text: "Pinch and HODL — grab your $CRAB and hold tight, making that chart look juicy and green.",
    tilt: "rotate-1",
    bg: "bg-[#d9ccff]",
  },
  {
    step: "Step 4",
    text: "Ride the Tidal Wave — take advantage of Monad's speed for big $CRAB gains and on-chain utility.",
    tilt: "-rotate-1",
    bg: "bg-[#c2ecff]",
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden border-y-[5px] border-ink py-24"
    >
      {/* Bamboo backdrop */}
      <div className="absolute inset-0 z-0">
        <Image src="/img/RoadmapBG.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-ocean/20 mix-blend-multiply" />
      </div>

      <div className="container-x relative z-10">
        <Reveal className="flex justify-center">
          <Image
            src="/img/RoadmapTitle.png"
            alt="Roadmap"
            width={900}
            height={220}
            className="w-full max-w-2xl drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <div className={`card-comic ${s.bg} ${s.tilt} h-full hover:rotate-0`}>
                <h3 className="font-display text-3xl uppercase text-ocean">
                  {s.step}
                </h3>
                <p className="mt-3 font-body text-lg text-ink">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
