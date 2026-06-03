// Central place to edit project links, copy and token details.
export const SITE = {
  token: "$CRAB",
  name: "Crab on Monad",
  tagline: "The degenerate Monad mogul, pincher of charts and normies.",
  contractAddress: "Coming Soon",
  links: {
    buy: "https://nad.fun/",
    twitter: "https://x.com/monad_crab",
    telegram: "https://t.me/moncrab_",
    explorer: "https://monadexplorer.com",
    faucet: "https://faucet.monad.xyz",
  },
  nav: [
    { label: "About", target: "about" },
    { label: "Network", target: "network" },
    { label: "Staking", target: "staking", href: "/stake" },
    { label: "Tools", target: "tools" },
    { label: "Roadmap", target: "roadmap" },
    { label: "How to buy", target: "how" },
    { label: "Tokenomics", target: "tokenomics" },
  ] as const,
} as const;
