import { createClient } from '@supabase/supabase-js'

// Strip any embedded newlines from env vars (common issue with copy-paste)
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/[\n\r]/g, '')
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/[\n\r]/g, '')

// Using 'any' for flexibility - types are defined in database.types.ts for reference
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role for admin operations
export function createServerClient() {
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/[\n\r]/g, '')
  return createClient(supabaseUrl, supabaseServiceKey)
}

