import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSMANGAZİ AR-GE 360 — Dijital Yönetim Portalı",
  description: "Osmangazi Belediyesi Araştırma ve Geliştirme Müdürlüğü Proje, Fon ve İş Birliği Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased bg-[#F7F9F8] text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
