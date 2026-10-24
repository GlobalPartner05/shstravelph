import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/site/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://sakurahire.ph.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sakura Hire Services | Private Airport Transfers in Luzon, Philippines",
  description:
    "Private airport transfers and point-to-point rides across NAIA, Clark, Angeles City, and other confirmed Luzon destinations. Fixed fares, real vehicles, and a booking reference before you travel.",
  openGraph: {
    title: "Sakura Hire Services | Private Airport Transfers in Luzon, Philippines",
    description:
      "Private airport transfers and point-to-point rides across NAIA, Clark, Angeles City, and other confirmed Luzon destinations.",
    url: SITE_URL,
    siteName: "Sakura Hire Services",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
