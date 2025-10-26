import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv';
config({ path: '.env.local' });
const supabaseUrl =
  typeof window === 'undefined'
    ? process.env.SUPABASE_URL        // Node scripts & server-side
    : process.env.NEXT_PUBLIC_SUPABASE_URL // Front-end

const supabaseKey =
  typeof window === 'undefined'
    ? process.env.SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Supabase environment variables missing.
supabaseUrl: ${supabaseUrl}
supabaseKey: ${supabaseKey}`
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
