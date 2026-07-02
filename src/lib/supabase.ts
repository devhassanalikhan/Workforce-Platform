import { createClient } from '@supabase/supabase-js'
import type { AppRole } from '@/lib/rbac'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Shape stored in Supabase user_metadata
export interface UserMetadata {
  full_name: string
  role: AppRole
  // Only present on employer signups — read by the handle_new_employer()
  // Postgres trigger to name the company row it creates.
  company_name?: string
}
