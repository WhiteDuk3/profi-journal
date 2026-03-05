import Link from 'next/link';
import { ArrowRight, BookOpen, Users, FileText, Upload, Unlock, Lock } from 'lucide-react';

// Dummy data with proper types
const stats = {
  journals: 45,
  authors: 1234,
  articles: 5678
};

const popularArticles: {
  id: number;
  title: string;
  authors_detail: { name: string }[];
  published_date: string;
  views: number;
  journal_name: string;
}[] = [
  {
    id: 1,
    title: "Sun'iy intellektning tibbiyotdagi roli",
    authors_detail: [{ name: "Karimov A." }, { name: "Tursunova N." }],
    published_date: "2025-03-01",
    views: 234,
    journal_name: "Tibbiyot jurnali"
  },
  {
    id: 2,
    title: "O‘zbekistonda ta’lim islohotlari: tahlil va istiqbollar",
    authors_detail: [{ name: "Raximov B." }],
    published_date: "2025-02-15",
    views: 189,
    journal_name: "Pedagogika"
  },
  {
    id: 3,
    title: "Iqlim o‘zgarishining qishloq xo‘jaligiga ta’siri",
    authors_detail: [{ name: "Xasanova D." }, { name: "Sodiqov M." }],
    published_date: "2025-01-20",
    views: 145,
    journal_name: "Ekologiya"
  }
];

const popularJournals: {
  id: number;
  name: string;
  access_type: "open" | "closed";
  description: string;
  article_count: number;
  cover_image: string | null;
}[] = [
  {
    id: 1,
    name: "O‘zbekiston tibbiyot jurnali",
    access_type: "open",
    description: "Tibbiyot sohasidagi eng so‘nggi tadqiqotlar.",
    article_count: 234,
    cover_image: null
  },
  {
    id: 2,
    name: "Iqtisodiyot va innovatsiyalar",
    access_type: "closed",
    description: "Iqtisodiyot, biznes va innovatsion texnologiyalar.",
    article_count: 156,
    cover_image: null
  }
];

const latestNews: {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
}[] = [
  {
    id: 1,
    title: "Yangi jurnal ochildi",
    content: "Profi universiteti qoshida yangi ilmiy jurnal ish boshladi.",
    image: null,
    created_at: "2025-03-10"
  },
  {
    id: 2,
    title: "Xalqaro konferensiya",
    content: "15-aprel kuni “Zamonaviy fan va ta’lim” mavzusida konferensiya bo‘lib o‘tadi.",
    image: null,
    created_at: "2025-03-05"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 pl-8 md:pl-16 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bilimlar markazi</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Ilm-fan va tadqiqotlarni qoʻllab-quvvatlaymiz. Ochiq kirish jurnallari, xalqaro maʼlumotlar bazalari va zamonaviy tadqiqotlar.
            </p>
            <form action="/search" method="get" className="bg-white rounded-xl shadow-2xl p-1 flex flex-col md:flex-row max-w-2xl">
              <input
                type="text"
                name="q"
                placeholder="Maqolalar, jurnallar, mualliflarni qidiring..."
                className="flex-1 px-5 py-3 text-gray-800 rounded-xl md:rounded-r-none focus:outline-none text-base"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl md:rounded-l-none font-medium transition flex items-center justify-center gap-2">
                Izlash
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-blue-200 mb-2" />
                <div className="text-4xl font-bold text-white">{stats.journals}</div>
                <div className="text-blue-200 text-sm mt-1">Jurnallar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-blue-200 mb-2" />
                <div className="text-4xl font-bold text-white">{stats.authors}</div>
                <div className="text-blue-200 text-sm mt-1">Mualliflar</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-blue-200 mb-2" />
                <div className="text-4xl font-bold text-white">{stats.articles}</div>
                <div className="text-blue-200 text-sm mt-1">Maqolalar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <Upload className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Maqola chiqarish</h3>
            <p className="text-gray-600 mb-4">Jurnaldan birini tanlab, maqola ma'lumotlarini kiritib, fayllarni yuklang va tahririyat ko'rib chiqishi uchun yuboring.</p>
            <Link href="/submit" className="text-blue-600 hover:underline inline-flex items-center">
              Maqola topshirish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <Unlock className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Ochiq maqolalar</h3>
            <p className="text-gray-600 mb-4">Hamma uchun bepul. Istalgan foydalanuvchi o'qishi, yuklab olishi mumkin.</p>
            <Link href="/articles?access=open" className="text-blue-600 hover:underline inline-flex items-center">
              Ko'rish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-y-1">
            <Lock className="w-10 h-10 text-gray-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Yopiq maqolalar</h3>
            <p className="text-gray-600 mb-4">Faqat obuna bo'lgan yoki muallif ruxsat bergan foydalanuvchilar uchun.</p>
            <Link href="/articles?access=closed" className="text-blue-600 hover:underline inline-flex items-center">
              Ko'rish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular articles */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Mashhur maqolalar</h2>
            <Link href="/articles" className="text-blue-600 hover:underline inline-flex items-center">
              Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.id}`} className="block bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {article.authors_detail?.map(a => a.name).join(', ')}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(article.published_date).toLocaleDateString('uz-UZ')}</span>
                  <span>👁 {article.views || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular journals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Mashhur jurnallar</h2>
          <Link href="/journals" className="text-blue-600 hover:underline inline-flex items-center">
            Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularJournals.map((journal) => (
            <Link key={journal.id} href={`/journals/${journal.id}`} className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              {journal.cover_image ? (
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={journal.cover_image.startsWith('http') ? journal.cover_image : `http://127.0.0.1:8000${journal.cover_image}`}
                    alt={journal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
              <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{journal.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    journal.access_type === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{journal.description}</p>
                <p className="text-xs text-gray-500">Maqolalar: {journal.article_count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Eng so'nggi yangiliklar</h2>
              <Link href="/news" className="text-blue-600 hover:underline inline-flex items-center">
                Ko'proq ko'rish <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  {item.image ? (
                    <img
                      src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(item.created_at).toLocaleDateString('uz-UZ')}</p>
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
