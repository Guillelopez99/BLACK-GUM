import "./globals.css";
import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FaqChatWidget from "@/components/FaqChatWidget";
import MarqueeTicker from "@/components/MarqueeTicker";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap"
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Black Gum Studio | Producción y Alquiler",
    template: "%s | Black Gum"
  },
  description:
    "Black Gum es un estudio premium de producción que crea campañas cinematográficas, ofrece alquiler de equipos y desarrolla soluciones creativas para marcas ambiciosas.",
  keywords:
    "estudio de producción, producción audiovisual, alquiler de equipos, servicios creativos, Madrid",
  metadataBase: new URL("https://blackgum.studio"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://blackgum.studio",
    siteName: "Black Gum Studio",
    title: "Black Gum Studio | Producción y Alquiler",
    description:
      "Estudio premium de producción para campañas cinematográficas y alquiler de equipos.",
    images: [
      {
        url: "https://blackgum.studio/og-image.png",
        width: 1200,
        height: 630,
        alt: "Black Gum Studio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Gum Studio",
    description: "Producción premium y servicios creativos"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0b" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="relative bg-gradient-to-b from-ink via-[#0f0f0f] to-[#1a1a1a]">
        <div className="min-h-screen flex flex-col">
          <MarqueeTicker
            speedSeconds={70}
            items={[
              "AFTER EFFECTS",
              "PREMIERE PRO",
              "DAVINCI RESOLVE",
              "BLENDER",
              "CINEMA 4D",
              "MOTION DESIGN",
              "VIDEO EDITING",
              "COLOR GRADING",
              "SOUND DESIGN",
              "AI AUTOMATION",
              "GEN-IMAGE",
              "GEN-VIDEO",
              "PROMPT ENGINEERING",
              "SOCIAL ADS",
              "UGC EDITS",
              "BRAND FILMS",
              "PRODUCT LAUNCHES",
              "48H TURNAROUND",
              "ON-SET CREW"
            ]}
          />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <FaqChatWidget />
      </body>
    </html>
  );
}
