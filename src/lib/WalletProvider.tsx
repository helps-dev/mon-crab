"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatEther } from "ethers";
import {
  MONAD_TESTNET,
  addMonadNetwork,
  getInjectedProvider,
} from "./monad";

type WalletState = {
  address: string | null;
  balance: string | null; // formatted MON, 4 decimals
  chainId: string | null; // hex
  isMonad: boolean;
  connecting: boolean;
  error: string | null;
  hasWallet: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToMonad: () => Promise<void>;
};

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(false);

  const isMonad = chainId?.toLowerCase() === MONAD_TESTNET.chainIdHex;

  const refreshBalance = useCallback(async (account: string) => {
    const provider = getInjectedProvider();
    if (!provider) return;
    try {
      const wei = (await provider.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      })) as string;
      const formatted = Number(formatEther(BigInt(wei))).toFixed(4);
      setBalance(formatted);
    } catch {
      setBalance(null);
    }
  }, []);

  const connect = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      setError("No EVM wallet detected. Install MetaMask to connect.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      const id = (await provider.request({ method: "eth_chainId" })) as string;
      const account = accounts?.[0] ?? null;
      setAddress(account);
      setChainId(id);
      if (account) await refreshBalance(account);
    } catch (e) {
      const err = e as { message?: string };
      setError(err?.message ?? "Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setError(null);
  }, []);

  const switchToMonad = useCallback(async () => {
    setError(null);
    try {
      await addMonadNetwork();
      const provider = getInjectedProvider();
      if (provider) {
        const id = (await provider.request({ method: "eth_chainId" })) as string;
        setChainId(id);
        if (address) await refreshBalance(address);
      }
    } catch (e) {
      const err = e as { message?: string };
      setError(err?.message ?? "Could not switch to Monad.");
    }
  }, [address, refreshBalance]);

  // Detect wallet + wire up event listeners.
  useEffect(() => {
    const provider = getInjectedProvider();
    setHasWallet(Boolean(provider));
    if (!provider?.on) return;

    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      const next = accounts?.[0] ?? null;
      setAddress(next);
      if (next) refreshBalance(next);
      else setBalance(null);
    };
    const handleChain = (...args: unknown[]) => {
      const id = args[0] as string;
      setChainId(id);
      if (address) refreshBalance(address);
    };

    provider.on("accountsChanged", handleAccounts);
    provider.on("chainChanged", handleChain);
    return () => {
      provider.removeListener?.("accountsChanged", handleAccounts);
      provider.removeListener?.("chainChanged", handleChain);
    };
  }, [address, refreshBalance]);

  // Refresh balance on an interval while connected.
  useEffect(() => {
    if (!address) return;
    const t = setInterval(() => refreshBalance(address), 15000);
    return () => clearInterval(t);
  }, [address, refreshBalance]);

  const value = useMemo<WalletState>(
    () => ({
      address,
      balance,
      chainId,
      isMonad,
      connecting,
      error,
      hasWallet,
      connect,
      disconnect,
      switchToMonad,
    }),
    [address, balance, chainId, isMonad, connecting, error, hasWallet, connect, disconnect, switchToMonad]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
