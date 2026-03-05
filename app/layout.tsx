"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo / Journal Name */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-900">INTEGRA</span>
                <span className="hidden md:inline text-sm text-gray-600">| International Journal</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-blue-900 hover:text-blue-700 transition">Bosh sahifa</Link>
                <Link href="/journals" className="text-blue-900 hover:text-blue-700 transition">Jurnallar</Link>
                <Link href="/articles" className="text-blue-900 hover:text-blue-700 transition">Maqolalar</Link>
                <Link href="/authors" className="text-blue-900 hover:text-blue-700 transition">Mualliflar</Link>
                <Link href="/about" className="text-blue-900 hover:text-blue-700 transition">Jurnal haqida</Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
              <div className="md:hidden pb-4">
                <div className="flex flex-col space-y-2">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg">Bosh sahifa</Link>
                  <Link href="/journals" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg">Jurnallar</Link>
                  <Link href="/articles" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg">Maqolalar</Link>
                  <Link href="/authors" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg">Mualliflar</Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg">Jurnal haqida</Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p className="mb-2">INTEGRA: International Journal of Advanced Research and Studies</p>
            <p className="text-blue-200">ISSN 1234-5678 | DOI: 10.56789/integra</p>
            <p className="mt-4 text-blue-300">© 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
