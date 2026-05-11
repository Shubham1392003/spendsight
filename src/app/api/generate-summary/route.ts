import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { summary: "Rate limit exceeded. Please wait a minute before requesting another AI summary." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { tool, plan, spend, seats, useCase, totalSavings, recommendations } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback template if API fails or key is missing
    const getFallbackSummary = () => {
      const recsText = recommendations && recommendations.length > 0 
        ? `We identified key opportunities to optimize your ${plan} plan, specifically targeting ${recommendations[0].title}. `
        : `Your current configuration appears well-aligned with industry standards. `;
      
      return `As your AI infrastructure consultant, I've analyzed your stack. You're currently allocating $${spend}/month to ${tool} across ${seats} seats, primarily for ${useCase}. ${recsText}By implementing these structural changes, you are projected to eliminate waste and save $${totalSavings} annually without compromising your team's engineering velocity.`;
    };

    if (!apiKey) {
      // Simulate network delay for premium UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ summary: getFallbackSummary() });
    }

    const systemPrompt = `You are an elite AI infrastructure consultant for a high-growth startup. Analyze the following AI spend audit and provide a concise, 100-word executive summary.`;
    
    const prompt = `Input Data:
- Current Tool: ${tool}
- Plan: ${plan}
- Monthly Spend: $${spend}
- Seats: ${seats}
- Primary Use Case: ${useCase}
- Projected Yearly Savings: $${totalSavings}
- Identified Optimizations: ${JSON.stringify(recommendations)}

Instructions:
1. Adopt a premium, intelligent, and founder-focused tone.
2. Be extremely concise (around 100 words max).
3. Do NOT hallucinate or invent new pricing or features.
4. Only discuss the specific optimization opportunities provided in the 'Identified Optimizations' list.
5. Focus on the strategic value of reducing waste and optimizing workflow.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return NextResponse.json({ summary: getFallbackSummary() });
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    return NextResponse.json({ summary });

  } catch (err) {
    console.error("Summary generation error:", err);
    // Generic fallback if anything throws
    return NextResponse.json({ 
      summary: "We have analyzed your AI stack and identified clear optimization paths. Review the actionable insights below to reclaim your infrastructure spend." 
    });
  }
}
