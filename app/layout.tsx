import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theraria — NutriSync AI",
  description: "A gentle, demo-first companion for nutrition, movement, and daily routines.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/theraria-logo.png", apple: "/theraria-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#1f4638",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
