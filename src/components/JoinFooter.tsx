import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { SITE } from "@/lib/site";

const SOCIALS = [
  { href: SITE.links.twitter, label: "X", icon: "/img/x.png", tilt: "-rotate-6" },
  { href: SITE.links.telegram, label: "Telegram", icon: "/img/tel.png", tilt: "rotate-6" },
  { href: SITE.links.explorer, label: "Explorer", icon: "/img/movepump-crab.png", tilt: "-rotate-3" },
];

export function JoinFooter() {
  return (
    <footer className="relative overflow-hidden border-t-[5px] border-ink pt-20">
      {/* Beach / footer background */}
      <div className="absolute inset-0 z-0">
        <Image src="/img/JoinUsBG.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-sky/20 mix-blend-overlay" />
      </div>

      <div className="container-x relative z-10">
        <Reveal>
          <div className="text-center">
            <h2 className="stroke-title text-6xl sm:text-8xl">
              <span className="inline-block rotate-3 text-sunny">Join</span>{" "}
              <span className="inline-block -rotate-3">us!</span>
            </h2>

            <div className="mt-10 flex justify-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`grid h-20 w-20 place-items-center rounded-2xl border-[5px] border-ink bg-white shadow-comic transition-transform hover:rotate-0 hover:scale-110 ${s.tilt}`}
                >
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="relative mt-14 flex justify-center">
          <Image
            src="/img/crab-footer.png"
            alt="Crab"
            width={460}
            height={460}
            className="w-64 animate-sway drop-shadow-[0_16px_0_rgba(0,0,0,0.2)] sm:w-80"
          />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t-[4px] border-ink py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-crabsui.png"
              alt="Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border-[3px] border-ink object-cover"
            />
            <span className="font-display text-lg uppercase text-ink">
              Crab<span className="text-candy">/Mon</span>
            </span>
          </div>
          <p className="font-body text-sm uppercase text-ink">
            © {new Date().getFullYear()} $CRAB on Monad ·{" "}
            <Link href="/admin" className="text-ocean hover:underline">
              Admin
            </Link>
          </p>
          <p className="max-w-xs text-center font-body text-[11px] text-ink/60 sm:text-right">
            $CRAB is a meme token with no intrinsic value. DYOR. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
