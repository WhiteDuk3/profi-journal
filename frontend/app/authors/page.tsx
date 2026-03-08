import Link from 'next/link';
import { Users } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Author {
  id: number; name: string; affiliation: string;
  bio: string; profile_image: string | null; article_count: number;
}

async function getAuthors(): Promise<Author[]> {
  try {
    const res = await fetch(`${API}/api/authors/`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="bg-brand-navy text-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-brand-mist text-xs tracking-widest uppercase mb-1">INTEGRA</p>
          <h1 className="!text-white text-3xl font-bold">Mualliflar</h1>
          <p className="text-brand-mist text-sm mt-1">Jurnal mualliflari</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {authors.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Hozircha mualliflar mavjud emas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-mist transition flex items-center gap-4"
              >
                {author.profile_image ? (
                  <img
                    src={author.profile_image.startsWith('http') ? author.profile_image : `${API}${author.profile_image}`}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-brand-bg border border-brand-mist/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-navy font-bold text-lg">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-semibold text-brand-navy truncate">{author.name}</h2>
                  {author.affiliation && (
                    <p className="text-xs text-gray-500 truncate">{author.affiliation}</p>
                  )}
                  <p className="text-xs text-brand-steel mt-1">{author.article_count} ta maqola</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}