import Link from 'next/link';

interface Journal {
  id: number;
  name: string;
  issn: string;
  description: string;
  access_type: 'open' | 'closed';
  article_count: number;
  cover_image: string | null;
  created_at: string;
}

async function getJournals(): Promise<Journal[]> {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/journals/', {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function JournalsPage() {
  const journals = await getJournals();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Jurnallar</h1>
      
      {journals.length === 0 ? (
        <p className="text-center text-gray-500">Hozircha jurnallar mavjud emas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.map((journal) => (
            <Link
              key={journal.id}
              href={`/journals/${journal.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {journal.cover_image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={journal.cover_image?.startsWith('http') 
                        ? journal.cover_image 
                        : `http://127.0.0.1:8000${journal.cover_image}`}
                    alt={journal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold group-hover:text-blue-600 transition">
                    {journal.name}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    journal.access_type === 'open' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                  </span>
                </div>
                {journal.issn && (
                  <p className="text-sm text-gray-500 mb-2">ISSN: {journal.issn}</p>
                )}
                <p className="text-gray-600 mb-4 line-clamp-3">{journal.description}</p>
                <div className="text-sm text-gray-500">
                  Maqolalar: {journal.article_count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}