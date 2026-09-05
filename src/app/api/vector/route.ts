import { NextResponse } from "next/server";

const EQURAN_VECTOR_API = "https://equran.id/api/vector";

export async function GET() {
  return NextResponse.json({
    status: "sukses",
    pesan: "API Pencarian Vektor Al-Quran Masjid Al-Arqam",
    deskripsi: "Proxy dan endpoint semantik Al-Quran terintegrasi dengan equran.id",
    penggunaan: {
      metode: "POST",
      endpoint: "/api/vector",
      body: {
        cari: "string (wajib) / query",
        batas: "number (opsional, default: 5, maks: 10) / limit",
        tipe: "array (opsional: ayat, tafsir, doa, surat) / types",
        skorMin: "number (opsional: 0-1) / minScore",
      },
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support both Indonesian & English parameter keys
    const cari = body.cari || body.query;
    const batas = body.batas || body.limit || 5;
    const tipe = body.tipe || body.types || ["ayat", "tafsir", "doa", "surat"];
    const skorMin = body.skorMin !== undefined ? body.skorMin : (body.minScore !== undefined ? body.minScore : 0.45);

    if (!cari || typeof cari !== "string" || !cari.trim()) {
      return NextResponse.json(
        {
          status: "gagal",
          pesan: "Parameter pencarian wajib diisi (cari / query)",
        },
        { status: 400 }
      );
    }

    const payload = {
      cari: cari.trim(),
      batas: Math.min(Math.max(Number(batas) || 5, 1), 10),
      tipe: Array.isArray(tipe) && tipe.length > 0 ? tipe : ["ayat", "tafsir", "doa", "surat"],
      skorMin: Number(skorMin) || 0.45,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(EQURAN_VECTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`equran.id API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Vector Search Proxy Error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses pencarian";
    return NextResponse.json(
      {
        status: "gagal",
        pesan: message,
      },
      { status: 500 }
    );
  }
}
