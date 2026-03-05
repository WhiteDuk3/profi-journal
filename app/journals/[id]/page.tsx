import Link from 'next/link';
import { notFound } from 'next/navigation';

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

async function getJournal(id: string): Promise<Journal | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/journals/${id}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const journal = await getJournal(id);

  if (!journal) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/journals"
        className="inline-flex items-center text-blue-600 hover:underline mb-8"
      >
        ← Barcha jurnallar
      </Link>

      {journal.cover_image && (
        <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={journal.cover_image?.startsWith('http') 
                ? journal.cover_image 
                : `http://127.0.0.1:8000${journal.cover_image}`}
            alt={journal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">{journal.name}</h1>
        <span className={`text-sm px-3 py-1 rounded-full ${
          journal.access_type === 'open' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
        </span>
      </div>

      {journal.issn && (
        <p className="text-lg text-gray-600 mb-4">ISSN: {journal.issn}</p>
      )}

      <div className="prose prose-lg max-w-none mb-8">
        <p>{journal.description}</p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <Link
          href={`/journals/${journal.id}/articles`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Jurnal maqolalarini ko'rish ({journal.article_count})
        </Link>
      </div>
    </div>
  );
}