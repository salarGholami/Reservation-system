import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Form Engine",
  description: "Production-grade rule-based form system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
