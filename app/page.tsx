import Link from 'next/link';
import { ArrowRight, BookOpen, Users, FileText, Upload, Unlock, Lock } from 'lucide-react';

// Dummy data with proper types
const stats = {
  journals: 8,
  authors: 456,
  articles: 1234
};

const popularArticles = [
  {
    id: 1,
    title: "Sun'iy intellekt va falsafa: yangi etik muammolar",
    authors_detail: [{ name: "Karimov A." }],
    published_date: "2026-02-10",
    views: 312,
    journal_name: "INTEGRA - Falsafa"
  },
  {
    id: 2,
    title: "Iqtisodiyotda raqamli transformatsiya: O‘zbekiston tajribasi",
    authors_detail: [{ name: "Raximov B." }, { name: "Tursunova N." }],
    published_date: "2026-02-05",
    views: 287,
    journal_name: "INTEGRA - Iqtisodiyot"
  },
  {
    id: 3,
    title: "Tibbiyotda gen muhandisligi: imkoniyatlar va xavflar",
    authors_detail: [{ name: "Xasanova D." }],
    published_date: "2026-01-28",
    views: 198,
    journal_name: "INTEGRA - Tibbiyot"
  }
];

const popularJournals = [
  {
    id: 1,
    name: "INTEGRA - Falsafa va Etika",
    access_type: "open" as const,
    description: "Falsafa, etika va ijtimoiy fanlar bo‘yicha tadqiqotlar.",
    article_count: 45,
    cover_image: null
  },
  {
    id: 2,
    name: "INTEGRA - Iqtisodiyot va Innovatsiya",
    access_type: "open" as const,
    description: "Iqtisodiyot, biznes va innovatsion rivojlanish.",
    article_count: 67,
    cover_image: null
  },
  {
    id: 3,
    name: "INTEGRA - Axborot Texnologiyalari",
    access_type: "closed" as const,
    description: "Sun'iy intellekt, dasturiy injiniring va IT.",
    article_count: 34,
    cover_image: null
  },
  {
    id: 4,
    name: "INTEGRA - Tibbiyot va Sog‘liqni saqlash",
    access_type: "open" as const,
    description: "Klinik tadqiqotlar, biomeditsina va jamoat salomatligi.",
    article_count: 52,
    cover_image: null
  }
];

const latestNews = [
  {
    id: 1,
    title: "INTEGRA jurnalining ilk soni chop etildi!",
    content: "2026-yil 1-sonida falsafa, iqtisodiyot, IT, tibbiyot, psixologiya va pedagogika bo‘yicha maqolalar nashr qilindi.",
    image: null,
    created_at: "2026-03-01"
  },
  {
    id: 2,
    title: "Xalqaro ilmiy konferensiya e’lon qilindi",
    content: "INTEGRA PRESS PUBLISHER 15-may kuni “Zamonaviy fan va ta’lim integratsiyasi” mavzusida konferensiya o‘tkazadi.",
    image: null,
    created_at: "2026-02-20"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section – Journal Cover Design */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 py-20 text-center md:text-left relative">
          <div className="max-w-4xl mx-auto md:mx-0">
            <h1 className="text-6xl md:text-7xl font-bold mb-2 tracking-tight">
              INTEGRA
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-4 text-blue-100">
              International Journal of Advanced Research and Studies
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm uppercase tracking-wide mb-6">
              <span className="border-r border-blue-300 pr-3">Philosophy</span>
              <span className="border-r border-blue-300 pr-3">Economics</span>
              <span className="border-r border-blue-300 pr-3">Information Technology</span>
              <span className="border-r border-blue-300 pr-3">Medicine</span>
              <span className="border-r border-blue-300 pr-3">Psychology</span>
              <span>Education</span>
            </div>
            <div className="text-lg mb-8 text-blue-200">
              <span className="font-semibold">Volume 1 | Issue 1 2026</span>
              <span className="mx-4">|</span>
              <span>ISSN 1234-5678</span>
              <span className="mx-4">|</span>
              <span>DOI: 10.56789/integra</span>
            </div>

            {/* Search Bar */}
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
          </div>
        </div>
      </section>

      {/* Stats Counters */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <BookOpen className="w-10 h-10 mx-auto text-blue-600 mb-2" />
            <div className="text-4xl font-bold text-blue-600">{stats.journals}</div>
            <div className="text-gray-600">Jurnallar</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Users className="w-10 h-10 mx-auto text-blue-600 mb-2" />
            <div className="text-4xl font-bold text-blue-600">{stats.authors}</div>
            <div className="text-gray-600">Mualliflar</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <FileText className="w-10 h-10 mx-auto text-blue-600 mb-2" />
            <div className="text-4xl font-bold text-blue-600">{stats.articles}</div>
            <div className="text-gray-600">Maqolalar</div>
          </div>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <Upload className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Maqola topshirish</h3>
            <p className="text-gray-600 mb-4">Jurnaldan birini tanlab, maqola ma'lumotlarini kiritib, fayllarni yuklang va tahririyat ko'rib chiqishi uchun yuboring.</p>
            <Link href="/submit" className="text-blue-600 hover:underline inline-flex items-center">
              Topshirish <ArrowRight className="ml-1 w-4 h-4" />
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
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
            <Lock className="w-10 h-10 text-gray-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Yopiq maqolalar</h3>
            <p className="text-gray-600 mb-4">Faqat obuna bo'lgan yoki muallif ruxsat bergan foydalanuvchilar uchun.</p>
            <Link href="/articles?access=closed" className="text-blue-600 hover:underline inline-flex items-center">
              Ko'rish <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Mashhur maqolalar</h2>
            <Link href="/articles" className="text-blue-600 hover:underline inline-flex items-center">
              Barchasi <ArrowRight className="ml-1 w-4 h-4" />
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
                  <span>👁 {article.views}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Journals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Jurnallar</h2>
          <Link href="/journals" className="text-blue-600 hover:underline inline-flex items-center">
            Barchasi <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularJournals.map((journal) => (
            <Link key={journal.id} href={`/journals/${journal.id}`} className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="w-24 h-24 bg-blue-100 flex items-center justify-center text-blue-600">
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-1">
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
              <h2 className="text-2xl font-bold">So'nggi yangiliklar</h2>
              <Link href="/news" className="text-blue-600 hover:underline inline-flex items-center">
                Barchasi <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestNews.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-3">{item.content}</p>
                  <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('uz-UZ')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
