import type { Metadata } from "next";
import { Heebo, Frank_Ruhl_Libre, Instrument_Serif } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-heebo",
  display: "swap",
});

const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-frank",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "נועם ורדי | סוכני AI לעסקים — AI · Innovation · Future",
  description:
    "נועם ורדי — בניית סוכני בינה מלאכותית ואוטומציות שמבצעים עבודה אמיתית בעסק: שירות לקוחות 24/7, תיאום פגישות, מעקב לידים ואוטומציית תפעול.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23070a0f'/%3E%3Cpath d='M14 45 L14 18 L28 45 L28 18' stroke='%23f2efe9' stroke-width='3.2' fill='none'/%3E%3Cpath d='M36 18 L45 45 L54 18' stroke='%23c8a96a' stroke-width='3.2' fill='none'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${frank.variable} ${instrument.variable}`}
    >
      <body>
        <div className="atmosphere" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
