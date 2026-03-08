import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // We'll create this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INTEGRA - International Journal of Advanced Research and Studies",
  description: "Ilmiy tadqiqotlar va ilg‘ar izlanishlar xalqaro jurnali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-brand-navy text-white py-10">
          <div className="container mx-auto px-4 text-center">
            <img src="/logo.png" alt="INTEGRA" className="w-14 h-14 object-contain mx-auto mb-3 opacity-90" />
            <p className="font-semibold tracking-wide">INTEGRA: International Journal of Advanced Research and Studies</p>
            <p className="text-brand-mist text-sm mt-1">ISSN 1234-5678 | DOI: 10.56789/integra</p>
            <p className="text-brand-mist text-xs mt-4">© 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}