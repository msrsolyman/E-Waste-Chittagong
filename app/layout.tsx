import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anek_Bangla } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontBengali = Anek_Bangla({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E-Waste Chittagong | Sustainable Electronics Recycling & B2B Recovery",
    template: "%s | E-Waste Chittagong",
  },
  description:
    "E-Waste Chittagong provides ethical, international-standard electronic scrap aggregation, PCB sorting, and material recovery solutions based in Chittagong, Bangladesh.",
  keywords: [
    "E-Waste Chittagong",
    "Electronics Recycling Bangladesh",
    "Printed Circuit Board Scrap",
    "B2B E-Waste Exporter",
    "PCB Scrap Chittagong",
    "Chittagong Port Scrap Metal",
  ],
  authors: [{ name: "E-Waste Chittagong" }],
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontBengali.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
