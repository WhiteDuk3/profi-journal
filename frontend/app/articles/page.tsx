import Link from 'next/link';
import { FileText, ArrowUpRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Article {
  id: number;
  title: string;
  abstract: string;
  authors_detail?: { id?: number; name: string }[];
  published_date: string;
  category: string;
  cover_image_url?: string;
  journal_name?: string;
  journal_id?: number;
  views?: number;
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
      <style>{`
        .article-row {
          display: flex; gap: 20px; background: #fff;
          border-radius: 12px; padding: 24px;
          border: 1px solid #e8ecf3; text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .article-row:hover { border-color: #8B9DC3; box-shadow: 0 4px 20px rgba(28,43,74,0.08); }
        @media (max-width: 640px) {
          .article-row { padding: 16px; gap: 12px; }
          .article-row img, .article-thumb { width: 64px !important; height: 64px !important; }
        }
      `}</style>

      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '56px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8">
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '8px' }}>
            INTEGRA
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
            Maqolalar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', fontSize: '14px' }}>
            Barcha nashr etilgan ilmiy maqolalar — {articles.length} ta
          </p>
        </div>
      </section>

      {/* List */}
      <div className="container mx-auto px-4 md:px-8" style={{ padding: '32px 0 48px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
            <p>Hozircha maqolalar mavjud emas.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {articles.map((article) => {
              const authors = article.authors_detail?.map(a => a.name).join(', ') ?? '';
              return (
                <Link key={article.id} href={`/articles/${article.id}`} className="article-row">
                  {/* Cover image */}
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url.startsWith('http') ? article.cover_image_url : `${API}${article.cover_image_url}`}
                      alt={article.title}
                      style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  ) : (
                    <div className='article-thumb' style={{ width: '88px', height: '88px', background: '#F4F6FA', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={28} color="#8B9DC3" />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {article.category && (
                        <span style={{ fontSize: '11px', background: '#F4F6FA', color: '#3D5A8A', padding: '2px 10px', borderRadius: '100px', fontFamily: 'sans-serif', border: '1px solid #e8ecf3' }}>
                          {article.category}
                        </span>
                      )}
                      {article.journal_name && (
                        <span style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>
                          {article.journal_name}
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B4A', marginBottom: '6px', lineHeight: 1.35, fontFamily: 'Georgia, serif',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {article.title}
                    </h2>
                    {authors && (
                      <p style={{ fontSize: '13px', color: '#3D5A8A', fontFamily: 'sans-serif', marginBottom: '6px' }}>{authors}</p>
                    )}
                    {article.abstract && (
                      <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif', lineHeight: 1.5,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                        {article.abstract}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                        {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                      </span>
                      {article.views !== undefined && (
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                          👁 {article.views}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowUpRight size={18} color="#8B9DC3" style={{ flexShrink: 0, marginTop: '4px' }} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
