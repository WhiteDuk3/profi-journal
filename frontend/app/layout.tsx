import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "INTEGRA - International Journal of Advanced Research and Studies",
  description: "Ilmiy tadqiqotlar va ilg'or izlanishlar xalqaro jurnali",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body style={{ margin: 0, padding: 0, background: '#060a14' }}>
        <Navbar />
        <main>{children}</main>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        {/*
          Same #060a14 darkness as the page — the star canvas from the
          homepage is position:fixed so it shows through here too.
          On inner pages the footer sits against the plain dark background,
          which is consistent and intentional.
        */}
        <footer style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '0.5px solid rgba(139,157,195,0.1)',
          padding: '80px 52px 48px',
          color: '#dde3f0',
        }}>
          <style>{`
            .footer-inner {
              max-width: 1160px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 1.4fr 1fr 1fr;
              gap: 64px;
              padding-bottom: 56px;
              border-bottom: 0.5px solid rgba(139,157,195,0.08);
            }
            @media (max-width: 900px) {
              .footer-inner {
                grid-template-columns: 1fr 1fr;
                gap: 40px;
              }
            }
            @media (max-width: 600px) {
              .footer-inner {
                grid-template-columns: 1fr;
                gap: 36px;
              }
              footer {
                padding: 56px 24px 36px !important;
              }
            }
            .footer-nav-link {
              display: block;
              font-family: sans-serif;
              font-size: 11px;
              letter-spacing: 0.06em;
              color: #2a3a58;
              text-decoration: none;
              padding: 5px 0;
              transition: color 0.3s;
            }
            .footer-nav-link:hover { color: #8B9DC3; }

            .footer-bottom {
              max-width: 1160px;
              margin: 0 auto;
              padding-top: 28px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 24px;
              flex-wrap: wrap;
            }
          `}</style>

          <div className="footer-inner">

            {/* ── Column 1: Brand ── */}
            <div>
              {/* Logo — white filter same as navbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <img
                  src="/logo.png"
                  alt="INTEGRA"
                  style={{
                    width: 40, height: 40,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.8,
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: 'sans-serif',
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  color: '#8B9DC3',
                  textTransform: 'uppercase',
                }}>
                  INTEGRA
                </span>
              </div>

              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: 13,
                color: '#3a4e6a',
                lineHeight: 1.75,
                marginBottom: 20,
                maxWidth: 280,
              }}>
                International Journal of Advanced Research and Studies
              </p>

              {/* ISSN / DOI */}
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 10,
                letterSpacing: '0.07em',
                color: '#1e2e48',
                lineHeight: 2,
              }}>
                <div>ISSN 1234-5678</div>
                <div>DOI prefix: 10.56789/integra</div>
              </div>
            </div>

            {/* ── Column 2: Navigation ── */}
            <div>
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: '#1e2e48',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                Sahifalar
              </div>
              <nav>
                {[
                  { href: '/',         label: 'Bosh sahifa'   },
                  { href: '/journals', label: 'Jurnallar'     },
                  { href: '/articles', label: 'Maqolalar'     },
                  { href: '/authors',  label: 'Mualliflar'    },
                  { href: '/about',    label: 'Jurnal haqida' },
                  { href: '/submit',   label: 'Maqola yuborish' },
                ].map(link => (
                  <Link key={link.href} href={link.href} className="footer-nav-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ── Column 3: Contact ── */}
            <div>
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: '#1e2e48',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                Aloqa
              </div>
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 11,
                color: '#2a3a58',
                lineHeight: 2,
              }}>
                <div>editor@integra-journal.uz</div>
                <div>Toshkent, O&apos;zbekiston</div>
              </div>

              {/* Thin rule */}
              <div style={{
                width: 32, height: '0.5px',
                background: 'rgba(139,157,195,0.2)',
                margin: '24px 0',
              }} />

              {/* Social / external links placeholder — easy to add later */}
              <div style={{
                fontFamily: 'sans-serif',
                fontSize: 10,
                color: '#1e2e48',
                letterSpacing: '0.06em',
                lineHeight: 2,
              }}>
                <div>Open Access Journal</div>
                <div>Peer Reviewed</div>
              </div>
            </div>
          </div>

          {/* ── Bottom bar: copyright ── */}
          <div className="footer-bottom">
            <span style={{
              fontFamily: 'sans-serif',
              fontSize: 10,
              color: '#1e2e48',
              letterSpacing: '0.06em',
            }}>
              © 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.
            </span>
            <span style={{
              fontFamily: 'sans-serif',
              fontSize: 10,
              color: '#1e2e48',
              letterSpacing: '0.06em',
            }}>
              Powered by INTEGRA Platform
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
