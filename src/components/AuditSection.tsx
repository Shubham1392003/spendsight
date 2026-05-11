"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ResultsDashboard } from "./ResultsDashboard";
import { AuditFormData, generateAuditReport, AuditResult } from "@/lib/auditEngine";
import { Loader2, Mail } from "lucide-react";

const TOOLS = ["ChatGPT", "Claude", "Cursor", "Gemini", "GitHub Copilot", "OpenAI API", "Anthropic API", "Windsurf"];
const PLANS = [
  { value: "Pro/Plus", label: "Pro / Plus" },
  { value: "Team", label: "Team" },
  { value: "Enterprise", label: "Enterprise" },
  { value: "Pay-as-you-go", label: "Pay-as-you-go (API)" },
];
const USE_CASES = [
  { value: "Coding", label: "Software Engineering" },
  { value: "Writing", label: "Content / Copywriting" },
  { value: "General", label: "General Operations" },
  { value: "Data", label: "Data Analysis" },
];

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <Label className="text-white/55 font-medium tracking-widest text-[11px] uppercase block">{label}</Label>
      {children}
    </div>
  );
}

export function AuditSection() {
  const [isClient, setIsClient] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const [formData, setFormData] = useState<AuditFormData & { email: string }>({
    tool: "ChatGPT",
    plan: "Enterprise",
    spend: 1000,
    seats: 10,
    useCase: "Coding",
    email: "",
  });

  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem("spendsight_audit_form");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData({
          tool: parsed.tool || "ChatGPT",
          plan: parsed.plan || "Enterprise",
          spend: Number(parsed.spend) || 1000,
          seats: Number(parsed.seats) || 10,
          useCase: parsed.useCase || "Coding",
          email: parsed.email || "",
        });
      }
    } catch {
      // ignore invalid json
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem("spendsight_audit_form", JSON.stringify(formData));
    const result = generateAuditReport(formData);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, result }),
      });

      if (res.status === 429) {
        const { toast } = await import("sonner");
        toast.error("Slow down! You are submitting too fast. Please wait a minute.");
        setIsSaving(false);
        return;
      }

      const data = await res.json();
      if (data.id) {
        result.id = data.id;

        // Fire-and-forget email — does not block UI
        if (formData.email) {
          fetch("/api/send-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              tool: formData.tool,
              monthlySavings: result.monthlySavings,
              yearlySavings: result.yearlySavings,
              reportUrl: `${window.location.origin}/report/${result.id}`,
            }),
          })
            .then(async (emailRes) => {
              const { toast } = await import("sonner");
              if (emailRes.status === 429) {
                toast.error("Email rate limit reached. Try again in a minute.");
                return;
              }
              const emailData = await emailRes.json();
              if (emailData.success || emailData.mocked) {
                toast.success("Report sent to your email!");
              } else {
                toast.error("Failed to send email.");
              }
            })
            .catch(async () => {
              const { toast } = await import("sonner");
              toast.error("Network error sending email.");
            });
        }
      }
    } catch (err) {
      console.error("Failed to save report", err);
    }

    setAuditResult(result);
    setIsSaving(false);
    setShowResults(true);
  };

  if (!isClient) return null;

  return (
    <section id="audit" className="py-28 md:py-36 relative bg-[#050505]" aria-labelledby="audit-heading">
      {/* Subtle top ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {!showResults || !auditResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 id="audit-heading" className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 text-gradient-strong">
                  Run Your Free Audit
                </h2>
                <p className="text-white/45 font-light text-base leading-relaxed">
                  Enter your current stack details to uncover hidden savings.
                </p>
              </div>

              <div className="glass rounded-[28px] p-6 md:p-10 shadow-2xl relative overflow-hidden border-gradient">
                {/* Top highlight line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/18 to-transparent" aria-hidden="true" />

                <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                  {/* Tool + Plan row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Primary AI Tool">
                      <Select value={formData.tool} onValueChange={(v) => setFormData({ ...formData, tool: v || formData.tool })}>
                        <SelectTrigger
                          id="tool-select"
                          className="bg-black/40 border-white/[0.08] text-white h-11 rounded-xl focus:ring-1 focus:ring-white/25 hover:border-white/15 transition-all duration-200"
                        >
                          <SelectValue placeholder="Select tool" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-white/[0.08] text-white rounded-xl shadow-2xl">
                          {TOOLS.map((t) => (
                            <SelectItem key={t} value={t} className="focus:bg-white/5 rounded-lg cursor-pointer">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField label="Current Plan">
                      <Select value={formData.plan} onValueChange={(v) => setFormData({ ...formData, plan: v || formData.plan })}>
                        <SelectTrigger
                          id="plan-select"
                          className="bg-black/40 border-white/[0.08] text-white h-11 rounded-xl focus:ring-1 focus:ring-white/25 hover:border-white/15 transition-all duration-200"
                        >
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-white/[0.08] text-white rounded-xl shadow-2xl">
                          {PLANS.map((p) => (
                            <SelectItem key={p.value} value={p.value} className="focus:bg-white/5 rounded-lg cursor-pointer">{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  {/* Spend Slider */}
                  <FormField label="Monthly Spend (Est.)">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/40 text-xs">$0</span>
                      <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1">
                        <span className="text-white font-mono text-sm tabular-nums">${formData.spend.toLocaleString()}</span>
                      </div>
                      <span className="text-white/40 text-xs">$10k</span>
                    </div>
                    <Slider
                      aria-label="Monthly Spend Estimate"
                      aria-valuetext={`$${formData.spend} per month`}
                      value={[formData.spend]}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(val) => setFormData({ ...formData, spend: Array.isArray(val) ? val[0] : val })}
                      className="cursor-grab active:cursor-grabbing"
                    />
                  </FormField>

                  {/* Seats Slider */}
                  <FormField label="Number of Seats">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/40 text-xs">1</span>
                      <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1">
                        <span className="text-white font-mono text-sm tabular-nums">{formData.seats} {formData.seats === 1 ? "user" : "users"}</span>
                      </div>
                      <span className="text-white/40 text-xs">500</span>
                    </div>
                    <Slider
                      aria-label="Number of Seats"
                      aria-valuetext={`${formData.seats} users`}
                      value={[formData.seats]}
                      min={1}
                      max={500}
                      step={1}
                      onValueChange={(val) => setFormData({ ...formData, seats: Array.isArray(val) ? val[0] : val })}
                      className="cursor-grab active:cursor-grabbing"
                    />
                  </FormField>

                  {/* Use Case */}
                  <FormField label="Primary Use Case">
                    <Select value={formData.useCase} onValueChange={(v) => setFormData({ ...formData, useCase: v || formData.useCase })}>
                      <SelectTrigger
                        id="usecase-select"
                        className="bg-black/40 border-white/[0.08] text-white h-11 rounded-xl focus:ring-1 focus:ring-white/25 hover:border-white/15 transition-all duration-200"
                      >
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f0f0f] border-white/[0.08] text-white rounded-xl shadow-2xl">
                        {USE_CASES.map((uc) => (
                          <SelectItem key={uc.value} value={uc.value} className="focus:bg-white/5 rounded-lg cursor-pointer">{uc.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  {/* Email */}
                  <FormField label="Where should we send the report?">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" aria-hidden="true" />
                      <input
                        id="email-input"
                        type="email"
                        required
                        placeholder="founder@startup.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        autoComplete="email"
                        className="w-full bg-black/40 border border-white/[0.08] text-white h-11 rounded-xl pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/25 hover:border-white/15 transition-all duration-200 placeholder:text-white/20"
                      />
                    </div>
                  </FormField>

                  <Button
                    disabled={isSaving}
                    type="submit"
                    id="submit-audit"
                    className="w-full h-13 rounded-xl bg-white text-black hover:bg-neutral-100 text-[15px] font-semibold shadow-[0_0_24px_rgba(255,255,255,0.12)] hover:shadow-[0_0_40px_rgba(255,255,255,0.22)] transition-all duration-300 disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Analyzing Stack…
                      </>
                    ) : (
                      "Analyze Stack →"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResultsDashboard
                data={formData}
                result={auditResult}
                onReset={() => setShowResults(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
