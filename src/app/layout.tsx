import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spooky Movies Search",
  description: "Search for horror movies, powered by Algolia",
  openGraph: {
    images: ["og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
