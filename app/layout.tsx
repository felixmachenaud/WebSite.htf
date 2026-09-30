import type { Metadata, Viewport } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const description = "Le parcours de votre enfant commence ici.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Collège Lycée Hautefeuille",
  description,
  openGraph: {
    title: "Collège Lycée Hautefeuille",
    description,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/logo.png", alt: "Collège Lycée Hautefeuille" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sourceSerif.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
