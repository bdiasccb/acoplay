import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "AcoPlay", template: "%s · AcoPlay" },
  description: "Encontre filmes e séries, veja trailers e descubra onde assistir.",
};

export const viewport: Viewport = {
  themeColor: "#1a0f24",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
