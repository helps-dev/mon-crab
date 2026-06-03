import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { NetworkSection } from "@/components/NetworkSection";
import { StakingTeaser } from "@/components/StakingTeaser";
import { ToolsSection } from "@/components/ToolsSection";
import { Roadmap } from "@/components/Roadmap";
import { HowToBuy } from "@/components/HowToBuy";
import { Tokenomics } from "@/components/Tokenomics";
import { ContractAddress } from "@/components/ContractAddress";
import { JoinFooter } from "@/components/JoinFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <NetworkSection />
        <StakingTeaser />
        <ToolsSection />
        <Roadmap />
        <HowToBuy />
        <Tokenomics />
        <ContractAddress />
        <JoinFooter />
      </main>
    </>
  );
}
