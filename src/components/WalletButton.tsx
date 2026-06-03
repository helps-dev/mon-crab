"use client";

import { useWallet } from "@/lib/WalletProvider";
import { shortAddress } from "@/lib/monad";

export function WalletButton() {
  const { address, balance, isMonad, connecting, connect, switchToMonad } =
    useWallet();

  if (!address) {
    return (
      <button onClick={connect} disabled={connecting} className="btn-cartoon text-base">
        {connecting ? "..." : "Connect"}
      </button>
    );
  }

  if (!isMonad) {
    return (
      <button onClick={switchToMonad} className="btn-cartoon-blue text-base">
        Switch to Monad
      </button>
    );
  }

  return (
    <div className="flex -rotate-2 items-center gap-2 rounded-full border-[4px] border-ink bg-white px-3 py-1.5 shadow-comic-sm">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bamboo opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-ink bg-bamboo" />
      </span>
      <span className="font-display text-sm text-ink">
        {balance ?? "0.0000"} MON
      </span>
      <span className="hidden font-body text-xs text-ink/60 sm:inline">
        {shortAddress(address)}
      </span>
    </div>
  );
}
