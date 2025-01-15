import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

const IBMPlexSans = localFont({
  variable: "--font-ibm-plex-sans",
  src: [
    {
      path: "./fonts/IBMPlexSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/IBMPlexSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/IBMPlexSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "ToutDoux",
  description: "A minimalist, design-focused todo app inspired by TeuxDeux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${IBMPlexSans.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
