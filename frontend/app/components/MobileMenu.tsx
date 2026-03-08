'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Bosh sahifa</MobileNavLink>
            <MobileNavLink href="/journals" onClick={() => setIsOpen(false)}>Jurnallar</MobileNavLink>
            <MobileNavLink href="/articles" onClick={() => setIsOpen(false)}>Maqolalar</MobileNavLink>
            <MobileNavLink href="/authors" onClick={() => setIsOpen(false)}>Mualliflar</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>Biz haqimizda</MobileNavLink>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition">
      {children}
    </Link>
  );
}