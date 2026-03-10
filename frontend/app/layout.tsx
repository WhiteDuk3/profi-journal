import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INTEGRA - International Journal of Advanced Research and Studies",
  description: "Ilmiy tadqiqotlar va ilg'ar izlanishlar xalqaro jurnali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
        <footer style={{
          background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)',
          color: 'white',
          padding: '48px 0 32px',
        }}>
          <div className="container mx-auto px-4">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              {/* Logo — white filter for dark background */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <img
                  src="/logo.png"
                  alt="INTEGRA"
                  style={{
                    width: '36px', height: '36px', objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.9,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.1em', fontFamily: 'Georgia, serif' }}>
                    INTEGRA
                  </div>
                  <div style={{ fontSize: '9px', color: '#8B9DC3', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                    International Journal
                  </div>
                </div>
              </div>

              <div style={{ width: '32px', height: '1px', background: 'rgba(139,157,195,0.3)', margin: '4px 0' }} />

              <p style={{ fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: 'sans-serif', maxWidth: '480px', lineHeight: 1.5 }}>
                INTEGRA: International Journal of Advanced Research and Studies
              </p>
              <p style={{ color: '#8B9DC3', fontSize: '12px', fontFamily: 'sans-serif' }}>
                ISSN 1234-5678 &nbsp;|&nbsp; DOI: 10.56789/integra
              </p>
              <p style={{ color: 'rgba(139,157,195,0.45)', fontSize: '11px', fontFamily: 'sans-serif', marginTop: '8px' }}>
                © 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
