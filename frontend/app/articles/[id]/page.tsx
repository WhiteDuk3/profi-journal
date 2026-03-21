export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Journal {
  id: number; name: string; issn: string; description: string;
  access_type: 'open' | 'closed'; article_count: number; cover_image: string | null;
}
interface Article {
  id: number; title: string;
  authors_detail?: { name: string }[];
  published_date: string; category: string;
}

async function getJournal(id: string): Promise<Journal | null> {
  try {
    const res = await fetch(`${API}/api/journals/${id}/`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getJournalArticles(id: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?journal=${id}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [journal, articles] = await Promise.all([getJournal(id), getJournalArticles(id)]);
  if (!journal) notFound();

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '40px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8">
          <Link href="/journals" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B9DC3', textDecoration: 'none', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '24px' }}>
            <ArrowLeft size={14} /> Barcha jurnallar
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {journal.cover_image ? (
              <img src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                alt={journal.name} style={{ width: '100px', height: '132px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '100px', height: '132px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={32} color="#8B9DC3" />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontFamily: 'sans-serif', marginBottom: '12px', display: 'inline-block',
                background: journal.access_type === 'open' ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.1)',
                color: journal.access_type === 'open' ? '#34d399' : '#8B9DC3' }}>
                {journal.access_type === 'open' ? 'Ochiq kirish' : 'Yopiq kirish'}
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
                {journal.name}
              </h1>
              {journal.issn && (
                <p style={{ color: '#8B9DC3', fontFamily: 'monospace', fontSize: '13px', marginBottom: '8px' }}>ISSN: {journal.issn}</p>
              )}
              <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', fontSize: '14px', lineHeight: 1.6, maxWidth: '600px' }}>
                {journal.description}
              </p>
              <p style={{ color: '#8B9DC3', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '10px' }}>
                {journal.article_count} ta maqola nashr etilgan
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>
          Jurnal maqolalari
        </h2>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontFamily: 'sans-serif', background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf3' }}>
            <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            <p>Bu jurnalda hali maqolalar yo&apos;q.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`}
                style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', textDecoration: 'none', border: '1px solid #e8ecf3', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{article.title}</h3>
                  <p style={{ fontSize: '13px', color: '#3D5A8A', fontFamily: 'sans-serif' }}>
                    {article.authors_detail?.map(a => a.name).join(', ')}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {article.category && (
                    <span style={{ fontSize: '11px', background: '#EEF1F7', color: '#3D5A8A', padding: '2px 10px', borderRadius: '100px', fontFamily: 'sans-serif', display: 'block', marginBottom: '4px' }}>
                      {article.category}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                    {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
