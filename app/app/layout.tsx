import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Idetic",
  description: "Text to video semantic search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased `}>
        {/* <body className={`${inter.variable} antialiased container`}> */}
        <SonnerToaster />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
