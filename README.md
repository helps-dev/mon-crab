# 🦀 Crab on Monad

Premium Next.js landing page for the **$CRAB** memecoin, rebuilt from the
original static HTML site and rebranded for the **Monad** network.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** for the premium glassmorphism / glow design
- **Framer Motion** for scroll + entrance animations
- **ethers v6** for wallet balance formatting
- Direct JSON-RPC calls to the public Monad testnet RPC

## Features

### Monad network utilities
- **Connect Wallet** — MetaMask connect showing live address + MON balance
- **Add Monad Network** — one click `wallet_addEthereumChain` / `wallet_switchEthereumChain`
- **Live Network stats** — block height, gas price, chain status polled from RPC

### Unique crab tools (`/components/tools`)
- **Crab Claw Calculator** — projects $CRAB holdings across market-cap scenarios
- **Lucky Claw** — degen fortune seeded by the latest Monad block hash (on-chain entropy)
- **Crab Tier** — assigns a crustacean rank from your live MON balance

### Staking (stake $CRAB → earn WMON)
- **Staking section** (`/#staking`) — approve, stake, unstake, claim WMON, emergency withdraw
- **Admin dashboard** (`/admin`) — owner-gated: fund rewards, set duration, pause/unpause,
  recover stray tokens, emergency drain. Non-owners see a locked screen.
- Contract lives in `../contracts` (`CrabStaking.sol`). Deploy it, then set the
  addresses in `.env.local` (see `.env.local.example`) to switch staking on.
- Non-custodial: the contract **cannot** seize staked principal — admin powers are
  fenced to rewards and stray tokens only.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Configuration

- Network params: `src/lib/monad.ts`
- Links, token info, contract address: `src/lib/site.ts`

## Notes

Monad testnet params used (see `src/lib/monad.ts`):
- Chain ID: `10143` (`0x279f`)
- Currency: `MON`
- RPC: `https://testnet-rpc.monad.xyz`
- Explorer: `https://testnet.monadexplorer.com`

Update these if Monad changes its public endpoints. The calculator and tools are
simulations for entertainment — not financial advice.
