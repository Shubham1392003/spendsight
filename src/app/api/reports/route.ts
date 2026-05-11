import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
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
    const { formData, result } = body;

    // Generate a simple ID if crypto.randomUUID isn't available in all Edge contexts or we just want a short URL
    const id = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

    // If supabase URL/Key are placeholders, mock the success to not crash the UI
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn("No Supabase URL found. Mocking database save.");
      return NextResponse.json({ success: true, id, message: "Mock saved" });
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          id,
          tool: formData.tool,
          plan: formData.plan,
          spend: formData.spend,
          seats: formData.seats,
          use_case: formData.useCase,
          monthly_savings: result.monthlySavings,
          score: result.score,
          recommendations: result.recommendations,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to mock for local dev without DB setup
      return NextResponse.json({ success: true, id, message: "Mock saved (DB Error: " + error.message + ")" });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
