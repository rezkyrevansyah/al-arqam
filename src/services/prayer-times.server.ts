import "server-only";

export interface PrayerTimesData {
  locationLabel: string;
  areaLabel: string;
  sourceLocation: string;
  sourceRegion: string;
  gregorianDate: string;
  hijriDate: string;
  timezone: string;
  schedules: {
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  };
}

const MYQURAN_BASE_URL = "https://api.myquran.com/v2";
const BEKASI_CITY_ID = "1221";
const AREA_LABEL = "Harapan Jaya, Bekasi Utara";
const TIMEZONE = "Asia/Jakarta";

function getJakartaDateString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

export async function getTodayPrayerTimes(): Promise<PrayerTimesData | null> {
  const today = getJakartaDateString();

  try {
    const [prayerResponse, hijriResponse] = await Promise.all([
      fetch(`${MYQURAN_BASE_URL}/sholat/jadwal/${BEKASI_CITY_ID}/${today}`, {
        next: { revalidate: 1800 },
      }),
      fetch(`${MYQURAN_BASE_URL}/cal/hijr/${today}`, {
        next: { revalidate: 21600 },
      }),
    ]);

    if (!prayerResponse.ok) {
      throw new Error(`Prayer schedule request failed with ${prayerResponse.status}`);
    }

    const prayerJson = (await prayerResponse.json()) as {
      status: boolean;
      data?: {
        lokasi: string;
        daerah: string;
        jadwal: {
          tanggal: string;
          imsak: string;
          subuh: string;
          terbit: string;
          dhuha: string;
          dzuhur: string;
          ashar: string;
          maghrib: string;
          isya: string;
        };
      };
    };

    if (!prayerJson.status || !prayerJson.data) {
      throw new Error("Prayer schedule payload is invalid.");
    }

    let hijriDate = "Tanggal hijriah belum tersedia";

    if (hijriResponse.ok) {
      const hijriJson = (await hijriResponse.json()) as {
        status: boolean;
        data?: {
          date?: string[];
        };
      };

      if (hijriJson.status && hijriJson.data?.date?.[1]) {
        hijriDate = hijriJson.data.date[1];
      }
    }

    return {
      locationLabel: AREA_LABEL,
      areaLabel: "Kota Bekasi, Jawa Barat",
      sourceLocation: prayerJson.data.lokasi,
      sourceRegion: prayerJson.data.daerah,
      gregorianDate: prayerJson.data.jadwal.tanggal,
      hijriDate,
      timezone: TIMEZONE,
      schedules: {
        imsak: prayerJson.data.jadwal.imsak,
        subuh: prayerJson.data.jadwal.subuh,
        terbit: prayerJson.data.jadwal.terbit,
        dhuha: prayerJson.data.jadwal.dhuha,
        dzuhur: prayerJson.data.jadwal.dzuhur,
        ashar: prayerJson.data.jadwal.ashar,
        maghrib: prayerJson.data.jadwal.maghrib,
        isya: prayerJson.data.jadwal.isya,
      },
    };
  } catch (error) {
    console.error("Failed to load prayer times", error);
    return null;
  }
}
