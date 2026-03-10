"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",         label: "Bosh sahifa" },
  { href: "/journals", label: "Jurnallar" },
  { href: "/articles", label: "Maqolalar" },
  { href: "/authors",  label: "Mualliflar" },
  { href: "/about",    label: "Jurnal haqida" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo — large and prominent */}
          <Link href="/" className="flex items-center gap-4 flex-1">
            <img
              src="/logo.png"
              alt="INTEGRA logo"
              style={{ width: '52px', height: '52px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div className="flex flex-col leading-tight">
              <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '0.12em', color: '#1C2B4A', fontFamily: 'Georgia, serif' }}>
                INTEGRA
              </span>
              <span style={{ fontSize: 'clamp(8px, 1.5vw, 11px)', color: '#8B9DC3', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                International Journal of Advanced Research and Studies
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-navy hover:text-brand-steel transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              className="bg-brand-navy text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-mid transition"
            >
              Maqola topshirish
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-brand-navy flex-shrink-0"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-brand-navy hover:bg-brand-bg rounded-lg text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="block mx-4 mt-2 text-center bg-brand-navy text-white px-4 py-2 rounded-lg text-sm"
            >
              Maqola topshirish
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
