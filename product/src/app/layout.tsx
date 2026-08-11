import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_PRODUCT_NAME || "AI Munim"} — Business assistant`,
  description: "Create GST-ready invoices, collect payments, and track receivables.",
  applicationName: process.env.NEXT_PUBLIC_PRODUCT_NAME || "AI Munim",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#153c33", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
