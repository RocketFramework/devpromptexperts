// Add NEW file: lib/supabase/client-browser.ts (for auth/fix)
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Use this ONLY for uploadProof and auth-sensitive operations
export const supabaseBrowser = createBrowserSupabaseClient()