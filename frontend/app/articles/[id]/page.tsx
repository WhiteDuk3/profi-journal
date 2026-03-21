export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Author {
  id: number; name: string; affiliation: string;
  bio: string; profile_image: string | null; article_count: number;
}
interface Article {
  id: number; title: string; journal_name?: string; published_date: string; category?: string;
}

async function getAuthor(id: string): Promise<Author | null> {
  try {
    const res = await fetch(`${API}/api/authors/${id}/`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getArticlesByAuthor(id: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?author=${id}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [author, articles] = await Promise.all([getAuthor(id), getArticlesByAuthor(id)]);
  if (!author) notFound();

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '40px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8">
          <Link href="/authors" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B9DC3', textDecoration: 'none', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '24px' }}>
            <ArrowLeft size={14} /> Barcha mualliflar
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {author.profile_image ? (
              <img src={author.profile_image.startsWith('http') ? author.profile_image : `${API}${author.profile_image}`}
                alt={author.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="#8B9DC3" />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>
                {author.name}
              </h1>
              {author.affiliation && (
                <p style={{ color: '#8B9DC3', fontFamily: 'sans-serif', fontSize: '14px', marginBottom: '6px' }}>{author.affiliation}</p>
              )}
              {author.bio && author.bio.length > 3 && (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', fontSize: '13px', maxWidth: '560px', lineHeight: 1.6 }}>{author.bio}</p>
              )}
              <p style={{ color: '#8B9DC3', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '8px' }}>{author.article_count} ta maqola</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8" style={{ paddingTop: '40px', paddingBottom: '64px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>
          Muallifning maqolalari
        </h2>
        {articles.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
            Bu muallifning hali maqolalari yo&apos;q.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`}
                style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', textDecoration: 'none', border: '1px solid #e8ecf3', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{article.title}</h3>
                  {article.journal_name && (
                    <p style={{ fontSize: '12px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>{article.journal_name}</p>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif', flexShrink: 0 }}>
                  {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
