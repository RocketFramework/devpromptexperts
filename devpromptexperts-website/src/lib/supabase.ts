// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Supabase environment variables missing.
supabaseUrl: ${supabaseUrl}
supabaseAnonKey: ${supabaseAnonKey}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
