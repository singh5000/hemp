import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/ui/ChatBot";
import AgeGate from "@/components/layout/AgeGate";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hemp & Barrel | Charlotte NC",
  description: "Premium CBD products — tinctures, gummies, smokables, and more. Serving Charlotte, NC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${josefinSans.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://hempandbarrel.com" />
        <link rel="dns-prefetch" href="https://hempandbarrel.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#3d2b1f] antialiased font-sans">
        <AuthProvider>
          <CartProvider>
            <AgeGate />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatBot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
