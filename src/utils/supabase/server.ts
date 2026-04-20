import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

type CookieStore = {
  getAll: () => { name: string; value: string }[];
  set?: (name: string, value: string, options?: Record<string, unknown>) => void;
};

export const createClient = (cookieStore?: CookieStore) =>
  {
    const { url, key } = getSupabaseEnv();

    return createServerClient(url, key, {
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
  };
