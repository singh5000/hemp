import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/ui/ChatBot";
import AgeGate from "@/components/layout/AgeGate";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hemp & Barrel | Charlotte NC",
  description: "Premium THCA & CBD products — flower, gummies, tinctures, and more. Serving Charlotte, NC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://hempandbarrel.com" />
        <link rel="dns-prefetch" href="https://hempandbarrel.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#3d2b1f] antialiased font-sans">
        <NextTopLoader color="#1A9248" height={3} showSpinner={false} shadow="0 0 10px #1A9248,0 0 5px #1A9248" />
        <AuthProvider>
          <CartProvider>
            <AgeGate />
            <TopBar />
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
