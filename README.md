# SpendSight AI

> **AI Infrastructure Audit Platform** — Instantly audit your AI stack, uncover waste, and reduce costs with enterprise-grade precision.

SpendSight AI is a production-ready, full-stack SaaS platform for lean startups and engineering teams. It scans your current AI tool stack (ChatGPT, Claude, Cursor, Copilot, APIs) and generates actionable, personalized savings recommendations with a shareable public report — zero login required.

**Built with:** Next.js 16 (App Router) · Tailwind CSS v4 · shadcn/ui · Framer Motion · Supabase · OpenAI · Resend · Vitest

---

## 🚀 Features & What is Built

### Core Product
| Feature | Status | Description |
|---|---|---|
| **Audit Engine** | ✅ Live | Deterministic rule-based engine evaluating Tool, Plan, Spend, Seats, Use Case to generate savings recommendations |
| **Interactive Audit Form** | ✅ Live | Accessible sliders, selectors, and email input with `localStorage` persistence |
| **Results Dashboard** | ✅ Live | Personalized report: monthly/yearly savings, optimization score ring, Recharts pie chart, actionable insights |
| **AI Executive Summary** | ✅ Live | GPT-4o-mini generates a 100-word founder-focused optimization summary via `/api/generate-summary` |
| **Shareable Reports** | ✅ Live | Unique public URLs at `/report/[id]` backed by Supabase PostgreSQL |
| **Transactional Email** | ✅ Live | Resend dispatches a branded HTML audit report email after form submission |
| **Rate Limiting** | ✅ Live | In-memory IP-based rate limiter (5 req/min) across all 3 API routes |
| **Open Graph Images** | ✅ Live | Dynamic `next/og` image generation per report — optimized for Twitter/LinkedIn sharing |
| **Dynamic Metadata** | ✅ Live | Per-report SEO metadata (title, description, OG, Twitter card) via `generateMetadata` |
| **Toast Notifications** | ✅ Live | Sonner toasts for email success, rate limit errors, and network failures |
| **CI Pipeline** | ✅ Live | GitHub Actions workflow on push/PR: lint + vitest test suite |
| **Unit Tests** | ✅ Live | 5 Vitest tests covering all audit engine heuristics and edge cases |

### UI/UX
| Feature | Status |
|---|---|
| Cinematic dark mode glassmorphism | ✅ |
| Framer Motion stagger + `AnimatePresence` transitions | ✅ |
| Scroll-aware Navbar (transparent → frosted glass) | ✅ |
| AI typing animation with cursor | ✅ |
| Copy Report Link with visual feedback (no browser alert) | ✅ |
| Hover-lift micro-animations on all cards | ✅ |
| Premium dark scrollbar | ✅ |
| `focus-visible` keyboard navigation ring | ✅ |
| Full ARIA labels and semantic HTML | ✅ |

---

## 🔌 APIs & Integrations

### Active & Working
| API / Service | Route | Purpose |
|---|---|---|
| **Supabase PostgreSQL** | `/api/reports` | Stores and retrieves audit reports |
| **OpenAI** (`gpt-4o-mini`) | `/api/generate-summary` | Generates AI executive summary |
| **Resend** | `/api/send-report` | Sends branded transactional email |
| **next/og** | `/report/[id]/opengraph-image` | Generates dynamic social preview card |

> ⚠️ **Local Dev Note:** The app contains graceful fallbacks on every API. If Supabase, OpenAI, or Resend keys are absent, the UI will not crash — it mocks the response and continues rendering.

### Environment Variables Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for AI summary)
OPENAI_API_KEY=sk-...

# Resend (for transactional email)
RESEND_API_KEY=re_...

# Public URL (for OG image absolute paths)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## ✅ What is Fully Working

- **End-to-End Audit Flow**: Form → Engine → Database → Results Dashboard → Shareable URL
- **AI Summary Generation**: OpenAI generates a real, safe, non-hallucinating 100-word executive summary
- **Email Delivery**: Non-blocking fire-and-forget email via Resend after every audit
- **Public Report Pages**: `/report/[id]` fetches from Supabase with 24hr ISR cache
- **Social Sharing**: OG images render dynamically with savings figures — perfect for Twitter/LinkedIn
- **Rate Limiting**: All 3 API routes return `429 Too Many Requests` with elegant toast fallback on the client
- **Unit Tests**: `npm run test` runs 5 passing Vitest tests against `auditEngine.ts`
- **CI/CD**: GitHub Actions runs lint + tests on every push to `main`
- **Accessibility**: Full keyboard navigation, screen-reader `aria-*` attributes, and `focus-visible` rings
- **localStorage Persistence**: Audit form state survives page refreshes

---

## 🚧 Static / Not Yet Implemented

| Feature | Notes |
|---|---|
| **User Authentication** | No login/signup. All reports are public by shareable URL only |
| **User Dashboard / History** | Users cannot browse their past audits without their unique link |
| **Dynamic Pricing Engine** | Savings math is based on hardcoded heuristics — no live pricing scrape |
| **"Book Consultation" CTA** | Button is a static placeholder — no Calendly/CRM integration wired |
| **PDF Export** | Results dashboard cannot be exported as a PDF yet |
| **Stripe / Billing** | No payment or subscription logic implemented |
| **Custom Email Domain** | Resend uses `onboarding@resend.dev` (unverified domain for dev/testing) |

---

## 💻 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env.local
# Fill in SUPABASE, OPENAI, RESEND, and SITE_URL keys

# 3. Start the development server
npm run dev
# → http://localhost:3001

# 4. Run the test suite
npm run test
```

---

## 🗂️ Project Structure

```
spendsight/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-summary/  # OpenAI summary route
│   │   │   ├── reports/           # Supabase insert route
│   │   │   └── send-report/       # Resend email route
│   │   ├── report/[id]/           # Public shareable report page
│   │   │   ├── page.tsx           # Server component with generateMetadata
│   │   │   └── opengraph-image.tsx # Dynamic OG image (next/og)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuditSection.tsx       # Main audit form
│   │   ├── ResultsDashboard.tsx   # Results + AI summary
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── emails/
│   │   └── ReportEmail.tsx        # HTML email template generator
│   ├── lib/
│   │   ├── auditEngine.ts         # Core deterministic recommendation engine
│   │   ├── rateLimit.ts           # In-memory IP rate limiter
│   │   └── supabase.ts            # Supabase client
│   └── tests/
│       └── auditEngine.test.ts    # Vitest unit tests
├── .github/workflows/ci.yml       # GitHub Actions CI
├── ARCHITECTURE.md                # Full system design + Mermaid diagram
├── ECONOMICS.md                   # Unit economics & ARR projections
├── GTM.md                         # Go-to-market strategy
├── PROMPTS.md                     # OpenAI prompt documentation
├── REFLECTION.md                  # Engineering decisions & tradeoffs
└── TESTS.md                       # Test coverage documentation
```

---

## 📄 Documentation

| File | Contents |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System diagram, tech decisions, scaling strategy |
| [`REFLECTION.md`](./REFLECTION.md) | Engineering tradeoffs, debugging, AI usage |
| [`ECONOMICS.md`](./ECONOMICS.md) | Unit economics, ARR projections, CAC model |
| [`GTM.md`](./GTM.md) | ICP, acquisition channels, first 100 users |
| [`PROMPTS.md`](./PROMPTS.md) | AI prompt design & safety guardrails |
| [`TESTS.md`](./TESTS.md) | Test cases & how to run them |
| [`ARCHITECTURE.md#rate-limiting`](./ARCHITECTURE.md) | Abuse protection strategy |

---

*A Credex Internship Project · Built with Next.js 16, Supabase, OpenAI, and Resend.*
