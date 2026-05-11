import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define the database type for the reports table
export interface DbReport {
  id: string;
  created_at: string;
  tool: string;
  plan: string;
  spend: number;
  seats: number;
  use_case: string;
  monthly_savings: number;
  score: number;
  recommendations: any; // JSON
}
