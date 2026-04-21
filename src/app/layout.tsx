import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Amiri } from "next/font/google"; // eslint-disable-line
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Masjid Jami' Al-Arqom",
  description: "Website Resmi Masjid Jami' Al-Arqom",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable} ${amiri.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
