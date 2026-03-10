import Link from 'next/link';
import { notFound } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Author {
  id: number; name: string; affiliation: string;
  bio: string; profile_image: string | null; article_count: number;
}
interface Article {
  id: number; title: string; journal_name?: string; published_date: string;
}

async function getAuthor(id: string): Promise<Author | null> {
  try {
    const res = await fetch(`${API}/api/authors/${id}/`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getArticlesByAuthor(id: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?authors=${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [author, articles] = await Promise.all([getAuthor(id), getArticlesByAuthor(id)]);
  if (!author) notFound();

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-brand-navy text-white py-10">
        <div className="container mx-auto px-4 max-w-4xl flex items-center gap-6">
          {author.profile_image ? (
            <img
              src={author.profile_image.startsWith('http') ? author.profile_image : `${API}${author.profile_image}`}
              alt={author.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border-2 border-white/20">
              <span className="text-white font-bold text-2xl">{author.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="!text-white text-2xl font-bold">{author.name}</h1>
            {author.affiliation && <p className="text-brand-mist text-sm mt-1">{author.affiliation}</p>}
            {author.bio && author.bio.length > 3 && (
              <p className="text-blue-100/70 text-sm mt-2 max-w-xl">{author.bio}</p>
            )}
            <p className="text-brand-mist text-xs mt-2">{author.article_count} ta maqola</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/authors" className="inline-flex items-center text-brand-steel hover:text-brand-navy text-sm mb-6 transition">
          ← Barcha mualliflar
        </Link>

        <h2 className="text-xl font-bold text-brand-navy mb-4">Muallifning maqolalari</h2>

        {articles.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Bu muallifning hali maqolalari yo'q.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white rounded-lg border border-gray-100 px-6 py-4 hover:shadow-sm hover:border-brand-mist transition"
              >
                <h3 className="font-semibold text-brand-navy mb-1">{article.title}</h3>
                <p className="text-xs text-gray-400">
                  {article.journal_name && `${article.journal_name} · `}
                  {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
