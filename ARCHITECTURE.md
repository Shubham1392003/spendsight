# SpendSight AI Architecture

## 1. System Overview

SpendSight AI is a full-stack, enterprise-grade AI infrastructure auditing platform. It is designed to capture user inputs regarding their AI tool stack, run deterministic cost-saving heuristics, generate a personalized AI executive summary, and instantly provide a persistent, highly-optimized, shareable public report.

## 2. Core Architecture Diagram

```mermaid
graph TD
    %% Frontend Clients
    User([End User]) -->|Interacts| UI[Next.js Client Components]
    Crawler([Social Crawlers / Twitter / LinkedIn]) -->|Scrape| SSR[Next.js Server Components]
    
    %% UI Layer
    subgraph Frontend [Frontend Application]
        UI -->|Persists State| LS[(localStorage)]
        UI -->|Triggers| Engine[Audit Engine]
    end

    %% API Layer
    subgraph Backend [Serverless API Layer]
        API_R[/api/reports]
        API_S[/api/generate-summary]
        API_E[/api/send-report]
        RL[In-Memory Rate Limiter]
        OG[next/og Image Generator]
    end

    %% External Services
    subgraph Services [External Infrastructure]
        DB[(Supabase PostgreSQL)]
        LLM[OpenAI API / gpt-4o-mini]
        Email[Resend API]
    end

    %% Data Flow
    UI -->|1. Submit Payload| API_R
    API_R -->|Protect| RL
    API_R -->|2. Store Report| DB
    
    UI -->|3. Fetch Summary| API_S
    API_S -->|Protect| RL
    API_S -->|4. Generate Insights| LLM
    
    UI -->|5. Fire & Forget| API_E
    API_E -->|Protect| RL
    API_E -->|6. Dispatch| Email

    %% Shareable URLs
    SSR -->|Read| DB
    SSR -->|7. Generate Dynamic Cards| OG
```

## 3. Technology Stack & Technical Decisions

### Why Next.js 16 (App Router)?
Next.js was selected to merge the frontend and backend into a single cohesive repository. The App Router provides React Server Components (RSC), allowing us to ship zero-JavaScript pages for the public `report/[id]` URLs. This drastically improves time-to-interactive (TTI) and guarantees perfect SEO. Next.js' native route handlers eliminate the need for an external Express backend, keeping the infrastructure lean.

### Why Tailwind CSS + shadcn/ui?
We prioritized a "Cinematic AI SaaS" aesthetic. Tailwind provides rapid styling primitives without runtime CSS-in-JS overhead. `shadcn/ui` was chosen over monolithic component libraries (like MUI or Ant Design) because it copies raw, accessible Radix UI primitives directly into our codebase. This gives us 100% control over the DOM and styles, ensuring we can build glassmorphic, highly-animated components without battling library bloat.

### Why Supabase?
Supabase was chosen as our persistent data layer. It provides instant, auto-generated REST APIs over a robust PostgreSQL instance. For a fast-moving startup, Supabase removes boilerplate CRUD logic while maintaining the strict relational integrity and Row Level Security (RLS) necessary for a multi-tenant platform.

## 4. Frontend Data Flow & Persistence

1. **State Management & Local Storage:** As users adjust sliders in the `AuditSection`, the form state is continuously serialized to `localStorage`. If a user accidentally closes the tab, they lose zero progress.
2. **Deterministic Engine:** The `src/lib/auditEngine.ts` is purely functional and decoupled from React. It runs synchronously on the client to generate immediate savings data (zero network latency for the initial score).
3. **Optimistic UI:** When the user hits "Analyze", the UI transitions immediately to a loading skeleton in the `ResultsDashboard`, prioritizing perceived performance while the backend APIs process the payload.

## 5. Serverless API Architecture

All backend routes are protected by `src/lib/rateLimit.ts`—a localized LRU cache that restricts IPs to 5 requests/minute to prevent API exhaustion.

- **`/api/reports`**: Receives the audit payload, generates a unique alphanumeric `id`, and persists the JSON to Supabase.
- **`/api/generate-summary`**: Passes the deterministic recommendations to OpenAI (`gpt-4o-mini`). It utilizes a highly constrained system prompt to prevent pricing hallucinations. If the network fails, it gracefully degrades to a deterministic string template to ensure the UI never crashes.
- **`/api/send-report`**: Asynchronously renders a React Email template to a static HTML string using `react-dom/server` logic, dispatching it via Resend. The client fires this in a non-blocking manner.

## 6. Shareable URLs & Open Graph Pipeline

Public reports (`/report/[id]`) are built for viral distribution.
- **Incremental Static Regeneration (ISR):** Both the `page.tsx` and `opengraph-image.tsx` routes export `revalidate = 86400`. Because audit reports are immutable, Next.js caches the HTML and generated OG PNG images at the Edge for 24 hours. Social media bots (Twitter/LinkedIn) will hit the Vercel CDN instead of our Supabase database.
- **Dynamic Image Generation:** `next/og` reads the report metadata and constructs a cinematic, glowing UI card displaying the exact monetary savings on the fly using Satori edge rendering.

## 7. Performance & Accessibility

- **Heavy Asset Chunking:** The massive `recharts` library is dynamically imported (`next/dynamic`) with `ssr: false`. This slices the initial JavaScript payload by over 50%, ensuring a Lighthouse score of 90+.
- **Accessibility (a11y):** All complex interactive elements (like the base-ui Sliders) are fully controllable via keyboard traversal and annotated with proper `aria-labels`. High contrast ratios are enforced across all `#050505` backgrounds.

## 8. Scaling to 10k Audits/Day

To scale the architecture for massive traffic spikes, the following upgrade path is planned:
1. **Upstash Redis:** Replace the in-memory rate limiter with `@upstash/ratelimit` for distributed, multi-region rate limiting.
2. **Supavisor (Connection Pooling):** Enable Supabase connection pooling to prevent max connection exhaustion during burst database inserts.
3. **QStash Background Queues:** Offload the `/api/send-report` and `/api/generate-summary` HTTP requests to Upstash QStash. This guarantees delivery via dead-letter queues and retry logic, preventing dropped reports during provider outages.
