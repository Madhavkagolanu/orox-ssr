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
  title: "OROX - Premium Fashion & Lifestyle",
  description:
    "Discover curated fashion, jewellery, home decor and more at OROX. Authentic products delivered to your doorstep.",
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
