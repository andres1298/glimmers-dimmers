import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let cached: SupabaseClient | null = null;

/**
 * Service-role client. Only ever imported from server code (data layer,
 * server actions). The key never reaches the browser bundle because no
 * client component imports this module.
 */
export function supabaseAdmin(): SupabaseClient {
  if (!cached) {
    cached = createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
      auth: { persistSession: false },
    });
  }
  return cached;
}
