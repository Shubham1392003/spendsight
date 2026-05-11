import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const revalidate = 86400; // Cache the OG image for 24 hours
export const alt = 'SpendSight AI Report';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  let tool = "AI Stack";
  let yearlySavings = 0;
  let score = 85;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from('reports')
      .select('tool, monthly_savings, score')
      .eq('id', resolvedParams.id)
      .single();

    if (data) {
      tool = data.tool;
      yearlySavings = data.monthly_savings * 12;
      score = data.score;
    }
  }

  // Return the dynamically generated image
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050505',
          backgroundImage: 'radial-gradient(circle at 50% -20%, #3b0764 0%, #050505 80%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 60, left: 80 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              marginRight: 16,
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            SpendSight AI
          </span>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 32, color: '#a855f7', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Optimization Audit
            </span>
            <div style={{ marginLeft: 24, padding: '8px 24px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 40, border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', fontSize: 24, fontWeight: 500 }}>
              Score: {score}/100
            </div>
          </div>
          
          <h1 style={{ fontSize: 80, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 40px', color: '#ffffff' }}>
            {tool} Infrastructure
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, color: '#a3a3a3', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Projected Yearly Savings
            </span>
            <span style={{ fontSize: 110, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.05em', lineHeight: 1 }}>
              ${yearlySavings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* URL Footer */}
        <div style={{ display: 'flex', position: 'absolute', bottom: 60, right: 80, color: '#525252', fontSize: 24, fontWeight: 600, letterSpacing: '0.02em' }}>
          spendsight.ai/report/{resolvedParams.id}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
