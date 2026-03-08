import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Journal {
  id: number;
  name: string;
  issn: string;
  description: string;
  access_type: 'open' | 'closed';
  article_count: number;
  cover_image: string | null;
}

async function getJournals(): Promise<Journal[]> {
  try {
    const res = await fetch(`${API}/api/journals/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function JournalsPage() {
  const journals = await getJournals();

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-brand-navy text-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-brand-mist text-xs tracking-widest uppercase mb-1">INTEGRA</p>
          <h1 className="!text-white text-3xl font-bold">Jurnallar</h1>
          <p className="text-brand-mist text-sm mt-1">Barcha nashr jurnallari</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {journals.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Hozircha jurnallar mavjud emas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((journal) => (
              <Link
                key={journal.id}
                href={`/journals/${journal.id}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-mist transition flex flex-col"
              >
                {/* Cover */}
                {journal.cover_image ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={journal.cover_image.startsWith('http')
                        ? journal.cover_image
                        : `${API}${journal.cover_image}`}
                      alt={journal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-brand-navy to-brand-mid flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/30" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-bold text-brand-navy text-lg leading-tight">{journal.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                      journal.access_type === 'open'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                    </span>
                  </div>

                  {journal.issn && (
                    <p className="text-xs text-brand-steel font-mono mb-2">ISSN: {journal.issn}</p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{journal.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    {journal.article_count} ta maqola
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}