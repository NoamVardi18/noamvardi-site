import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { SD } from "@/lib/sd";
import "./globals.css";

// SharpenDaily — English LTR brand: bold geometric display + clean body.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sd-display",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sd-body",
  display: "swap",
});

// Latin serif italic — section eyebrows + one accent word in a headline.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const DESCRIPTION =
  "The full how-to behind every SharpenDaily video. Real steps, the exact prompts and tools, a short weekly newsletter. Free.";

export const metadata: Metadata = {
  metadataBase: new URL(SD.url),
  title: {
    default: "SharpenDaily — get genuinely better, daily",
    template: "%s | SharpenDaily",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "SharpenDaily",
    url: SD.url,
    title: "SharpenDaily — get genuinely better, daily",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "SharpenDaily — get genuinely better, daily",
    description: DESCRIPTION,
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2314110F'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='28' fill='%23C8862B'%3ESD%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${spaceGrotesk.variable} ${hanken.variable} ${instrument.variable} theme-sharpen`}
    >
      <body>
        <div className="atmosphere" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
