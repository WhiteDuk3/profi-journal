import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  abstract: string;
  content: string;
  authors: string;
  published_date: string;
  category: string;
  cover_image_url?: string;
  pdf_file_url?: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/articles"
        className="inline-flex items-center text-blue-600 hover:underline mb-8"
      >
        ← Barcha maqolalar
      </Link>

      {article.cover_image_url && (
        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={`http://127.0.0.1:8000${article.cover_image_url}`}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        {article.category && (
          <span className="bg-gray-100 px-3 py-1 rounded-full">{article.category}</span>
        )}
        <span>{new Date(article.published_date).toLocaleDateString('uz-UZ')}</span>
      </div>

      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-xl text-gray-600 mb-6">{article.authors}</p>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Annotatsiya</h2>
        <p>{article.abstract}</p>

        {article.content && (
          <>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Maqola</h2>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </>
        )}
      </div>

      {article.pdf_file_url && (
        <div className="mt-12 text-center">
          <a
            href={`http://127.0.0.1:8000${article.pdf_file_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            📥 PDF ni yuklab olish
          </a>
        </div>
      )}
    </article>
  );
}