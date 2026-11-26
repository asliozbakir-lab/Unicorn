import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OSMANGAZİ AR-GE 360 — Dijital Yönetim Portalı",
  description:
    "Osmangazi Belediyesi Araştırma ve Geliştirme Müdürlüğü Proje, Fon ve İş Birliği Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${plusJakarta.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased bg-[#F5F7F6] text-[#14201B]">
        {children}
      </body>
    </html>
  );
}
