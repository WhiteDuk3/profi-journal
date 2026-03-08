import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, FileText } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Journal {
  id: number; name: string; issn: string; description: string;
  access_type: 'open' | 'closed'; article_count: number; cover_image: string | null;
}
interface Article {
  id: number; title: string;
  authors_detail?: { name: string }[];
  published_date: string; category: string;
}

async function getJournal(id: string): Promise<Journal | null> {
  try {
    const res = await fetch(`${API}/api/journals/${id}/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getJournalArticles(id: string): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?journal=${id}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [journal, articles] = await Promise.all([getJournal(id), getJournalArticles(id)]);
  if (!journal) notFound();

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Header */}
      <div className="bg-brand-navy text-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl flex gap-6 items-start">
          {journal.cover_image ? (
            <img
              src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
              alt={journal.name}
              className="w-28 h-36 object-cover rounded-lg shadow-lg flex-shrink-0"
            />
          ) : (
            <div className="w-28 h-36 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-10 h-10 text-white/40" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                journal.access_type === 'open'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/10 text-white/60 border border-white/20'
              }`}>
                {journal.access_type === 'open' ? 'Ochiq kirish' : 'Yopiq kirish'}
              </span>
            </div>
            <h1 className="!text-white text-2xl md:text-3xl font-bold mb-2">{journal.name}</h1>
            {journal.issn && (
              <p className="text-brand-mist text-sm font-mono mb-3">ISSN: {journal.issn}</p>
            )}
            <p className="text-blue-100/80 text-sm leading-relaxed max-w-2xl">{journal.description}</p>
            <p className="text-brand-mist text-xs mt-3">{journal.article_count} ta maqola nashr etilgan</p>
          </div>
        </div>
      </div>

      {/* Articles list */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/journals" className="inline-flex items-center text-brand-steel hover:text-brand-navy text-sm mb-6 transition">
          ← Barcha jurnallar
        </Link>

        <h2 className="text-xl font-bold text-brand-navy mb-4">Jurnal maqolalari</h2>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Bu jurnalda hali maqolalar yo'q.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="bg-white rounded-lg border border-gray-100 px-6 py-4 hover:shadow-sm hover:border-brand-mist transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-brand-navy mb-1">{article.title}</h3>
                    <p className="text-sm text-brand-steel">
                      {article.authors_detail?.map(a => a.name).join(', ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {article.category && (
                      <span className="text-xs bg-brand-bg text-brand-steel px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                    </p>
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