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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="INTEGRA logo"
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold tracking-widest text-brand-navy">
                INTEGRA
              </span>
              <span className="hidden md:block text-[9px] text-gray-400 tracking-wide uppercase">
                International Journal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
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
            className="md:hidden p-2 text-gray-600 hover:text-brand-navy"
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
