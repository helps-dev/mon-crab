import { Reveal } from "./Reveal";
import { ClawCalculator } from "./tools/ClawCalculator";
import { LuckyClaw } from "./tools/LuckyClaw";
import { CrabTier } from "./tools/CrabTier";

export function ToolsSection() {
  return (
    <section id="tools" className="relative py-24">
      <div className="container-x">
        <Reveal>
          <div className="text-center">
            <span className="chip-comic mb-5">🛠️ Crab Utilities</span>
            <h2 className="stroke-title-yellow text-5xl sm:text-6xl">
              The Tackle Box
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-lg font-bold text-ink">
              On-chain toys for degens. Crunch your claws, draw a block-seeded
              fortune, and earn your crustacean rank!
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <ClawCalculator />
          </Reveal>
          <Reveal delay={0.1}>
            <LuckyClaw />
          </Reveal>
          <Reveal delay={0.2}>
            <CrabTier />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
