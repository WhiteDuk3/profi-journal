"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
  );
}