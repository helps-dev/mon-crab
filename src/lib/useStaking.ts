"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatEther,
  parseEther,
  type Eip1193Provider,
} from "ethers";
import { getInjectedProvider } from "./monad";
import { STAKING, STAKING_ABI, ERC20_ABI, FAUCET_TOKEN_ABI, isStakingConfigured } from "./staking";

export type StakingData = {
  // formatted (ether) strings
  crabBalance: string;
  staked: string;
  earned: string;
  allowance: string;
  totalStaked: string;
  rewardForDuration: string;
  periodFinish: number; // unix seconds
  paused: boolean;
  apr: number | null; // rough % if derivable
  isOwner: boolean;
  loading: boolean;
  configured: boolean;
};

const EMPTY: StakingData = {
  crabBalance: "0",
  staked: "0",
  earned: "0",
  allowance: "0",
  totalStaked: "0",
  rewardForDuration: "0",
  periodFinish: 0,
  paused: false,
  apr: null,
  isOwner: false,
  loading: true,
  configured: false,
};

export function useStaking(address: string | null, refreshKey = 0) {
  const [data, setData] = useState<StakingData>(EMPTY);

  const load = useCallback(async () => {
    const configured = isStakingConfigured();
    if (!configured) {
      setData({ ...EMPTY, loading: false, configured: false });
      return;
    }
    const injected = getInjectedProvider();
    if (!injected || !address) {
      setData((d) => ({ ...d, loading: false, configured: true }));
      return;
    }

    try {
      const provider = new BrowserProvider(injected as unknown as Eip1193Provider);
      const staking = new Contract(STAKING.address, STAKING_ABI, provider);
      const crab = new Contract(STAKING.crab, ERC20_ABI, provider);

      const [
        crabBalance,
        staked,
        earned,
        allowance,
        totalStaked,
        rewardForDuration,
        periodFinish,
        paused,
        owner,
      ] = await Promise.all([
        crab.balanceOf(address),
        staking.balanceOf(address),
        staking.earned(address),
        crab.allowance(address, STAKING.address),
        staking.totalSupply(),
        staking.getRewardForDuration(),
        staking.periodFinish(),
        staking.paused(),
        staking.owner(),
      ]);

      // Rough APR: rewards over duration vs total staked (both 18-dec assumed,
      // ignoring price differences between CRAB and WMON — display only).
      let apr: number | null = null;
      const total = Number(formatEther(totalStaked));
      const reward = Number(formatEther(rewardForDuration));
      if (total > 0 && reward > 0) {
        apr = (reward / total) * (365 / 7) * 100;
      }

      setData({
        crabBalance: formatEther(crabBalance),
        staked: formatEther(staked),
        earned: formatEther(earned),
        allowance: formatEther(allowance),
        totalStaked: formatEther(totalStaked),
        rewardForDuration: formatEther(rewardForDuration),
        periodFinish: Number(periodFinish),
        paused: Boolean(paused),
        apr,
        isOwner: owner.toLowerCase() === address.toLowerCase(),
        loading: false,
        configured: true,
      });
    } catch {
      setData((d) => ({ ...d, loading: false, configured: true }));
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Light polling for live earned/balances.
  useEffect(() => {
    if (!address || !isStakingConfigured()) return;
    const t = setInterval(load, 12000);
    return () => clearInterval(t);
  }, [address, load]);

  return { data, reload: load };
}

/* ----------------------- write helpers (return tx) ----------------------- */

async function getSignerContract(abi: readonly string[], target: string) {
  const injected = getInjectedProvider();
  if (!injected) throw new Error("No wallet found.");
  const provider = new BrowserProvider(injected as unknown as Eip1193Provider);
  const signer = await provider.getSigner();
  return new Contract(target, abi, signer);
}

export async function approveCrab(amount: string) {
  const crab = await getSignerContract(ERC20_ABI, STAKING.crab);
  const tx = await crab.approve(STAKING.address, parseEther(amount));
  return tx.wait();
}

export async function stakeCrab(amount: string) {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.stake(parseEther(amount));
  return tx.wait();
}

export async function withdrawCrab(amount: string) {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.withdraw(parseEther(amount));
  return tx.wait();
}

export async function claimReward() {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.getReward();
  return tx.wait();
}

export async function emergencyWithdraw() {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.emergencyWithdraw();
  return tx.wait();
}

/* -------------------------------- faucets -------------------------------- */

/** Claim test CRAB from the CrabToken faucet (testnet token only). */
export async function faucetCrab() {
  const crab = await getSignerContract(FAUCET_TOKEN_ABI, STAKING.crab);
  const tx = await crab.faucet();
  return tx.wait();
}

/** Claim test WMON from the WMON faucet. */
export async function faucetWmon() {
  const wmon = await getSignerContract(FAUCET_TOKEN_ABI, STAKING.wmon);
  const tx = await wmon.faucet();
  return tx.wait();
}

/* --------------------------------- admin --------------------------------- */

/**
 * Owner-only: mint fresh WMON to a target address (our WMON token supports this).
 */
export async function adminMintWmon(to: string, amount: string) {
  const wmon = await getSignerContract(FAUCET_TOKEN_ABI, STAKING.wmon);
  const tx = await wmon.mint(to, parseEther(amount));
  return tx.wait();
}

/**
 * Owner-only: fund a reward period. If `mintFirst` is true, mint the WMON to the
 * owner before approving + notifying (works because the owner owns the WMON
 * token). Otherwise it uses the owner's existing WMON balance.
 */
export async function adminNotifyReward(amount: string, mintFirst = true) {
  const injected = getInjectedProvider();
  if (!injected) throw new Error("No wallet found.");
  const provider = new BrowserProvider(injected as unknown as Eip1193Provider);
  const signer = await provider.getSigner();
  const ownerAddr = await signer.getAddress();

  const wmon = new Contract(STAKING.wmon, FAUCET_TOKEN_ABI, signer);
  if (mintFirst) {
    const mintTx = await wmon.mint(ownerAddr, parseEther(amount));
    await mintTx.wait();
  }
  const approveTx = await wmon.approve(STAKING.address, parseEther(amount));
  await approveTx.wait();

  const staking = new Contract(STAKING.address, STAKING_ABI, signer);
  const tx = await staking.notifyRewardAmount(parseEther(amount));
  return tx.wait();
}

export async function adminSetDuration(seconds: number) {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.setRewardsDuration(seconds);
  return tx.wait();
}

export async function adminSetPaused(paused: boolean) {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = paused ? await staking.pause() : await staking.unpause();
  return tx.wait();
}

export async function adminRecoverToken(token: string, amount: string) {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.recoverERC20(token, parseEther(amount));
  return tx.wait();
}

export async function adminDrainRewards() {
  const staking = await getSignerContract(STAKING_ABI, STAKING.address);
  const tx = await staking.drainRewards();
  return tx.wait();
}
