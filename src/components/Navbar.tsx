"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group" aria-label="SpendSight AI Home">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] transition-all duration-300">
            <Activity className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">SpendSight AI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/50" role="menubar">
          <Link href="#problem" className="hover:text-white transition-colors duration-200" role="menuitem">The Problem</Link>
          <Link href="#features" className="hover:text-white transition-colors duration-200" role="menuitem">Features</Link>
          <Link href="#audit" className="hover:text-white transition-colors duration-200" role="menuitem">Audit</Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5 hidden sm:flex transition-all duration-200 rounded-full"
          >
            Log in
          </Button>
          <Link
            href="#audit"
            className="inline-flex items-center justify-center bg-white text-black hover:bg-neutral-100 rounded-full px-5 py-2 font-semibold text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.28)] transition-all duration-300"
          >
            Start Free Audit
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
