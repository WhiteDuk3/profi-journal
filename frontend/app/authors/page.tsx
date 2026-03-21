import Link from 'next/link';
import { User, ArrowUpRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Author {
  id: number;
  name: string;
  affiliation: string;
  bio: string;
  profile_image: string | null;
  article_count: number;
}

async function getAuthors(): Promise<Author[]> {
  try {
    const res = await fetch(`${API}/api/authors/`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <style>{`
        .author-row {
          display: flex; gap: 16px; align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #e8ecf3;
          text-decoration: none;
          transition: background 0.15s;
        }
        .author-row:first-child { border-top: 1px solid #e8ecf3; }
        .author-row:hover { background: #F4F6FA; padding-left: 12px; padding-right: 12px; margin-left: -12px; margin-right: -12px; }
      `}</style>

      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '56px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8">
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '8px' }}>
            INTEGRA
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
            Mualliflar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', fontSize: '14px' }}>
            Jurnal mualliflari — {authors.length} ta
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        {authors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
            <User size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
            <p>Hozircha mualliflar mavjud emas.</p>
          </div>
        ) : (
          <div>
            {authors.map((author) => (
              <Link key={author.id} href={`/authors/${author.id}`} className="author-row">
                {author.profile_image ? (
                  <img
                    src={author.profile_image.startsWith('http') ? author.profile_image : `${API}${author.profile_image}`}
                    alt={author.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EEF1F7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif' }}>
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '2px' }}>
                    {author.name}
                  </h2>
                  {author.affiliation && (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif', marginBottom: '2px',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>
                      {author.affiliation}
                    </p>
                  )}
                  <p style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>
                    {author.article_count} ta maqola
                  </p>
                </div>
                <ArrowUpRight size={16} color="#8B9DC3" style={{ flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
