import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-display' });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: '--font-body' });

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
      <body className={`${playfair.variable} ${sourceSans.variable}`}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              {/* Logo — text based, no broken image */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800, color: '#fff',
                  fontFamily: 'Georgia, serif',
                }}>
                  I
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '0.05em', fontFamily: 'Georgia, serif' }}>
                    INTEGRA
                  </div>
                  <div style={{ fontSize: '10px', color: '#8B9DC3', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                    International Journal
                  </div>
                </div>
              </div>

              <div style={{ width: '40px', height: '1px', background: 'rgba(139,157,195,0.3)' }} />

              <p style={{ fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', maxWidth: '480px', lineHeight: 1.5 }}>
                INTEGRA: International Journal of Advanced Research and Studies
              </p>
              <p style={{ color: '#8B9DC3', fontSize: '13px', fontFamily: 'sans-serif' }}>
                ISSN 1234-5678 &nbsp;|&nbsp; DOI: 10.56789/integra
              </p>
              <p style={{ color: 'rgba(139,157,195,0.5)', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '8px' }}>
                © 2026 INTEGRA PRESS PUBLISHER. Barcha huquqlar himoyalangan.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
