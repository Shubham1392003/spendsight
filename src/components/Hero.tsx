"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[560px] w-[900px] rounded-[100%] bg-gradient-to-b from-white/[0.065] to-transparent blur-[100px]" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[200px] w-[400px] rounded-[100%] bg-white/[0.03] blur-[40px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center flex flex-col items-center max-w-5xl">
        {/* Badge */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center space-x-2 glass border-gradient rounded-full px-4 py-1.5 mb-8 cursor-default"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-white/75 tracking-wide">SpendSight Engine v2.0 Live</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          initial="hidden"
          animate="show"
          custom={0.08}
          variants={fadeUp}
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-gradient mb-6 leading-[1.08] max-w-4xl"
        >
          Stop Overspending{" "}
          <br className="hidden md:block" />
          on AI Tools
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial="hidden"
          animate="show"
          custom={0.16}
          variants={fadeUp}
          className="text-lg md:text-xl text-white/45 mb-10 max-w-xl font-light tracking-wide leading-relaxed"
        >
          Instantly audit your AI stack, uncover waste, and reduce infrastructure costs with enterprise-grade precision.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.24}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="#audit"
            className="inline-flex items-center justify-center h-12 px-8 bg-white text-black hover:bg-neutral-100 rounded-full text-[15px] font-semibold shadow-[0_0_40px_rgba(255,255,255,0.14)] hover:shadow-[0_0_60px_rgba(255,255,255,0.26)] transition-all duration-500 group"
          >
            Start Free Audit
            <ChevronRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 rounded-full bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.14] text-white text-[15px] transition-all duration-300"
          >
            See Example Report
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/35 tracking-wide font-medium"
          aria-label="Trust indicators"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/40" aria-hidden="true" />
            <span>No credit card required</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/15 hidden sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-white/40" aria-hidden="true" />
            <span>Results in under 60 seconds</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/15 hidden sm:block" aria-hidden="true" />
          <span>Trusted by 100+ founders</span>
        </motion.div>
      </div>
    </section>
  );
}
