import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, Calendar, Eye, ArrowLeft, BookOpen, User } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Article {
  id: number;
  title: string;
  abstract: string;
  content: string;
  authors_detail?: { id?: number; name: string; affiliation?: string; profile_image?: string }[];
  published_date: string;
  category: string;
  journal_name?: string;
  journal_id?: number;
  views?: number;
  cover_image_url?: string;
  pdf_file_url?: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API}/api/articles/${id}/`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const authors = article.authors_detail?.map(a => a.name).join(', ') ?? '';

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>

      {/* Header band */}
      <section style={{ background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 100%)', padding: '40px 0 48px' }}>
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: '900px' }}>
          <Link href="/articles" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#8B9DC3', textDecoration: 'none', fontSize: '13px',
            fontFamily: 'sans-serif', marginBottom: '24px',
          }}>
            <ArrowLeft size={14} /> Barcha maqolalar
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {article.category && (
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 12px', borderRadius: '100px', fontFamily: 'sans-serif' }}>
                {article.category}
              </span>
            )}
            {article.journal_name && article.journal_id && (
              <Link href={`/journals/${article.journal_id}`} style={{ fontSize: '11px', color: '#8B9DC3', textDecoration: 'none', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={11} /> {article.journal_name}
              </Link>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif', lineHeight: 1.25, marginBottom: '16px' }}>
            {article.title}
          </h1>

          {authors && (
            <p style={{ color: '#8B9DC3', fontFamily: 'sans-serif', fontSize: '14px', marginBottom: '16px' }}>
              {authors}
            </p>
          )}

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={12} /> {new Date(article.published_date).toLocaleDateString('uz-UZ')}
            </span>
            {article.views !== undefined && (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Eye size={12} /> {article.views} ko'rish
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: '900px', padding: '48px 0' }}>

        {/* Cover image */}
        {article.cover_image_url && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '32px', border: '1px solid #e8ecf3' }}>
            <img
              src={article.cover_image_url.startsWith('http') ? article.cover_image_url : `${API}${article.cover_image_url}`}
              alt={article.title}
              style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Abstract */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #e8ecf3', borderLeft: '4px solid #3D5A8A' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#3D5A8A', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '12px' }}>
            Annotatsiya
          </h2>
          <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75, fontFamily: 'Georgia, serif' }}>
            {article.abstract}
          </p>
        </div>

        {/* Content */}
        {article.content && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #e8ecf3' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#3D5A8A', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '16px' }}>
              Maqola matni
            </h2>
            <div style={{ fontSize: '15px', color: '#374151', lineHeight: 1.8, fontFamily: 'Georgia, serif' }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        )}

        {/* Authors */}
        {article.authors_detail && article.authors_detail.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid #e8ecf3' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#3D5A8A', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: '16px' }}>
              Mualliflar
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {article.authors_detail.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F4F6FA', borderRadius: '10px', padding: '10px 14px' }}>
                  {a.profile_image ? (
                    <img src={a.profile_image.startsWith('http') ? a.profile_image : `${API}${a.profile_image}`}
                      alt={a.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1C2B4A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="#8B9DC3" />
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C2B4A', fontFamily: 'sans-serif' }}>{a.name}</p>
                    {a.affiliation && <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'sans-serif' }}>{a.affiliation}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF download */}
        {article.pdf_file_url && (
          <div style={{ textAlign: 'center', paddingTop: '8px' }}>
            <a
              href={article.pdf_file_url.startsWith('http') ? article.pdf_file_url : `${API}${article.pdf_file_url}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: '#1C2B4A', color: '#fff', padding: '14px 32px',
                borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
                fontFamily: 'sans-serif', fontSize: '15px',
              }}
            >
              <FileText size={18} /> PDF ni yuklab olish
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
