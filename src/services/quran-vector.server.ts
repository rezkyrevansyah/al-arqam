import "server-only";

import type { VectorResultItem } from "@/types/chat";

const EQURAN_VECTOR_API = "https://equran.id/api/vector";
const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_MAX_ENTRIES = 200;
const FETCH_TIMEOUT_MS = 6000;

interface CacheEntry {
  timestamp: number;
  results: VectorResultItem[];
}

const vectorCache = new Map<string, CacheEntry>();

function setCached(key: string, results: VectorResultItem[]) {
  if (vectorCache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = vectorCache.keys().next().value;
    if (oldestKey !== undefined) vectorCache.delete(oldestKey);
  }
  vectorCache.set(key, { timestamp: Date.now(), results });
}

/**
 * Semantic search over Qur'an ayat/tafsir/doa/surat via the public equran.id
 * vector API. Bounded, TTL'd cache since this project owns no vector index
 * of its own — equran.id documents a 30 req/min per-IP limit.
 */
export async function searchQuranVector(
  query: string,
  options?: { limit?: number; types?: Array<"ayat" | "tafsir" | "doa" | "surat">; minScore?: number }
): Promise<VectorResultItem[]> {
  const cacheKey = query.toLowerCase().trim();
  const cached = vectorCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(EQURAN_VECTOR_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cari: query,
        batas: options?.limit ?? 4,
        tipe: options?.types ?? ["ayat", "tafsir", "doa", "surat"],
        skorMin: options?.minScore ?? 0.42,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const json = await res.json();
    if (json.status === "sukses" && Array.isArray(json.hasil)) {
      const results = json.hasil as VectorResultItem[];
      setCached(cacheKey, results);
      return results;
    }
    return [];
  } catch (err) {
    console.warn("Quran vector search failed:", err);
    return [];
  }
}
