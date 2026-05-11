# Reflection: Building SpendSight AI

Building SpendSight AI was an exercise in balancing speed of execution with long-term architectural stability. As a developer shipping a production-ready MVP, the primary constraint wasn't feature ideas—it was time. This reflection breaks down the core engineering, design, and product decisions made during development.

## 1. Engineering Tradeoffs & Architectural Decisions

**Decoupling the Heuristics Engine**
The most critical architectural decision was pulling the `auditEngine.ts` logic entirely out of the React component tree. Initially, it was tempting to calculate savings directly inside the form's `onSubmit` handler. However, embedding business logic inside UI components creates massive technical debt and makes testing nearly impossible. By decoupling it into a pure TypeScript function, I was able to instantly write a Vitest suite against it, execute calculations synchronously without network overhead, and guarantee that the UI and business logic could evolve independently.

**Serverless Over Provisioned Instances**
I chose the Next.js App Router and Serverless API routes instead of spinning up a traditional Express/Node.js backend. The tradeoff here is dealing with stateless, ephemeral environments (which required me to build a localized in-memory `Map` for rate limiting rather than relying on standard stateful middleware). However, the benefit is massive: zero infrastructure management, automatic global CDN distribution, and the ability to leverage Incremental Static Regeneration (ISR) to permanently cache heavy OpenGraph image generations.

## 2. Debugging & The Realities of Next.js

A significant debugging challenge emerged during the implementation of the transactional email system via Resend. 

I initially used `react-dom/server` inside the `/api/send-report` route to render a React component into a static email template. However, the Next.js 15+ Turbopack compiler threw a hard build error: `You're importing a component that imports react-dom/server`. Next.js strictly forbids this in certain route contexts for performance and security reasons. I spent time trying to configure Edge runtime exceptions before realizing I was over-engineering the solution. 

**The Fix:** I didn't need a heavy React dependency tree just to send an email. I refactored the email template into a pure JavaScript template literal function that returns a highly-styled, native HTML string. This completely eliminated the Turbopack build error, stripped dead weight from the server bundle, and executed infinitely faster.

## 3. Working with AI Responsibly

I utilized AI coding assistants heavily to accelerate boilerplate generation (like scaffolding the initial Tailwind layouts) and writing repetitive testing assertions. However, I drew a hard line on what the AI was allowed to control.

**What I did NOT trust AI with:**
1. **The Core Business Logic:** LLMs are notorious for confidently hallucinating SaaS pricing. I did not allow the AI to determine the cost of a ChatGPT Enterprise seat or GitHub Copilot. All pricing data and savings math were hardcoded deterministically into `auditEngine.ts`. The AI API (OpenAI) was *only* given permission to summarize the data my engine had already calculated using strict prompt guardrails.
2. **Database Migrations:** I manually managed the Supabase PostgreSQL schema. Relying on an AI to generate migration scripts blindly is a fast track to corrupting relational data.

**Where AI Failed Me:**
While attempting to manage the custom `Slider` component state, the AI suggested passing an `onChange` handler that continuously overwrote the default component value, throwing a React crash warning: `A component is changing the default value state of an uncontrolled Slider`. The AI completely missed the subtle difference between Radix UI primitives and Base-UI's controlled/uncontrolled state paradigms. I had to discard the AI's logic, manually read the library documentation, and rewrite the component to use a fully controlled React state bound reliably to `localStorage`.

## 4. Entrepreneurial Thinking & Design

The design of SpendSight AI was entirely focused on **perceived value**. 

A barebones HTML form collecting data feels like a boring survey; a glassmorphic dark-mode dashboard with interactive sliders, dynamic spotlight effects, and a real-time typing animation feels like a premium "Enterprise Audit." 

I specifically integrated the `next/og` Open Graph image generator so that when a founder shares their report on LinkedIn or Twitter, the preview card highlights massive, glowing text displaying their exact "$12,000/yr Savings." The goal wasn't just to build a cost calculator—it was to build a lead generation engine that inherently encourages viral distribution. Every technical decision, from the sub-100ms decoupled calculations to the heavily cached social preview cards, was designed to optimize the end-user conversion funnel and validate the startup hypothesis.
