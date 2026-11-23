import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OROX — Luxury Phone Editions",
  description:
    "India's premier luxury house for handcrafted 24K gold and rose gold magnetic smartphone backplates, lab-grown diamonds, and precious gems. Limited bespoke editions.",
  keywords: [
    "OROX",
    "luxury iPhone editions",
    "gold iPhone backplate",
    "caviar phone India",
    "custom luxury mobile case",
    "lab grown diamond smartphone",
    "bespoke gold smartphone",
  ],
  metadataBase: new URL("https://orox.in"),
  openGraph: {
    title: "OROX — Luxury Phone Editions",
    description:
      "Handcrafted in 24K gold, rose gold, lab-grown diamonds, and precious gems. Limited bespoke editions with white-glove handover.",
    url: "https://orox.in",
    siteName: "OROX",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#FFFFFF", color: "#0D0D0D" }}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster 
              position="top-center" 
              reverseOrder={false}
              toastOptions={{
                style: {
                  borderRadius: '0px',
                  background: '#080808',
                  color: '#FFFFFF',
                  border: '1px solid #C5A059',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  fontFamily: 'var(--font-inter), sans-serif',
                },
                success: {
                  icon: null,
                },
                error: {
                  icon: null,
                },
                icon: null,
              }} 
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
