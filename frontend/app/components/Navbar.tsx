"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Upload } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/",         label: "Bosh sahifa"   },
  { href: "/journals", label: "Jurnallar"     },
  { href: "/articles", label: "Maqolalar"     },
  { href: "/authors",  label: "Mualliflar"    },
  { href: "/about",    label: "Jurnal haqida" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const pathname = usePathname();

  // Only homepage gets the transparent-on-top treatment.
  // All other pages start with the frosted background immediately
  // because they don't have a full-bleed dark hero behind them.
  const isHome = pathname === "/";

  // After mount we can read scroll position safely (SSR-safe)
  useEffect(() => {
    setMounted(true);

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Check initial position (e.g. user refreshed halfway down the page)
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent only when: we're on the homepage AND haven't scrolled yet
  const isTransparent = isHome && !scrolled;

  // Close mobile menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        /* ── NAV BASE ── */
        .integra-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 500;
          transition:
            background   0.7s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            backdrop-filter 0.7s ease;
          border-bottom: 0.5px solid transparent;
        }

        /* Transparent state — floats over the hero */
        .integra-nav.transparent {
          background: transparent;
          border-color: transparent;
          backdrop-filter: none;
        }

        /* Frosted state — appears on scroll or non-home pages */
        .integra-nav.frosted {
          background: rgba(6, 10, 20, 0.78);
          border-color: rgba(139, 157, 195, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* ── INNER LAYOUT ── */
        .nav-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 52px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* ── BRAND ── */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
          /* Entrance animation — slides down from above */
          animation: navFadeDown 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .nav-logo {
          width: 40px; height: 40px;
          object-fit: contain;
          /* White on dark hero; switch to navy when frosted over light content */
          filter: brightness(0) invert(1);
          opacity: 0.88;
          transition: filter 0.6s ease, opacity 0.6s ease;
          flex-shrink: 0;
        }
        /* On non-home pages the nav is always frosted so logo stays white —
           this is correct because the page background is always dark. */
        .nav-wordmark {
          font-family: sans-serif;
          font-size: 12px;
          letter-spacing: 0.22em;
          color: #8B9DC3;
          text-transform: uppercase;
          line-height: 1;
          transition: color 0.5s;
        }
        .nav-sub {
          font-family: sans-serif;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #3a4a6a;
          margin-top: 3px;
          transition: color 0.5s;
          /* Hide on very small screens */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 280px;
        }

        /* ── DESKTOP LINKS ── */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          animation: navFadeDown 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        .nav-link {
          font-family: sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #4a5e82;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s;
          position: relative;
          padding-bottom: 2px;
        }
        /* Underline on active route */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 0.5px;
          background: rgba(139, 157, 195, 0.6);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-link:hover        { color: #a8b8d8; }
        .nav-link.active       { color: #8B9DC3; }
        .nav-link.active::after { transform: scaleX(1); }

        /* ── SUBMIT BUTTON ── */
        .nav-submit {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          background: rgba(28, 43, 74, 0.7);
          border: 0.5px solid rgba(139, 157, 195, 0.25);
          color: #c8d8f0;
          font-family: sans-serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 1px;
          transition: all 0.35s;
          white-space: nowrap;
          flex-shrink: 0;
          animation: navFadeDown 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }
        .nav-submit:hover {
          background: rgba(45, 66, 112, 0.9);
          border-color: rgba(139, 157, 195, 0.5);
          color: #eaf0ff;
          box-shadow: 0 0 20px rgba(61, 90, 138, 0.3);
        }

        /* ── MOBILE TOGGLE ── */
        .nav-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #4a5e82;
          padding: 4px;
          transition: color 0.3s;
          flex-shrink: 0;
        }
        .nav-toggle:hover { color: #8B9DC3; }

        /* ── MOBILE DRAWER ── */
        .nav-drawer {
          position: fixed;
          inset: 0;
          z-index: 499;
          display: flex;
          flex-direction: column;
          /* Slides in from the right */
          transform: translateX(100%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(6, 10, 20, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 100px 52px 52px;
          border-left: 0.5px solid rgba(139, 157, 195, 0.1);
          overflow-y: auto;
        }
        .nav-drawer.open {
          transform: translateX(0);
        }
        .drawer-link {
          display: block;
          font-family: Georgia, serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 400;
          color: #3a4e6a;
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 0.5px solid rgba(139, 157, 195, 0.07);
          letter-spacing: -0.01em;
          transition: color 0.3s;
          /* Stagger entrance */
          opacity: 0;
          transform: translateX(20px);
          transition: color 0.3s, opacity 0.5s, transform 0.5s;
        }
        .nav-drawer.open .drawer-link {
          opacity: 1;
          transform: translateX(0);
        }
        /* Each link gets a slightly longer delay so they cascade in */
        .nav-drawer.open .drawer-link:nth-child(1) { transition-delay: 0.05s; }
        .nav-drawer.open .drawer-link:nth-child(2) { transition-delay: 0.1s;  }
        .nav-drawer.open .drawer-link:nth-child(3) { transition-delay: 0.15s; }
        .nav-drawer.open .drawer-link:nth-child(4) { transition-delay: 0.2s;  }
        .nav-drawer.open .drawer-link:nth-child(5) { transition-delay: 0.25s; }
        .drawer-link:hover  { color: #8B9DC3; }
        .drawer-link.active { color: #c8d8f0; }

        .drawer-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
          padding: 14px 32px;
          background: rgba(28, 43, 74, 0.8);
          border: 0.5px solid rgba(139, 157, 195, 0.25);
          color: #c8d8f0;
          font-family: sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 1px;
          opacity: 0;
          transition: opacity 0.5s 0.3s, background 0.3s, border-color 0.3s;
          align-self: flex-start;
        }
        .nav-drawer.open .drawer-submit {
          opacity: 1;
        }
        .drawer-submit:hover {
          background: rgba(45, 66, 112, 0.9);
          border-color: rgba(139, 157, 195, 0.5);
        }

        /* ── RESPONSIVE BREAKPOINTS ── */
        @media (max-width: 900px) {
          .nav-links,
          .nav-submit { display: none; }
          .nav-toggle  { display: flex; }
          .nav-sub     { display: none; }
          .nav-inner   { padding: 0 24px; }
        }
        @media (max-width: 640px) {
          .nav-drawer  { padding: 90px 32px 40px; }
        }

        /* ── ENTRANCE ANIMATION ── */
        @keyframes navFadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0);      }
        }
      `}</style>

      {/* ── NAV BAR ─────────────────────────────────────── */}
      <nav className={`integra-nav ${isTransparent ? "transparent" : "frosted"}`}>
        <div className="nav-inner">

          {/* Brand */}
          <Link href="/" className="nav-brand">
            <img src="/logo.png" alt="INTEGRA" className="nav-logo" />
            <div>
              <div className="nav-wordmark">INTEGRA</div>
              <div className="nav-sub">International Journal of Advanced Research and Studies</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop submit CTA */}
          <Link href="/submit" className="nav-submit">
            <Upload size={12} />
            Maqola topshirish
          </Link>

          {/* Mobile toggle — only visible below 900px */}
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────────────── */}
      {/*
        The drawer slides in from the right on mobile.
        It's always in the DOM (not conditional) so the
        CSS transition can animate both open and close.
      */}
      <div className={`nav-drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`drawer-link ${pathname === link.href ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/submit" className="drawer-submit" onClick={() => setMenuOpen(false)}>
          <Upload size={13} />
          Maqola topshirish
        </Link>
      </div>
    </>
  );
}
