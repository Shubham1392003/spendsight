# SpendSight AI: Unit Economics & Revenue Projections

This document outlines the financial modeling and unit economics for SpendSight AI, positioning it as a highly leveraged lead-generation engine for Credex consulting services or as a standalone enterprise SaaS product.

---

## 1. The Business Model

SpendSight AI operates on a **Free-to-Audit, Pay-to-Execute** model. The platform provides immediate, high-value heuristics (the "Audit") completely free of charge and without a login wall. This mathematically maximizes top-of-funnel conversion. Revenue is generated exclusively at the bottom of the funnel through high-ticket consulting engagements or enterprise optimization contracts.

### Funnel Assumptions (Baseline)
- **Top of Funnel (Traffic):** Organic distribution (X, LinkedIn, Reddit, Product Hunt) and engineered viral loops (shareable Open Graph reports).
- **Activation Rate (Visitor -> Audit Run):** `15.0%` (Frictionless, no auth required).
- **Capture Rate (Audit -> Email Provided):** `30.0%` (High intent, they want the PDF/Report).
- **Lead Rate (Email -> Booked Consultation):** `5.0%`
- **Close Rate (Consultation -> Paid Contract):** `20.0%`

---

## 2. Credex Lead Valuation

To determine the exact value of the SpendSight AI asset to Credex, we must reverse-engineer the value of a closed contract.

* **Average Contract Value (ACV):** $15,000 (Typical AI infrastructure optimization or FinOps implementation engagement).

**Expected Value (EV) Calculations:**
* **EV of a Booked Consultation:** $15,000 * 20% Close Rate = **$3,000**
* **EV of a Captured Email:** $3,000 * 5% Lead Rate = **$150**
* **EV of an Audit Run:** $150 * 30% Capture Rate = **$45**
* **EV of a Unique Visitor:** $45 * 15% Activation Rate = **$6.75**

Every time a user visits the SpendSight AI landing page, they represent an expected value of **$6.75** to the Credex pipeline.

---

## 3. Customer Acquisition Cost (CAC)

Because SpendSight AI relies on organic distribution and a built-in viral loop (K-factor of ~0.15 from public report sharing), the primary cost is engineering time, not ad spend.

* **Target Blended CAC:** $0 (Bootstrapped / Founder-led sales).
* **Maximum Allowable CAC (Paid Ads):** Given an LTV (Lifetime Value) of $15,000 and a target LTV:CAC ratio of 4:1, the maximum we can spend to acquire a *paying customer* is $3,750. 
* **Target CPA (Cost Per Acquisition for an Email):** $3,750 * (5% * 20%) = **$37.50 max CPA per captured email**.

---

## 4. ARR Projection Models (Year 1)

The following matrix projects the first 12 months of operations based on varying traffic velocities. 

### Scenario 1: Failure Case (The Sandbox)
*A post-launch flatline where organic distribution fails and viral loops do not take hold.*

| Metric | Calculation | Total |
| :--- | :--- | :--- |
| **Annual Traffic** | 500 visitors/mo * 12 | 6,000 visitors |
| **Audits Run (10% rate)** | 6,000 * 0.10 | 600 audits |
| **Emails Captured (20% rate)** | 600 * 0.20 | 120 leads |
| **Consultations (3% rate)** | 120 * 0.03 | 3.6 meetings |
| **Closed Deals (15% rate)** | 3.6 * 0.15 | 0.5 deals |
| **Projected Y1 Revenue** | 0.5 * $15,000 | **$7,500** |

*Analysis:* Even in a catastrophic failure state, the zero-marginal-cost nature of the software means capturing a single mid-tier deal covers the serverless hosting costs ($0/mo on Vercel) indefinitely.

### Scenario 2: Realistic Case (The Baseline)
*Consistent organic growth, successful SEO indexing, and moderate viral loop traction.*

| Metric | Calculation | Total |
| :--- | :--- | :--- |
| **Annual Traffic** | 3,000 visitors/mo * 12 | 36,000 visitors |
| **Audits Run (15% rate)** | 36,000 * 0.15 | 5,400 audits |
| **Emails Captured (30% rate)** | 5,400 * 0.30 | 1,620 leads |
| **Consultations (5% rate)** | 1,620 * 0.05 | 81 meetings |
| **Closed Deals (20% rate)** | 81 * 0.20 | 16.2 deals |
| **Projected Y1 Revenue** | 16.2 * $15,000 | **$243,000** |

*Analysis:* A highly sustainable, profitable boutique agency model. Generating $243k ARR with software operating at a ~99% gross margin validates SpendSight as a premier lead-generation magnet for Credex.

### Scenario 3: Optimistic Case (The Scale-Up)
*Product Hunt Product of the Day, heavy viral loops on LinkedIn/X, and compounding SEO authority.*

| Metric | Calculation | Total |
| :--- | :--- | :--- |
| **Annual Traffic** | 15,000 visitors/mo * 12 | 180,000 visitors |
| **Audits Run (20% rate)** | 180,000 * 0.20 | 36,000 audits |
| **Emails Captured (35% rate)** | 36,000 * 0.35 | 12,600 leads |
| **Consultations (7% rate)** | 12,600 * 0.07 | 882 meetings |
| **Closed Deals (25% rate)** | 882 * 0.25 | 220 deals |
| **Projected Y1 Revenue** | 220 * $15,000 | **$3,300,000** |

*Analysis:* At this scale, the bottleneck shifts from lead acquisition to operational fulfillment. Credex would need to transition from manual consulting to selling an automated enterprise B2B SaaS platform to fulfill 200+ deals annually.
