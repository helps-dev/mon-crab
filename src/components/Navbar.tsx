"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { WalletButton } from "./WalletButton";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <nav
          className={`flex items-center justify-between rounded-full border-[4px] border-ink bg-white px-3 py-2 transition-shadow ${
            scrolled ? "shadow-comic" : "shadow-comic-sm"
          }`}
        >
          <button
            onClick={() => go("hero")}
            className="flex items-center gap-2 pl-1"
            aria-label="Crab on Monad home"
          >
            <Image
              src="/logo-crabsui.png"
              alt="Crab logo"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full border-[3px] border-ink object-cover"
            />
            <span className="font-display text-xl uppercase text-ink">
              Crab<span className="text-candy">/Mon</span>
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {SITE.nav.map((item) => (
              <li key={item.target}>
                {"href" in item ? (
                  <Link
                    href={item.href}
                    className="rounded-full px-4 py-2 font-display text-base uppercase text-ink/80 transition-colors hover:bg-sunny hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => go(item.target)}
                    className="rounded-full px-4 py-2 font-display text-base uppercase text-ink/80 transition-colors hover:bg-sunny hover:text-ink"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <WalletButton />
            </div>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border-[4px] border-ink bg-sunny lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-1 w-5 rounded bg-ink transition-transform ${
                    open ? "translate-y-2.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-1 w-5 rounded bg-ink transition-opacity ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-1 w-5 rounded bg-ink transition-transform ${
                    open ? "-translate-y-2.5 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="mt-3 rounded-3xl border-[4px] border-ink bg-white p-4 shadow-comic lg:hidden">
            <ul className="flex flex-col gap-1">
              {SITE.nav.map((item) => (
                <li key={item.target}>
                  {"href" in item ? (
                    <Link
                      href={item.href}
                      className="block w-full rounded-2xl px-4 py-3 text-left font-display text-lg uppercase text-ink hover:bg-sunny"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => go(item.target)}
                      className="w-full rounded-2xl px-4 py-3 text-left font-display text-lg uppercase text-ink hover:bg-sunny"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
