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
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <style>{`
        .article-row {
          display: flex; gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid #e8ecf3;
          text-decoration: none;
          transition: background 0.15s;
          border-radius: 0;
        }
        .article-row:first-child { border-top: 1px solid #e8ecf3; }
        .article-row:hover { background: #F4F6FA; padding-left: 12px; padding-right: 12px; margin-left: -12px; margin-right: -12px; }
        @media (max-width: 640px) {
          .article-row { gap: 12px; padding: 16px 0; }
          .article-thumb-img { width: 64px !important; height: 64px !important; }
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
      <div className="container mx-auto px-4 md:px-8" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
            <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
            <p>Hozircha maqolalar mavjud emas.</p>
          </div>
        ) : (
          <div>
            {articles.map((article) => {
              const authors = article.authors_detail?.map(a => a.name).join(', ') ?? '';
              return (
                <Link key={article.id} href={`/articles/${article.id}`} className="article-row">
                  {/* Cover image */}
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url.startsWith('http') ? article.cover_image_url : `${API}${article.cover_image_url}`}
                      alt={article.title}
                      className="article-thumb-img"
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  ) : (
                    <div className="article-thumb-img" style={{ width: '80px', height: '80px', background: '#F4F6FA', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} color="#8B9DC3" />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {article.category && (
                        <span style={{ fontSize: '11px', background: '#EEF1F7', color: '#3D5A8A', padding: '2px 10px', borderRadius: '100px', fontFamily: 'sans-serif' }}>
                          {article.category}
                        </span>
                      )}
                      {article.journal_name && (
                        <span style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>
                          {article.journal_name}
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', marginBottom: '4px', lineHeight: 1.35, fontFamily: 'Georgia, serif',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {article.title}
                    </h2>
                    {authors && (
                      <p style={{ fontSize: '13px', color: '#3D5A8A', fontFamily: 'sans-serif', marginBottom: '4px' }}>{authors}</p>
                    )}
                    {article.abstract && (
                      <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'sans-serif', lineHeight: 1.5,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>
                        {article.abstract}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                        {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                      </span>
                      {article.views !== undefined && (
                        <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                          👁 {article.views}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowUpRight size={16} color="#8B9DC3" style={{ flexShrink: 0, marginTop: '4px' }} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
