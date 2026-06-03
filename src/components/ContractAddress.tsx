"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export function ContractAddress() {
  const [copied, setCopied] = useState(false);
  const ca = SITE.contractAddress;
  const isLive = ca !== "Coming Soon";

  const copy = async () => {
    if (!isLive) return;
    try {
      await navigator.clipboard.writeText(ca);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section className="relative py-14">
      <div className="container-x">
        <div className="mx-auto flex max-w-3xl -rotate-1 flex-col items-center gap-4 rounded-[1.75rem] border-[5px] border-ink bg-candy p-5 shadow-comic sm:flex-row sm:justify-between">
          <span className="font-display text-lg uppercase text-white text-stroke-sm">
            Contract Address
          </span>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <code className="flex-1 truncate rounded-xl border-[3px] border-ink bg-white px-4 py-2.5 font-body text-ink sm:max-w-md">
              {ca}
            </code>
            <button
              onClick={copy}
              disabled={!isLive}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-ink bg-sunny transition-transform hover:scale-110 disabled:opacity-50"
              aria-label="Copy contract address"
            >
              {copied ? (
                <span className="font-display text-ink">✓</span>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-ink">
                  <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
