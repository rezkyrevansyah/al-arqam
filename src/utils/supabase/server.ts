import { createServerClient } from "@supabase/ssr";

type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set?: (name: string, value: string, options?: Record<string, unknown>) => void;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not configured.");
}

export const createClient = (cookieStore?: CookieStore) =>
  createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll() ?? [];
      },
      setAll(cookiesToSet) {
        if (!cookieStore?.set) return;

        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set?.(name, value, options as Record<string, unknown>);
          });
        } catch {
          // Ignore cookie writes from Server Components.
        }
      },
    },
  });
