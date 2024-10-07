import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CHROMASPEC",
  description: "Design system color editor based on the LCH Color Space",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="mx-auto max-w-[2048px] p-8 pt-4">
          <Suspense>
            <SiteHeader />
          </Suspense>
          {children}
        </main>
      </body>
    </html>
  );
}
