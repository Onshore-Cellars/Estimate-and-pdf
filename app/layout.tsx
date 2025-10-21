import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wine & Spirits Catalog Generator",
  description: "Professional PDF catalog generator for wine and spirits products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
