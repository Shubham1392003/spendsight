"use client";

import { motion } from "framer-motion";

const tools = [
  { name: "Cursor", color: "from-blue-500/20 to-blue-500/5" },
  { name: "Claude", color: "from-orange-500/20 to-orange-500/5" },
  { name: "ChatGPT", color: "from-green-500/20 to-green-500/5" },
  { name: "Gemini", color: "from-blue-400/20 to-purple-500/5" },
  { name: "GitHub Copilot", color: "from-white/20 to-white/5" },
  { name: "OpenAI API", color: "from-emerald-500/20 to-emerald-500/5" },
  { name: "Anthropic API", color: "from-amber-500/20 to-amber-500/5" },
  { name: "Windsurf", color: "from-cyan-500/20 to-cyan-500/5" },
];

export function ToolEcosystem() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Optimize your entire stack
          </h2>
          <p className="text-white/50 text-lg">
            We analyze usage across all major AI platforms to find hidden savings.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center">
          {/* Central Core */}
          <div className="absolute z-20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-md">
              <span className="font-bold tracking-tighter text-xl">SS.AI</span>
            </div>
            {/* Core Glow */}
            <div className="absolute w-full h-full bg-white/5 blur-xl rounded-full animate-pulse" />
          </div>

          {/* Lines */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              <circle cx="400" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Orbital Nodes */}
          {tools.map((tool, index) => {
            const angle = (index * 360) / tools.length;
            const radius = 150;
            // Convert angle to radians
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                animate={{
                  y: [y - 5, y + 5, y - 5],
                }}
                className="absolute z-10"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-b ${tool.color} border border-white/10 backdrop-blur-md shadow-lg`}>
                  <span className="text-sm font-medium whitespace-nowrap">{tool.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
