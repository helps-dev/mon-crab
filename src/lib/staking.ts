// Staking configuration: addresses + minimal ABIs.
//
// Fill these in after deploying CrabStaking (see /contracts).
// $CRAB is the token launched on nad.fun; WMON is wrapped MON (the reward).
export const STAKING = {
  // CrabStaking contract address on Monad testnet.
  address: (process.env.NEXT_PUBLIC_STAKING_ADDRESS ?? "") as string,
  // $CRAB token (nad.fun launch) address.
  crab: (process.env.NEXT_PUBLIC_CRAB_ADDRESS ?? "") as string,
  // Wrapped MON reward token address.
  wmon: (process.env.NEXT_PUBLIC_WMON_ADDRESS ?? "") as string,
  crabSymbol: "CRAB",
  rewardSymbol: "WMON",
} as const;

export function isStakingConfigured(): boolean {
  return Boolean(STAKING.address && STAKING.crab && STAKING.wmon);
}

// Minimal ERC20 ABI (read + approve).
export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
] as const;

// Faucet-enabled token ABI (our WMON + CrabToken expose these).
export const FAUCET_TOKEN_ABI = [
  ...ERC20_ABI,
  "function faucet()",
  "function faucetAmount() view returns (uint256)",
  "function faucetEnabled() view returns (bool)",
  "function lastFaucetClaim(address) view returns (uint256)",
  "function faucetCooldown() view returns (uint256)",
  "function mint(address to, uint256 amount)",
] as const;

// CrabStaking ABI — only the methods the UI calls.
export const STAKING_ABI = [
  // views
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function earned(address) view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function rewardsDuration() view returns (uint256)",
  "function periodFinish() view returns (uint256)",
  "function getRewardForDuration() view returns (uint256)",
  "function owner() view returns (address)",
  "function paused() view returns (bool)",
  // user actions
  "function stake(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function getReward()",
  "function exit()",
  "function emergencyWithdraw()",
  // admin
  "function notifyRewardAmount(uint256 reward)",
  "function setRewardsDuration(uint256 duration)",
  "function pause()",
  "function unpause()",
  "function recoverERC20(address token, uint256 amount)",
  "function drainRewards()",
  // events
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardPaid(address indexed user, uint256 reward)",
] as const;
