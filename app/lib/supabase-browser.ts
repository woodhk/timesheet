import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// This is the client-side Supabase client
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: true,
      },
    }
  );
} 