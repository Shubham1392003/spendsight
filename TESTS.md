# SpendSight AI - Testing Strategy

## Overview
This document outlines the testing architecture for the SpendSight AI platform, focusing on the core business logic powered by the `auditEngine`. We utilize [Vitest](https://vitest.dev/) for blazing-fast, TypeScript-native unit testing.

## Files
- `src/lib/auditEngine.ts`: The core business logic containing the optimization heuristics.
- `src/tests/auditEngine.test.ts`: The Vitest test suite that asserts the correctness of the engine.

## Test Coverage
The suite covers the following 5 critical heuristics and edge cases:

### 1. Enterprise Downgrade Recommendation
- **Scenario:** A user is on an "Enterprise" plan but has less than 50 seats.
- **Assertion:** Ensures the engine flags this waste, recommends a downgrade to the "Team" plan, calculates the proper monthly savings, and penalizes the optimization score by 20 points.

### 2. Seat Optimization Logic
- **Scenario:** A user is on a "Team" plan but only has 1 or 2 seats.
- **Assertion:** Verifies the engine recommends downgrading to "Pro/Plus" individual tiers, checking the exact $5/seat savings differential and score adjustments.

### 3. API Recommendation Logic
- **Scenario:** A heavy engineering team (Use Case: "Coding") is spending over $500/month on individual GUI chat seats.
- **Assertion:** Confirms the engine recommends switching to a direct API connection with a custom/BYOK (Bring Your Own Key) UI, projecting a 30% reduction in overhead costs.

### 4. Savings Calculation Correctness
- **Scenario:** A complex payload that triggers multiple independent optimization rules simultaneously (e.g., Team seat downgrade AND GitHub Copilot consolidation).
- **Assertion:** Strictly verifies that `monthlySavings` and `yearlySavings` correctly aggregate all generated recommendations without overriding or dropping values.

### 5. Low-Spend / Perfect Optimization Scenario
- **Scenario:** An ideal setup where a user is using Pay-as-you-go APIs efficiently with minimal overhead.
- **Assertion:** Ensures no false-positive recommendations are generated, savings return strictly as `$0`, and the optimization score remains a perfect `100`.

## How to Run the Tests
We have added a custom script to the `package.json`. You can execute the test suite continuously or in a single run:

```bash
# Run tests once
npm run test

# Run tests in watch mode (ideal for development)
npx vitest watch
```
