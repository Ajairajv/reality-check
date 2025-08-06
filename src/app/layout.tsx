import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Local font configuration with fallbacks to avoid SSL issues
const fontSans = {
  variable: "--font-geist-sans",
  className: "font-sans",
};

const fontMono = {
  variable: "--font-geist-mono", 
  className: "font-mono",
};

export const metadata: Metadata = {
  title: "Reality Check - Level Up Your Life",
  description: "Solo Leveling-style productivity tracker with RPG elements. Track tasks, exercises, and personal development with XP, stats, and gamification.",
  keywords: "productivity, RPG, solo leveling, task tracker, exercise tracker, gamification, personal development",
  authors: [{ name: "Reality Check Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased font-sans`}
        style={{
          fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        }}
      >
        {children}
      </body>
    </html>
  );
}
