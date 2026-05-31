import type { Metadata } from "next";
import { Heebo, Inter } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-heebo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "נועם ורדי | AI · Innovation · Future",
  description:
    "נועם ורדי — בניית אתרים ופתרונות דיגיטליים חכמים עם בינה מלאכותית, ומרכז נכסים אישי לניהול ההשקעות שלך.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 58 36'%3E%3Cpath d='M4 34 L4 3 L22 34 L22 3' stroke='%230a0a0a' stroke-width='3.4' fill='none'/%3E%3Cpath d='M32 3 L43 34 L54 3' stroke='%230a0a0a' stroke-width='3.4' fill='none'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
