export interface AuditFormData {
  tool: string;
  plan: string;
  spend: number;
  seats: number;
  useCase: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'downgrade' | 'switch' | 'consolidate' | 'optimize';
  monthlySavings: number;
}

export interface AuditResult {
  id?: string;
  monthlySavings: number;
  yearlySavings: number;
  score: number;
  recommendations: Recommendation[];
}

export function generateAuditReport(data: AuditFormData): AuditResult {
  const recommendations: Recommendation[] = [];
  let monthlySavings = 0;
  let score = 100;

  // 1. Plan Optimization
  if (data.plan === "Enterprise" && data.seats < 50) {
    const estimatedEnterpriseCost = data.seats * 60; // Estimate
    const teamCost = data.seats * 25; 
    const savings = Math.max(estimatedEnterpriseCost - teamCost, data.spend * 0.4);
    
    recommendations.push({
      id: "ent_downgrade",
      title: `Downgrade to Team Plan`,
      description: `Enterprise plans for under 50 seats are often unnecessary. The Team plan provides similar security and admin features at less than half the cost.`,
      type: "downgrade",
      monthlySavings: savings
    });
    score -= 20;
  } else if (data.plan === "Team" && data.seats <= 2) {
    const savings = data.seats * 5; // Team ($25) vs Pro ($20)
    recommendations.push({
      id: "team_downgrade",
      title: `Downgrade to Pro/Plus`,
      description: `Team plans for 1-2 users provide minimal ROI. Individual Pro plans are more cost-effective.`,
      type: "downgrade",
      monthlySavings: savings
    });
    score -= 10;
  }

  // 2. API vs Chat Interface for heavy usage
  if ((data.plan === "Pro/Plus" || data.plan === "Team") && data.spend > 500 && data.useCase === "Coding") {
    const savings = data.spend * 0.3; // Estimate 30% savings by using API directly
    recommendations.push({
      id: "api_switch",
      title: `Switch to Direct API + Custom UI`,
      description: `For heavy engineering teams, paying per-seat for web interfaces is expensive. Using API keys with local tools (like TypingMind or custom integrations) can cut costs by ~30%.`,
      type: "switch",
      monthlySavings: savings
    });
    score -= 15;
  }

  // 3. Alternative Recommendations
  if (data.tool === "OpenAI API" && data.useCase === "Writing") {
    const savings = data.spend * 0.4;
    recommendations.push({
      id: "alt_claude",
      title: `Switch to Anthropic (Claude 3.5 Sonnet)`,
      description: `For copywriting and content, Claude 3.5 Sonnet often produces better results than GPT-4o while being significantly cheaper for token volume.`,
      type: "switch",
      monthlySavings: savings
    });
    score -= 15;
  }

  if (data.tool === "GitHub Copilot" && data.useCase === "Coding") {
    recommendations.push({
      id: "alt_cursor",
      title: `Consolidate with Cursor`,
      description: `Many teams pay for Copilot AND ChatGPT. Cursor provides a unified coding environment that replaces the need for separate Copilot and ChatGPT subscriptions.`,
      type: "consolidate",
      monthlySavings: data.seats * 10
    });
    score -= 5;
  }
  
  if (data.plan === "Pay-as-you-go" && data.spend > 2000) {
    recommendations.push({
      id: "api_batch",
      title: `Implement Batch API & Caching`,
      description: `At $2k+/mo, implementing semantic caching and batch processing for asynchronous tasks can yield immediate infrastructure savings.`,
      type: "optimize",
      monthlySavings: data.spend * 0.25
    });
    score -= 15;
  }

  // Calculate totals
  monthlySavings = recommendations.reduce((acc, rec) => acc + rec.monthlySavings, 0);

  // If no specific rules hit, but spend is extremely high for seats
  if (recommendations.length === 0 && data.spend / data.seats > 100 && data.plan !== "Pay-as-you-go") {
    const savings = data.spend * 0.2;
    recommendations.push({
      id: "general_optimize",
      title: `Audit Seat Utilization`,
      description: `Your per-seat spend is unusually high. Analyze your workspace to offboard inactive users and consolidate duplicate accounts.`,
      type: "optimize",
      monthlySavings: savings
    });
    score -= 25;
    monthlySavings = savings;
  }

  // Ensure score bounds
  score = Math.max(0, Math.min(100, score));

  return {
    monthlySavings: Math.round(monthlySavings),
    yearlySavings: Math.round(monthlySavings * 12),
    score,
    recommendations
  };
}
