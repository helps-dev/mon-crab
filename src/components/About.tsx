import Image from "next/image";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-y-[5px] border-ink py-24"
    >
      {/* Bamboo jungle background from the original */}
      <div className="absolute inset-0 z-0">
        <Image src="/img/AboutBG.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-bamboo/30 mix-blend-multiply" />
      </div>

      <div className="container-x relative z-10">
        <Reveal className="flex justify-center">
          <Image
            src="/img/AboutTitle.png"
            alt="About"
            width={760}
            height={220}
            className="w-full max-w-2xl drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]"
          />
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              <Image
                src="/img/crab-footer.png"
                alt="Crab character"
                width={520}
                height={520}
                className="w-full animate-sway drop-shadow-[0_16px_0_rgba(0,0,0,0.2)]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card-comic -rotate-1">
              <p className="font-body text-xl leading-relaxed text-ink">
                Crab, the degenerate Monad mogul, is a high-stakes gambler and
                owner of the elite casino{" "}
                <span className="text-candy">&quot;The Golden Claw&quot;</span>.
                Known for his impeccable manners, charm, and charisma, he lives a
                life of luxury and influence.
              </p>
              <p className="mt-4 font-body text-xl leading-relaxed text-ink">
                Despite his taste for finer things, his addiction to gambling and
                chart-pinching defines his notorious reputation. Now he scuttles
                across the fastest EVM chain in the sea:{" "}
                <span className="text-ocean">Monad</span>.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { v: "10B", l: "Supply" },
                  { v: "MONAD", l: "Chain" },
                  { v: "0%", l: "Tax" },
                ].map((s, i) => (
                  <div
                    key={s.l}
                    className={`rounded-2xl border-[4px] border-ink bg-sunny px-2 py-3 text-center ${
                      i % 2 ? "rotate-2" : "-rotate-2"
                    }`}
                  >
                    <div className="font-display text-2xl text-ink">{s.v}</div>
                    <div className="font-body text-xs uppercase text-ink/70">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
