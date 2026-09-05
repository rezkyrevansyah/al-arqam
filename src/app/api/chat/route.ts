import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from "ai";
import { chatTools } from "@/services/chat-tools.server";

// The AI SDK's default Google provider looks for GOOGLE_GENERATIVE_AI_API_KEY;
// this project's convention is GEMINI_API_KEY, so wire it in explicitly.
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_MESSAGE_LENGTH = 500;
const MAX_CONTEXT_MESSAGES = 10;

// Simple in-memory fixed-window rate limiter, per client IP.
// Known limitation: resets per server instance, so it doesn't hold a hard
// limit across multiple serverless instances — acceptable at this site's
// traffic scale; revisit with a shared store (e.g. Upstash Redis) if traffic grows.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...(status === 429 ? { "Retry-After": "60" } : {}) },
  });
}

function extractText(message: UIMessage | undefined): string {
  if (!message) return "";
  return message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const SYSTEM_PROMPT = `Kamu adalah "Tanya Al-Arqam AI", asisten resmi Masjid Jami' Al-Arqam Bekasi Utara.

Aturan Utama (PENTING - Anti-Halusinasi):
- Jawab dalam Bahasa Indonesia yang sopan, hangat, dan beradab islami (salam, basmalah bila relevan).
- Untuk pertanyaan seputar masjid (jadwal sholat, agenda/kajian, donasi, rekening, lokasi, qurban, hasil lomba/event, artikel, galeri, transparansi) WAJIB SELALU panggil tool terkait. JANGAN PERNAH MENGARANG atau menebak angka rekening, nama panitia, ustadz, atau jadwal.
- Untuk pertanyaan seputar ayat Al-Qur'an, tafsir, atau doa/dzikir, SELALU gunakan tool searchQuran.
- Jawab HANYA berdasarkan data faktual yang dihasilkan oleh tools. Jika tool mengembalikan data kosong atau tidak ditemukan, sampaikan dengan jujur dan santun bahwa data tersebut belum tersedia di sistem masjid.
- Jika pertanyaan di luar topik keislaman atau masjid, tolak dengan santun dan arahkan kembali ke topik yang bisa kamu bantu.
- Jawaban ringkas, padat, jelas, dan sejuk dibaca. Tidak perlu bertele-tele.`;

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return jsonError("Afwan, terlalu banyak pertanyaan dalam waktu singkat. Mohon tunggu sesaat sebelum mencoba lagi.", 429);
  }

  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return jsonError("Afwan, permintaan tidak valid.", 400);
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonError("Afwan, silakan ketikkan pertanyaan atau topik yang ingin Anda cari.", 400);
  }

  const lastUserText = extractText(messages[messages.length - 1]);
  if (lastUserText.length > MAX_MESSAGE_LENGTH) {
    return jsonError(
      `Afwan, pertanyaan Anda terlalu panjang (maksimal ${MAX_MESSAGE_LENGTH} karakter). Mohon ringkas kembali pertanyaan Anda.`,
      400
    );
  }

  const cappedMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(cappedMessages),
    tools: chatTools,
    temperature: 0.2,
    maxOutputTokens: 800,
    // Cap multi-step tool calling at 3: enough for combined lookups while bounding latency
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("Chat streaming error:", error);
      return "Afwan, terjadi kendala saat menghubungi asisten AI. Mohon coba lagi sesaat lagi.";
    },
  });
}
