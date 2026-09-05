import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Amiri } from "next/font/google"; // eslint-disable-line
import "./globals.css";
import { ChatWidget } from "@/components/chat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const SITE_URL = "https://www.alarqambekasiutara.com";
const SITE_NAME = "Masjid Jami' Al-Arqam Bekasi Utara";
const SITE_DESCRIPTION =
  "Website Resmi Masjid Jami' Al-Arqam Bekasi Utara. Pusat kegiatan ibadah, dakwah, dan sosial di Bekasi Utara. Informasi jadwal sholat, agenda kegiatan, artikel islami, galeri, dan donasi.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "masjid al arqam",
    "masjid al-arqam",
    "masjid al arqam bekasi utara",
    "masjid bekasi utara",
    "masjid jami al arqam",
    "masjid jami' al-arqam",
    "masjid di bekasi utara",
    "masjid bekasi",
    "jadwal sholat bekasi utara",
    "kegiatan masjid bekasi utara",
    "donasi masjid bekasi",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  verification: {
    google: "HFWiEi0BGo8jwD3A0QbHvo86xWIWus6xX9g9X1Ydq7w",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Mosque",
      "@id": `${SITE_URL}/#mosque`,
      name: "Masjid Jami' Al-Arqam Bekasi Utara",
      alternateName: [
        "Masjid Al-Arqam",
        "Masjid Al Arqam Bekasi Utara",
        "Masjid Al Arqam",
      ],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Jl. Pesona Anggrek Harapan Blk. F17 No.1, RT.006/RW.024",
        addressLocality: "Bekasi Utara",
        addressRegion: "Jawa Barat",
        postalCode: "17124",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -6.213592614450634,
        longitude: 106.9996147527557,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Masjid Jami' Al-Arqam Bekasi Utara",
      publisher: { "@id": `${SITE_URL}/#mosque` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable} ${amiri.variable}`}>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
