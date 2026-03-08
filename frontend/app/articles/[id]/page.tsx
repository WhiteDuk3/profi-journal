import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, Calendar, Eye } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Article {
  id: number;
  title: string;
  abstract: string;
  content: string;
  authors_detail?: { name: string; affiliation?: string }[];
  authors?: string;
  published_date: string;
  category: string;
  journal_name?: string;
  views?: number;
  cover_image_url?: string;
  pdf_file_url?: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API}/api/articles/${id}/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const authors = article.authors_detail?.map(a => a.name).join(', ') ?? article.authors ?? '';

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <Link href="/articles" className="inline-flex items-center text-brand-steel hover:text-brand-navy text-sm mb-6 transition">
          ← Barcha maqolalar
        </Link>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Header band */}
          <div className="bg-brand-navy px-8 py-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {article.category && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
              )}
              {article.journal_name && (
                <span className="text-xs text-brand-mist">{article.journal_name}</span>
              )}
            </div>
            <h1 className="!text-white text-2xl md:text-3xl font-bold leading-snug mb-3">
              {article.title}
            </h1>
            <p className="text-brand-mist text-sm">{authors}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-brand-mist/70">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(article.published_date).toLocaleDateString('uz-UZ')}
              </span>
              {article.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views} ko'rishlar
                </span>
              )}
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Abstract */}
            <div className="bg-brand-bg rounded-lg p-5 mb-6 border-l-4 border-brand-steel">
              <h2 className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-2">Annotatsiya</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{article.abstract}</p>
            </div>

            {/* Cover image */}
            {article.cover_image_url && (
              <div className="rounded-lg overflow-hidden mb-6 border border-gray-100">
                <img
                  src={article.cover_image_url.startsWith('http')
                    ? article.cover_image_url
                    : `${API}${article.cover_image_url}`}
                  alt={article.title}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            {/* Content */}
            {article.content && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <h2 className="text-brand-navy font-semibold text-lg mb-3">Maqola matni</h2>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            )}

            {/* Authors detail */}
            {article.authors_detail && article.authors_detail.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-brand-navy uppercase tracking-wider mb-3">Mualliflar</h2>
                <div className="flex flex-wrap gap-3">
                  {article.authors_detail.map((a, i) => (
                    <div key={i} className="bg-brand-bg rounded-lg px-4 py-2 text-sm">
                      <p className="font-medium text-brand-navy">{a.name}</p>
                      {a.affiliation && <p className="text-gray-500 text-xs">{a.affiliation}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF download */}
            {article.pdf_file_url && (
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <a href={article.pdf_file_url.startsWith('http')
                    ? article.pdf_file_url
                    : `${API}${article.pdf_file_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3 rounded-lg hover:bg-brand-mid transition font-medium">
                  <FileText className="w-4 h-4" />
                  PDF ni yuklab olish
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}