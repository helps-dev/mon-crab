// Monad network configuration + helpers.
// Centralizes chain params so both the "Add Network" button and the
// live-stats RPC poller stay in sync.

export const MONAD_TESTNET = {
  chainIdDec: 143,
  chainIdHex: "0x8f",
  chainName: "Monad",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.monad.xyz"],
  blockExplorerUrls: ["https://monadexplorer.com"],
  faucetUrl: "https://faucet.monad.xyz",
} as const;

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function getInjectedProvider(): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

/** Shorten an address like 0x1234...abcd */
export function shortAddress(address: string, size = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + size)}...${address.slice(-size)}`;
}

/**
 * Prompt the wallet to add (or switch to) the Monad testnet.
 * Returns true on success, throws a friendly error otherwise.
 */
export async function addMonadNetwork(): Promise<boolean> {
  const provider = getInjectedProvider();
  if (!provider) {
    throw new Error("No EVM wallet found. Install MetaMask to continue.");
  }

  try {
    // Try a simple switch first in case the chain already exists.
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MONAD_TESTNET.chainIdHex }],
    });
    return true;
  } catch (switchError) {
    const err = switchError as { code?: number };
    // 4902 = chain not added yet -> add it.
    if (err?.code === 4902 || err?.code === -32603) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: MONAD_TESTNET.chainIdHex,
            chainName: MONAD_TESTNET.chainName,
            nativeCurrency: MONAD_TESTNET.nativeCurrency,
            rpcUrls: MONAD_TESTNET.rpcUrls,
            blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls,
          },
        ],
      });
      return true;
    }
    throw switchError;
  }
}
