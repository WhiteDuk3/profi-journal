import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Author {
  id: number;
  name: string;
  affiliation: string;
  bio: string;
  profile_image: string | null;
  article_count: number;
}

async function getAuthor(id: string): Promise<Author | null> {
  const res = await fetch(`http://127.0.0.1:8000/api/authors/${id}/`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getArticlesByAuthor(authorId: string): Promise<any[]> {
  const res = await fetch(`http://127.0.0.1:8000/api/articles/?authors=${authorId}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await getAuthor(id);
  const articles = await getArticlesByAuthor(id);

  if (!author) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/authors"
        className="inline-flex items-center text-blue-600 hover:underline mb-8"
      >
        ← Barcha mualliflar
      </Link>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {author.profile_image && (
            <img
              src={author.profile_image?.startsWith('http') 
                ? author.profile_image 
                : `http://127.0.0.1:8000${author.profile_image}`}
              alt={author.name}
              className="w-40 h-40 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
            {author.affiliation && (
              <p className="text-xl text-gray-600 mb-4">{author.affiliation}</p>
            )}
            <p className="text-gray-700 mb-4">{author.bio}</p>
            <div className="text-sm text-gray-500">
              Maqolalar soni: {author.article_count}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Muallifning maqolalari</h2>
      {articles.length === 0 ? (
        <p className="text-gray-500">Bu muallifning hali maqolalari yo'q.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
              <p className="text-sm text-gray-600">
                {article.journal_name} · {new Date(article.published_date).toLocaleDateString('uz-UZ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}