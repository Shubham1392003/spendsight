import { supabase } from '@/lib/supabase';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // Cache reports for 24 hours

// Next.js 15 App Router param types
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://spendsight.ai';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      title: 'SpendSight AI - Audit Report',
    };
  }

  const { data } = await supabase
    .from('reports')
    .select('tool, monthly_savings, score')
    .eq('id', resolvedParams.id)
    .single();

  if (!data) return { title: 'Report Not Found | SpendSight AI' };

  const yearlySavings = data.monthly_savings * 12;

  return {
    title: `AI Audit: Saved $${yearlySavings.toLocaleString()}/yr on ${data.tool} | SpendSight AI`,
    description: `We optimized the AI infrastructure for ${data.tool} and achieved an optimization score of ${data.score}/100. View the full technical breakdown.`,
    openGraph: {
      title: `AI Audit: Saved $${yearlySavings.toLocaleString()}/yr on ${data.tool}`,
      description: `We optimized the AI infrastructure for ${data.tool} and achieved an optimization score of ${data.score}/100. View the full technical breakdown.`,
      url: `${url}/report/${resolvedParams.id}`,
      siteName: 'SpendSight AI',
      images: [
        {
          url: `${url}/report/${resolvedParams.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'SpendSight AI Audit Report',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Audit: Saved $${yearlySavings.toLocaleString()}/yr on ${data.tool}`,
      description: `We optimized the AI infrastructure for ${data.tool} and achieved an optimization score of ${data.score}/100. View the full technical breakdown.`,
      images: [`${url}/report/${resolvedParams.id}/opengraph-image`],
      creator: '@spendsight',
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const resolvedParams = await params;
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Supabase Not Configured</h1>
            <p className="text-white/50">Cannot fetch report without database connection.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const formData = {
    tool: data.tool,
    plan: data.plan,
    spend: data.spend,
    seats: data.seats,
    useCase: data.use_case,
  };

  const result = {
    id: data.id,
    monthlySavings: data.monthly_savings,
    yearlySavings: data.monthly_savings * 12,
    score: data.score,
    recommendations: data.recommendations,
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-16 container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-white/80">Public Audit Report</span>
          </div>
        </div>
        <ResultsDashboard 
          data={formData} 
          result={result} 
          onReset={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/#audit';
            }
          }} 
        />
      </div>
      <Footer />
    </main>
  );
}
