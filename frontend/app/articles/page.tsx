import Link from 'next/link';
import { FileText } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Article {
  id: number;
  title: string;
  abstract: string;
  authors_detail?: { name: string }[];
  authors?: string;
  published_date: string;
  category: string;
  cover_image_url?: string;
  journal_name?: string;
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
    <div className="min-h-screen bg-brand-bg">
      {/* Page header */}
      <div className="bg-brand-navy text-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-brand-mist text-xs tracking-widest uppercase mb-1">INTEGRA</p>
          <h1 className="!text-white text-3xl font-bold">Maqolalar</h1>
          <p className="text-brand-mist text-sm mt-1">Barcha nashr etilgan ilmiy maqolalar</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Hozircha maqolalar mavjud emas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {articles.map((article) => {
              const authors = article.authors_detail?.map(a => a.name).join(', ') ?? article.authors ?? '';
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-brand-mist transition flex gap-5"
                >
                  {/* Left: text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {article.category && (
                        <span className="text-xs bg-brand-bg text-brand-steel px-2 py-0.5 rounded-full border border-brand-mist/30">
                          {article.category}
                        </span>
                      )}
                      {article.journal_name && (
                        <span className="text-xs text-gray-400">{article.journal_name}</span>
                      )}
                    </div>
                    <h2 className="text-brand-navy font-semibold text-lg mb-1 line-clamp-2">
                      {article.title}
                    </h2>
                    {authors && (
                      <p className="text-sm text-brand-steel mb-2">{authors}</p>
                    )}
                    {article.abstract && (
                      <p className="text-sm text-gray-500 line-clamp-2">{article.abstract}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>

                  {/* Right: cover image (small, optional) */}
                  {article.cover_image_url && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-brand-bg">
                      <img
                        src={article.cover_image_url.startsWith('http')
                          ? article.cover_image_url
                          : `${API}${article.cover_image_url}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
