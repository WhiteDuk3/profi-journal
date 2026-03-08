import Link from 'next/link';
import { ArrowRight, BookOpen, Users, FileText, Upload, Unlock, Lock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Stats { journals: number; authors: number; articles: number; }
interface Article {
  id: number; title: string;
  authors_detail: { name: string }[];
  published_date: string; views?: number; journal_name?: string;
}
interface Journal {
  id: number; name: string; access_type: 'open' | 'closed';
  description: string; article_count: number; cover_image: string | null;
}
interface NewsItem {
  id: number; title: string; content: string;
  image: string | null; created_at: string;
}

async function getStats(): Promise<Stats> {
  try {
    const res = await fetch(`${API}/api/stats/`, { cache: 'no-store' });
    if (!res.ok) return { journals: 0, authors: 0, articles: 0 };
    return res.json();
  } catch { return { journals: 0, authors: 0, articles: 0 }; }
}

async function getPopularArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?ordering=-views&limit=6`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getPopularJournals(): Promise<Journal[]> {
  try {
    const res = await fetch(`${API}/api/journals/?ordering=-article_count&limit=4`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API}/api/news/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch { return []; }
}

export default async function Home() {
  const [stats, popularArticles, popularJournals, latestNews] = await Promise.all([
    getStats(), getPopularArticles(), getPopularJournals(), getLatestNews(),
  ]);

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-navy via-brand-mid to-brand-navy text-white overflow-hidden">
        {/* Subtle network pattern overlay matching journal cover */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="white"/>
                <line x1="30" y1="30" x2="90" y2="30" stroke="white" strokeWidth="0.5"/>
                <line x1="30" y1="30" x2="30" y2="90" stroke="white" strokeWidth="0.5"/>
                <line x1="30" y1="30" x2="60" y2="0" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-16 py-20 relative">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <p className="text-brand-mist text-sm tracking-widest uppercase mb-3 font-medium">
              International Journal of Advanced Research and Studies
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white">
              Bilimlar markazi
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl">
              Ilm-fan va tadqiqotlarni qoʻllab-quvvatlaymiz. Ochiq kirish jurnallari,
              xalqaro maʼlumotlar bazalari va zamonaviy tadqiqotlar.
            </p>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-2xl p-1 flex flex-col md:flex-row max-w-2xl">
              <input
                type="text"
                placeholder="Maqolalar, jurnallar, mualliflarni qidiring..."
                className="flex-1 px-5 py-3 text-gray-800 rounded-xl md:rounded-r-none focus:outline-none text-base"
              />
              <Link
                href="/search"
                className="bg-brand-steel hover:bg-brand-mid text-white px-6 py-3 rounded-xl md:rounded-l-none font-medium transition flex items-center justify-center gap-2"
              >
                Izlash <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl">
              {[
                { icon: <BookOpen className="w-7 h-7 mx-auto text-brand-mist mb-1" />, value: stats.journals,  label: 'Jurnallar' },
                { icon: <Users    className="w-7 h-7 mx-auto text-brand-mist mb-1" />, value: stats.authors,   label: 'Mualliflar' },
                { icon: <FileText className="w-7 h-7 mx-auto text-brand-mist mb-1" />, value: stats.articles,  label: 'Maqolalar' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  {s.icon}
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-brand-mist text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Upload className="w-9 h-9 text-brand-navy mb-3" />,
              title: 'Maqola chiqarish',
              desc: "Jurnaldan birini tanlab, maqola ma'lumotlarini kiritib, fayllarni yuklang va tahririyat ko'rib chiqishi uchun yuboring.",
              link: '/submit', linkText: 'Maqola topshirish',
            },
            {
              icon: <Unlock className="w-9 h-9 text-emerald-600 mb-3" />,
              title: 'Ochiq maqolalar',
              desc: "Hamma uchun bepul. Istalgan foydalanuvchi o'qishi, yuklab olishi mumkin.",
              link: '/articles?access=open', linkText: "Ko'rish",
            },
            {
              icon: <Lock className="w-9 h-9 text-brand-steel mb-3" />,
              title: 'Yopiq maqolalar',
              desc: "Faqat obuna bo'lgan yoki muallif ruxsat bergan foydalanuvchilar uchun.",
              link: '/articles?access=closed', linkText: "Ko'rish",
            },
          ].map(card => (
            <div key={card.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition hover:-translate-y-1 transform">
              {card.icon}
              <h3 className="text-lg font-semibold text-brand-navy mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{card.desc}</p>
              <Link href={card.link} className="text-brand-steel hover:text-brand-navy inline-flex items-center text-sm font-medium transition">
                {card.linkText} <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-brand-navy">Mashhur maqolalar</h2>
            <Link href="/articles" className="text-brand-steel hover:text-brand-navy text-sm inline-flex items-center transition">
              Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          {popularArticles.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Hozircha maqolalar mavjud emas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`}
                  className="block border border-gray-100 rounded-lg p-5 hover:shadow-md hover:border-brand-mist transition"
                >
                  <h3 className="font-semibold text-brand-navy mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {article.authors_detail?.map(a => a.name).join(', ')}
                  </p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{new Date(article.published_date).toLocaleDateString('uz-UZ')}</span>
                    <span>👁 {article.views ?? 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Journals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy">Mashhur jurnallar</h2>
          <Link href="/journals" className="text-brand-steel hover:text-brand-navy text-sm inline-flex items-center transition">
            Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        {popularJournals.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Hozircha jurnallar mavjud emas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularJournals.map((journal) => (
              <Link key={journal.id} href={`/journals/${journal.id}`}
                className="flex bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                {journal.cover_image ? (
                  <div className="w-28 h-28 flex-shrink-0">
                    <img
                      src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                      alt={journal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-brand-bg flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-brand-mist" />
                  </div>
                )}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-brand-navy text-sm">{journal.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      journal.access_type === 'open'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{journal.description}</p>
                  <p className="text-xs text-gray-400">Maqolalar: {journal.article_count}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-brand-navy">Eng soʻnggi yangiliklar</h2>
              <Link href="/news" className="text-brand-steel hover:text-brand-navy text-sm inline-flex items-center transition">
                Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item) => (
                <div key={item.id} className="bg-brand-bg rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition">
                  {item.image ? (
                    <img
                      src={item.image.startsWith('http') ? item.image : `${API}${item.image}`}
                      alt={item.title}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-brand-bg flex items-center justify-center">
                      <FileText className="w-10 h-10 text-brand-mist" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-navy mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      

    </div>
  );
}


/*NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 */