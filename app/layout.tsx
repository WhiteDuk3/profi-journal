import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from 'lucide-react'; // Icons for hamburger and close
import MobileMenu from './components/MobileMenu';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "International Journal",
  description: "Scientific research journal",
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
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © 2026 International Journal. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

// Navbar component with mobile menu
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 text-xl font-bold text-blue-900">
            <Image 
                  src="/images/profi-logo.png" 
                  alt="Profi University" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
            Profi Ilmiy Jurnali
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex space-x-6">
            <NavLink href="/">Bosh sahifa</NavLink>
            <NavLink href="/journals">Jurnallar</NavLink>
            <NavLink href="/articles">Maqolalar</NavLink>
            <NavLink href="/authors">Mualliflar</NavLink>
            <NavLink href="/about">Biz haqimizda</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            id="menu-btn"
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
            // We'll add interactivity with a client component
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu (hidden by default) – we'll make it toggle with JavaScript */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLink href="/">Bosh sahifa</MobileNavLink>
            <MobileNavLink href="/journals">Jurnallar</MobileNavLink>
            <MobileNavLink href="/articles">Maqolalar</MobileNavLink>
            <MobileNavLink href="/authors">Mualliflar</MobileNavLink>
            <MobileNavLink href="/about">Biz haqimizda</MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Helper component for desktop nav links
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-blue-900 hover:text-blue-700 transition">
      {children}
    </Link>
  );
}

// Helper component for mobile nav links
function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition">
      {children}
    </Link>
  );
}