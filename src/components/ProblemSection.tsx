"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", spend: 1200 },
  { month: "Feb", spend: 1900 },
  { month: "Mar", spend: 3100 },
  { month: "Apr", spend: 4500 },
  { month: "May", spend: 6800 },
  { month: "Jun", spend: 10500 },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-32 relative border-t border-white/5 bg-neutral-950">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8">
              Everyone’s adopting AI.<br />
              <span className="text-white/40">Nobody’s optimizing spend.</span>
            </h2>
            <div className="space-y-6 text-lg text-white/60">
              <div className="flex items-start space-x-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                <p><strong>Duplicate Subscriptions:</strong> Teams buying individual ChatGPT Plus when Enterprise makes more sense.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                <p><strong>Unused Seats:</strong> Paying for GitHub Copilot licenses for developers who switched to Cursor.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                <p><strong>API Overspend:</strong> Using expensive models for tasks that could run on cheaper, faster alternatives.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-2xl rounded-3xl" />
            <div className="relative bg-[#0b0b0b] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Projected AI Infrastructure Cost</h3>
                <p className="text-sm text-white/40">Without optimization</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
