import Link from 'next/link';

interface Author {
  id: number;
  name: string;
  affiliation: string;
  bio: string;
  profile_image: string | null;
  article_count: number;
}

async function getAuthors(): Promise<Author[]> {
  const res = await fetch('http://127.0.0.1:8000/api/authors/', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Mualliflar</h1>
      {authors.length === 0 ? (
        <p className="text-center text-gray-500">Hozircha mualliflar mavjud emas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/authors/${author.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center">
                {author.profile_image && (
                  <img
                    src={author.profile_image?.startsWith('http') 
                        ? author.profile_image 
                        : `http://127.0.0.1:8000${author.profile_image}`}
                    alt={author.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">
                  {author.name}
                </h2>
                {author.affiliation && (
                  <p className="text-gray-600 mb-2">{author.affiliation}</p>
                )}
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{author.bio}</p>
                <div className="text-sm text-blue-600">
                  Maqolalar: {author.article_count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}