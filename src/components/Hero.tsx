"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { useMonadStats } from "@/lib/useMonadStats";

export function Hero() {
  const stats = useMonadStats();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Sky background image from the original site */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/img/HeroBG.jpg"
          alt=""
          fill
          priority
          className="object-cover object-bottom"
        />
      </div>

      {/* Floating cartoon clouds */}
      <div className="pointer-events-none absolute left-[8%] top-28 h-16 w-32 animate-bob rounded-full bg-white/80 blur-[1px]" />
      <div className="pointer-events-none absolute right-[12%] top-40 h-12 w-24 animate-bob rounded-full bg-white/70 blur-[1px] [animation-delay:1.5s]" />
      <div className="pointer-events-none absolute left-[40%] top-20 h-10 w-20 animate-bob rounded-full bg-white/60 blur-[1px] [animation-delay:0.8s]" />

      <div className="container-x relative z-10 flex min-h-screen flex-col justify-center pt-28">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-block"
            >
              <span className="chip-comic">🦀 Now on Monad</span>
            </motion.div>

            <h1 className="flex flex-col items-center lg:items-start">
              <motion.span
                initial={{ opacity: 0, y: 80, scaleY: 1.2 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="stroke-title-yellow rotate-3 text-6xl sm:text-7xl xl:text-8xl"
              >
                Grab the
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="stroke-title -mt-2 -rotate-3 text-7xl sm:text-8xl xl:text-9xl"
              >
                $CRAB
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mx-auto mt-6 max-w-md font-body text-xl font-bold text-ink lg:mx-0"
            >
              {SITE.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 flex flex-col items-center gap-5 sm:flex-row lg:items-start"
            >
              <a href={SITE.links.buy} target="_blank" rel="noreferrer" className="btn-cartoon text-xl">
                Buy {SITE.token}
              </a>
              <div className="flex items-end gap-2">
                <SocialBubble href={SITE.links.telegram} label="Telegram" tilt="rotate-3">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-ink">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                </SocialBubble>
                <SocialBubble href={SITE.links.twitter} label="X" tilt="-rotate-6">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-ink">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </SocialBubble>
                <SocialBubble href={SITE.links.explorer} label="Explorer" tilt="rotate-6">
                  <span className="text-2xl">🔎</span>
                </SocialBubble>
              </div>
            </motion.div>

            {/* Live chain ticker as comic chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <span className="chip-comic rotate-0 text-xs">
                <span className={`h-2.5 w-2.5 rounded-full border-2 border-ink ${stats.online ? "bg-bamboo" : "bg-candy"}`} />
                Monad {stats.online ? "Live" : "..."}
              </span>
              <span className="chip-comic rotate-0 text-xs">
                Block #{stats.blockNumber?.toLocaleString() ?? "—"}
              </span>
              <span className="chip-comic rotate-0 text-xs">
                Gas {stats.gasPriceGwei ?? "—"}
              </span>
            </motion.div>
          </div>

          {/* Crab image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "backOut" }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="relative animate-bob">
              <Image
                src="/img/crab-hero.png"
                alt="Crab mascot"
                width={680}
                height={680}
                priority
                className="w-full drop-shadow-[0_20px_0_rgba(0,0,0,0.18)]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialBubble({
  href,
  label,
  tilt,
  children,
}: {
  href: string;
  label: string;
  tilt: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-ink bg-white shadow-comic-sm transition-transform hover:scale-110 hover:rotate-0 ${tilt}`}
    >
      {children}
    </a>
  );
}
