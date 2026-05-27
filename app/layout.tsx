import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Jost } from "next/font/google";
import ScrollReveal from "@/components/ScrollReveal";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLOOM — Wedding Invitation Websites",
  description: "Beautiful, personalized wedding invitation websites by BLOOM Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${cormorant.variable} ${jost.variable}`}>
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
