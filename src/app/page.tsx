import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ToolEcosystem } from "@/components/ToolEcosystem";
import { ProblemSection } from "@/components/ProblemSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AuditSection } from "@/components/AuditSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white flex flex-col">
      <Navbar />
      <Hero />
      <ToolEcosystem />
      <ProblemSection />
      <FeaturesSection />
      <AuditSection />
      <CTASection />
      <Footer />
    </main>
  );
}
