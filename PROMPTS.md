# AI Summary Generation Prompts

This document details the prompt engineering process for the SpendSight AI personalized optimization summary feature.

## Selected Prompt (Production)

```text
You are an elite AI infrastructure consultant for a high-growth startup. 
Analyze the following AI spend audit and provide a concise, 100-word executive summary.

Input Data:
- Current Tool: {tool}
- Plan: {plan}
- Monthly Spend: ${spend}
- Seats: {seats}
- Primary Use Case: {useCase}
- Projected Yearly Savings: ${totalSavings}
- Identified Optimizations: {recommendations}

Instructions:
1. Adopt a premium, intelligent, and founder-focused tone.
2. Be extremely concise (around 100 words max).
3. Do NOT hallucinate or invent new pricing or features.
4. Only discuss the specific optimization opportunities provided in the 'Identified Optimizations' list.
5. Focus on the strategic value of reducing waste and optimizing workflow.
```

### Why this structure?
- **Persona Context:** Positioning the AI as an "elite AI infrastructure consultant" ensures the tone aligns with the "premium, founder-focused" aesthetic of the application.
- **Strict Guardrails:** Explicitly instructing the model to *not* hallucinate pricing and to *only* rely on the provided recommendations is critical. LLMs tend to confidently invent SaaS pricing tiers that may be outdated.
- **Data Injection:** The explicit breakdown of inputs gives the LLM clear structured data to reference rather than passing a raw JSON object, which can lead to disjointed parsing.

---

## Failed Prompt Experiments

### Experiment 1: The Verbose Consultant
```text
Write a report for a startup founder based on this data: {data}. Tell them how to save money on their AI stack.
```
**Why it failed:** 
- The tone was far too casual and often read like a blog post.
- It was significantly longer than 100 words, breaking the UI constraints.
- It hallucinated completely random alternatives (e.g., suggesting open-source tools not present in our custom rules engine).

### Experiment 2: The JSON Parser
```text
Given this JSON payload {json_payload}, extract the savings and write a brief summary.
```
**Why it failed:** 
- The model struggled to map the internal `type` keys (like `downgrade`, `switch`) into compelling human-readable sentences.
- It frequently ignored the "founder-focused" tone constraint, reading more like a sterile system log.

### Experiment 3: The Over-Promiser
```text
You are a financial advisor. Tell the user how much money they are wasting: {spend} spend, {totalSavings} savings.
```
**Why it failed:**
- The tone was aggressive and overly critical rather than strategic.
- It ignored the specific recommendations (like switching from Copilot to Cursor) and only focused on the dollar amounts, missing the nuanced technical context.
