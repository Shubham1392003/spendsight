"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Zap, Repeat, Users, PiggyBank, Share2 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI Spend Audit",
    description: "Deep scan of your infrastructure to map every dollar spent on AI tools and APIs.",
  },
  {
    icon: Zap,
    title: "Plan Optimization",
    description: "Intelligent downgrade recommendations for overkill enterprise tiers.",
  },
  {
    icon: Repeat,
    title: "Alternative Recommendations",
    description: "Discover cheaper models and tools that perform the exact same tasks.",
  },
  {
    icon: Users,
    title: "Team Usage Analysis",
    description: "Identify inactive seats and consolidate fragmented team subscriptions.",
  },
  {
    icon: PiggyBank,
    title: "Credit Savings Detection",
    description: "Find unused free credits across major cloud providers and AI labs.",
  },
  {
    icon: Share2,
    title: "Shareable Reports",
    description: "Generate beautiful, board-ready savings reports in one click.",
  },
];

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-gradient"
          >
            Built for lean startups
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-light"
          >
            Everything you need to regain control of your AI infrastructure costs without slowing down your team.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Spotlight that follows mouse over the grid */}
          <div 
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 hidden md:block z-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
            }}
          />

          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-px rounded-3xl overflow-hidden bg-white/5"
            >
              {/* Card border gradient effect */}
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 hidden md:block"
                style={{
                  background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 40%)`
                }}
              />
              <div className="relative h-full bg-[#050505] p-8 rounded-[23px] transition-all duration-300 group-hover:bg-[#080808]">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  <feature.icon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight text-white/90">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
