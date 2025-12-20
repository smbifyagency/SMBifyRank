// Supabase Client Configuration
import { createBrowserClient } from '@supabase/ssr';

// Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client for browser/client-side usage
export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
