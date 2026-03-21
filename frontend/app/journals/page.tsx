import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Journal {
  id: number;
  name: string;
  issn: string;
  description: string;
  access_type: 'open' | 'closed';
  article_count: number;
  cover_image: string | null;
}

async function getJournals(): Promise<Journal[]> {
  try {
    const res = await fetch(`${API}/api/journals/`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function JournalsPage() {
  const journals = await getJournals();

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <style>{`
        .journal-row {
          display: flex; gap: 20px; align-items: flex-start;
          padding: 20px 0;
          border-bottom: 1px solid #e8ecf3;
          text-decoration: none;
          transition: background 0.15s;
        }
        .journal-row:first-child { border-top: 1px solid #e8ecf3; }
        .journal-row:hover { background: #F4F6FA; padding-left: 12px; padding-right: 12px; margin-left: -12px; margin-right: -12px; }
        @media (max-width: 640px) {
          .journal-row { gap: 12px; }
          .journal-cover { width: 56px !important; height: '74px' !important; }
        }
      `}</style>

      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '56px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8">
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '8px' }}>
            INTEGRA
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
            Jurnallar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', fontSize: '14px' }}>
            Barcha nashr jurnallari — {journals.length} ta
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        {journals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
            <p>Hozircha jurnallar mavjud emas.</p>
          </div>
        ) : (
          <div>
            {journals.map((journal) => (
              <Link key={journal.id} href={`/journals/${journal.id}`} className="journal-row">
                {journal.cover_image ? (
                  <img
                    src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                    alt={journal.name}
                    className="journal-cover"
                    style={{ width: '72px', height: '96px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                  />
                ) : (
                  <div className="journal-cover" style={{ width: '72px', height: '96px', background: '#1C2B4A', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={24} color="#8B9DC3" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '11px', padding: '2px 10px', borderRadius: '100px', fontFamily: 'sans-serif',
                      background: journal.access_type === 'open' ? 'rgba(5,150,105,0.1)' : '#EEF1F7',
                      color: journal.access_type === 'open' ? '#059669' : '#3D5A8A',
                    }}>
                      {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                    </span>
                    {journal.issn && (
                      <span style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'monospace' }}>ISSN: {journal.issn}</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '4px', lineHeight: 1.3 }}>
                    {journal.name}
                  </h2>
                  {journal.description && (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif', lineHeight: 1.5, marginBottom: '6px',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {journal.description}
                    </p>
                  )}
                  <p style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>
                    {journal.article_count} ta maqola
                  </p>
                </div>
                <ArrowUpRight size={16} color="#8B9DC3" style={{ flexShrink: 0, marginTop: '4px' }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
