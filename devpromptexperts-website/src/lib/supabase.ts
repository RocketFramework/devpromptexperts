import { createClient } from '@supabase/supabase-js'
// import { config } from 'dotenv'; - only needed when GENERATING code
// config({ path: '.env.local' });
const supabaseUrl =
  typeof window === 'undefined'
    ? process.env.SUPABASE_URL        // Node scripts & server-side
    : process.env.NEXT_PUBLIC_SUPABASE_URL // Front-end

const supabaseAnonKey =
  typeof window === 'undefined'
    ? process.env.SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Supabase environment variables missing.
supabaseUrl: ${supabaseUrl}
supabaseAnonKey: ${supabaseAnonKey}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
