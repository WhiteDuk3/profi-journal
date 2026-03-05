import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  abstract: string;
  authors_detail: { name: string }[];
  published_date: string;
  journal_name?: string;
}

interface Journal {
  id: number;
  name: string;
  access_type: string;
  description: string;
}

interface Author {
  id: number;
  name: string;
  affiliation: string;
}

async function searchAll(query: string) {
  try {
    const [articlesRes, journalsRes, authorsRes] = await Promise.all([
      fetch(`http://127.0.0.1:8000/api/articles/?search=${encodeURIComponent(query)}`, { cache: 'no-store' }),
      fetch(`http://127.0.0.1:8000/api/journals/?search=${encodeURIComponent(query)}`, { cache: 'no-store' }),
      fetch(`http://127.0.0.1:8000/api/authors/?search=${encodeURIComponent(query)}`, { cache: 'no-store' }),
    ]);

    const articles = articlesRes.ok ? await articlesRes.json() : [];
    const journals = journalsRes.ok ? await journalsRes.json() : [];
    const authors = authorsRes.ok ? await authorsRes.json() : [];

    return { articles, journals, authors };
  } catch (error) {
    console.error('Search failed:', error);
    return { articles: [], journals: [], authors: [] };
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (!q) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Qidiruv soʻrovini kiriting.</p>
      </div>
    );
  }

  const results = await searchAll(q);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Qidiruv natijalari: "{q}"</h1>

      {results.articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Maqolalar ({results.articles.length})</h2>
          <div className="space-y-4">
            {results.articles.map((article: Article) => (
              <Link key={article.id} href={`/articles/${article.id}`} className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{article.abstract}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{article.authors_detail?.map(a => a.name).join(', ')}</span>
                  <span>{article.journal_name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.journals.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Jurnallar ({results.journals.length})</h2>
          <div className="space-y-4">
            {results.journals.map((journal: Journal) => (
              <Link key={journal.id} href={`/journals/${journal.id}`} className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2">{journal.name}</h3>
                <p className="text-gray-600 line-clamp-2">{journal.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                  journal.access_type === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.authors.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Mualliflar ({results.authors.length})</h2>
          <div className="space-y-4">
            {results.authors.map((author: Author) => (
              <Link key={author.id} href={`/authors/${author.id}`} className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2">{author.name}</h3>
                {author.affiliation && <p className="text-gray-600">{author.affiliation}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.articles.length === 0 && results.journals.length === 0 && results.authors.length === 0 && (
        <p className="text-gray-500">Hech narsa topilmadi.</p>
      )}
    </div>
  );
}