import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

export const createClient = () => {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
};
