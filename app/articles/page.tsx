import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  abstract: string;
  authors: string;
  published_date: string;
  category: string;
  cover_image_url?: string;
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch('http://127.0.0.1:8000/api/articles/', {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">So'nggi maqolalar</h1>
      {articles.length === 0 ? (
        <p className="text-center text-gray-500">Hozircha maqolalar mavjud emas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {article.cover_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000${article.cover_image_url}`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  {article.category && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{article.category}</span>
                  )}
                  <span>{new Date(article.published_date).toLocaleDateString('uz-UZ')}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.abstract}</p>
                <div className="text-sm text-gray-500">
                  {article.authors}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}