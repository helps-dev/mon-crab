import type { Metadata } from "next";
import { StakePage } from "@/components/stake/StakePage";

export const metadata: Metadata = {
  title: "Stake $CRAB — Earn WMON Rewards",
  description: "Stake your $CRAB tokens and earn WMON rewards every second on the Monad network.",
};

export default function Stake() {
  return <StakePage />;
}
