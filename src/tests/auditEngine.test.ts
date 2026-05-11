import { describe, it, expect } from 'vitest';
import { generateAuditReport, AuditFormData } from '../lib/auditEngine';

describe('Audit Engine', () => {
  it('1. should recommend downgrading from Enterprise if under 50 seats', () => {
    const data: AuditFormData = {
      tool: 'ChatGPT',
      plan: 'Enterprise',
      spend: 2000,
      seats: 10,
      useCase: 'Coding'
    };
    
    const result = generateAuditReport(data);

    expect(result.recommendations.some(r => r.id === 'ent_downgrade')).toBe(true);
    expect(result.score).toBe(80); // Base 100 - 20
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  it('2. should optimize seats by downgrading Team plan for 1-2 users', () => {
    const data: AuditFormData = {
      tool: 'Claude',
      plan: 'Team',
      spend: 60,
      seats: 2,
      useCase: 'Writing'
    };
    
    const result = generateAuditReport(data);

    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].id).toBe('team_downgrade');
    expect(result.monthlySavings).toBe(10); // 2 seats * $5 savings
    expect(result.score).toBe(90); // Base 100 - 10
  });

  it('3. should recommend API usage for heavy coding teams on Team/Pro plans', () => {
    const data: AuditFormData = {
      tool: 'ChatGPT',
      plan: 'Team',
      spend: 1000,
      seats: 20,
      useCase: 'Coding'
    };
    
    const result = generateAuditReport(data);

    const apiRec = result.recommendations.find(r => r.id === 'api_switch');
    expect(apiRec).toBeDefined();
    expect(apiRec?.monthlySavings).toBe(300); // 30% of $1000
    expect(result.score).toBeLessThan(100);
  });

  it('4. should correctly calculate aggregate monthly and yearly savings', () => {
    // Scenario hitting multiple rules:
    // - Team with 2 seats -> $10 savings
    // - Copilot + Coding -> Consolidate with Cursor -> 2 seats * $10 = $20 savings
    // Total = $30 monthly
    const data: AuditFormData = {
      tool: 'GitHub Copilot',
      plan: 'Team',
      spend: 100,
      seats: 2,
      useCase: 'Coding'
    };
    
    const result = generateAuditReport(data);

    expect(result.recommendations).toHaveLength(2);
    expect(result.monthlySavings).toBe(30);
    expect(result.yearlySavings).toBe(360); // 30 * 12
  });

  it('5. should return a perfect score with zero savings for highly optimized low-spend setups', () => {
    const data: AuditFormData = {
      tool: 'OpenAI API',
      plan: 'Pay-as-you-go',
      spend: 50,
      seats: 1,
      useCase: 'Coding'
    };
    
    const result = generateAuditReport(data);

    expect(result.recommendations).toHaveLength(0);
    expect(result.score).toBe(100);
    expect(result.monthlySavings).toBe(0);
    expect(result.yearlySavings).toBe(0);
  });
});
