import { createClient } from '@supabase/supabase-js'

// ⚠️ SERVER-ONLY. Never import this file from a "use client" component --
// it uses the service_role key, which bypasses Row Level Security entirely.
// Only call it from API route handlers (app/api/**/route.ts).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
