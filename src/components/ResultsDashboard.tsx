"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, ArrowRightLeft, ArrowDownCircle,
  RefreshCcw, Layers, Zap, Sparkles, Copy, Check, ExternalLink
} from "lucide-react";
import { AuditFormData, AuditResult, Recommendation } from "@/lib/auditEngine";
import dynamic from "next/dynamic";

// Dynamically import heavy Recharts to reduce initial JS payload
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

// ─── AI Summary Card ───────────────────────────────────────────────────────────
function AISummaryCard({ data, result }: { data: AuditFormData; result: AuditResult }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchSummary() {
      try {
        const res = await fetch("/api/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            totalSavings: result.yearlySavings,
            recommendations: result.recommendations,
          }),
        });

        if (res.status === 429) {
          if (mounted) {
            setSummary("AI summary is temporarily unavailable — you have run several audits in quick succession. Your results and savings calculations above are fully accurate. Wait a moment and refresh to generate an AI summary.");
            setLoading(false);
          }
          return;
        }

        const json = await res.json();
        if (mounted) {
          setSummary(json.summary);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setSummary(
            "We have analyzed your AI stack and identified clear optimization paths. Review the actionable insights below to reclaim your infrastructure spend."
          );
          setLoading(false);
        }
      }
    }
    fetchSummary();
    return () => { mounted = false; };
  }, [data, result]);

  useEffect(() => {
    if (!loading && summary) {
      let i = 0;
      setTypingDone(false);
      const interval = setInterval(() => {
        i++;
        setDisplayedText(summary.slice(0, i));
        if (i >= summary.length) {
          clearInterval(interval);
          setTypingDone(true);
        }
      }, 14);
      return () => clearInterval(interval);
    }
  }, [summary, loading]);

  return (
    <div
      className="glass rounded-[24px] p-6 md:p-8 mb-6 relative overflow-hidden group border border-white/[0.06] hover-lift"
      role="region"
      aria-label="AI Executive Summary"
      aria-live="polite"
      aria-busy={loading}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/[0.07] blur-[90px] rounded-full transition-opacity duration-700 group-hover:bg-purple-500/[0.13]" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/[0.07] blur-[90px] rounded-full transition-opacity duration-700 group-hover:bg-blue-500/[0.13]" aria-hidden="true" />

      <div className="flex flex-col md:flex-row items-start md:space-x-5 relative z-10 gap-4 md:gap-0">
        <div className="p-3.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl shrink-0 self-start" aria-hidden="true">
          <Sparkles className="h-5 w-5 text-purple-400" />
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-[13px] font-semibold text-white/50 tracking-widest uppercase mb-3">
            AI Executive Summary
          </h3>
          {loading ? (
            <div className="space-y-2.5 animate-pulse" aria-label="Loading summary">
              <div className="h-3 bg-white/[0.07] rounded-full w-full" />
              <div className="h-3 bg-white/[0.07] rounded-full w-[88%]" />
              <div className="h-3 bg-white/[0.07] rounded-full w-[72%]" />
            </div>
          ) : (
            <p className="text-white/65 leading-[1.75] font-light text-[15px]">
              {displayedText}
              {!typingDone && (
                <span
                  className="inline-block w-[2px] h-[1.1em] bg-purple-400/80 ml-0.5 translate-y-[3px] animate-pulse"
                  aria-hidden="true"
                />
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Icon helper ──────────────────────────────────────────────────────────────
function RecIcon({ type }: { type: Recommendation["type"] }) {
  const cls = "h-4 w-4 text-white/50 mt-0.5 shrink-0";
  switch (type) {
    case "downgrade": return <ArrowDownCircle className={cls} />;
    case "switch": return <ArrowRightLeft className={cls} />;
    case "consolidate": return <Layers className={cls} />;
    case "optimize": return <Zap className={cls} />;
    default: return <CheckCircle2 className={cls} />;
  }
}

// ─── Copy Link button ─────────────────────────────────────────────────────────
function CopyLinkButton({ reportId }: { reportId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/report/${reportId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [reportId]);

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      aria-label="Copy shareable report link"
      className="bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.16] text-white/80 hover:text-white rounded-full h-11 px-5 transition-all duration-200 gap-2"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy Report Link"}
    </Button>
  );
}

// ─── Results Dashboard ────────────────────────────────────────────────────────
interface ResultsProps {
  data: AuditFormData;
  result: AuditResult;
  onReset: () => void;
}

const CHART_COLORS = {
  optimized: "#ffffff",
  savings: "rgba(255,255,255,0.18)",
};

export function ResultsDashboard({ data, result, onReset }: ResultsProps) {
  const { monthlySavings, yearlySavings, score, recommendations } = result;
  const isHighSavings = yearlySavings > 5000;

  const chartData = [
    { name: "Optimized Spend", value: Math.max(0, data.spend - monthlySavings) },
    { name: "Potential Savings", value: monthlySavings },
  ];

  const scoreCircumference = 2 * Math.PI * 52; // r=52 → C≈326.7

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto"
      role="main"
      aria-label="Audit Results Dashboard"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tighter text-gradient">
          Audit Complete
        </h2>
        <p className="text-white/45 text-base md:text-lg font-light tracking-wide">
          Your AI infrastructure optimization report is ready.
        </p>
      </div>

      {/* AI Summary */}
      <AISummaryCard data={data} result={result} />

      {/* KPI Grid */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4" role="region" aria-label="Key metrics">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {/* Monthly Savings */}
          <div className="glass rounded-[24px] p-7 relative overflow-hidden group hover-lift">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] blur-2xl rounded-full group-hover:bg-white/[0.07] transition-all duration-500" aria-hidden="true" />
            <p className="text-white/45 text-[11px] font-semibold tracking-widest uppercase mb-2">Monthly Savings</p>
            <div
              className="text-5xl font-bold text-white tracking-tighter tabular-nums"
              aria-label={`$${monthlySavings.toLocaleString()} monthly savings`}
            >
              ${monthlySavings.toLocaleString()}
            </div>
          </div>

          {/* Yearly Projection */}
          <div className="glass rounded-[24px] p-7 relative overflow-hidden group hover-lift">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] blur-2xl rounded-full group-hover:bg-white/[0.07] transition-all duration-500" aria-hidden="true" />
            <p className="text-white/45 text-[11px] font-semibold tracking-widest uppercase mb-2">Yearly Projection</p>
            <div
              className="text-5xl font-bold text-gradient tracking-tighter tabular-nums"
              aria-label={`$${yearlySavings.toLocaleString()} yearly savings`}
            >
              ${yearlySavings.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Optimization Score */}
        <div
          className="glass rounded-[24px] p-7 flex flex-col items-center justify-center relative group hover-lift"
          role="img"
          aria-label={`Optimization score: ${score} out of 100`}
        >
          <svg width="120" height="120" className="-rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="5"
              strokeDasharray={`${(score / 100) * scoreCircumference} ${scoreCircumference}`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold tracking-tighter">{score}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/45 font-semibold mt-0.5">Opt. Score</span>
          </div>
        </div>
      </div>

      {/* Chart + Recommendations */}
      <div className="grid lg:grid-cols-3 gap-4 mb-10">
        {/* Pie Chart */}
        <div className="glass rounded-[24px] p-6 flex flex-col h-[300px]" role="img" aria-label="Spend breakdown pie chart">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/45 mb-4">Spend Breakdown</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={180}>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={CHART_COLORS.optimized} />
                  <Cell fill={CHART_COLORS.savings} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    fontSize: "13px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(val) => [`$${Number(val ?? 0).toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        <div
          className="lg:col-span-2 glass rounded-[24px] p-6 md:p-7"
          role="region"
          aria-label="Actionable recommendations"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-white/45 mb-5">Actionable Insights</h3>
          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.05] hover:bg-white/[0.045] hover:border-white/[0.09] transition-all duration-250"
                >
                  <RecIcon type={rec.type} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white/88 tracking-tight text-[14px]">{rec.title}</h4>
                    <p className="text-[13px] text-white/50 mt-1 leading-relaxed font-light">{rec.description}</p>
                    {rec.monthlySavings > 0 && (
                      <span className="mt-2.5 inline-flex text-[11px] font-semibold text-white/50 uppercase tracking-widest bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
                        Est. ${rec.monthlySavings.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.05]">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-white/88 tracking-tight text-[14px]">Your stack is well-optimized!</h4>
                  <p className="text-[13px] text-white/50 mt-1 leading-relaxed font-light">
                    No obvious inefficiencies were found in your current AI tooling setup.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="flex flex-col items-center gap-5">
        {isHighSavings && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full p-8 md:p-10 rounded-[24px] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
            <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tighter text-gradient-strong">
              Ready to claim these savings?
            </h3>
            <p className="text-white/50 mb-8 font-light tracking-wide max-w-md mx-auto text-[15px] leading-relaxed">
              Let our experts restructure your AI infrastructure to eliminate waste immediately.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-neutral-100 rounded-full h-12 px-9 text-[15px] font-semibold shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.28)] transition-all duration-300 gap-2"
            >
              Book a Credex Consultation
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {result.id && <CopyLinkButton reportId={result.id} />}
          <Button
            variant="ghost"
            onClick={onReset}
            aria-label="Run another audit"
            className="text-white/35 hover:text-white hover:bg-white/5 rounded-full h-11 px-5 transition-all duration-200 gap-2"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            Run Another Audit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
