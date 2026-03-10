import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Upload, Unlock, Lock, ArrowUpRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Stats { journals: number; authors: number; articles: number; }
interface Article {
  id: number; title: string;
  authors_detail: { name: string }[];
  published_date: string; views?: number;
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
    const res = await fetch(`${API}/api/stats/`, { next: { revalidate: 300 } });
    if (!res.ok) return { journals: 0, authors: 0, articles: 0 };
    return res.json();
  } catch { return { journals: 0, authors: 0, articles: 0 }; }
}
async function getPopularArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?ordering=-views&limit=6`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function getPopularJournals(): Promise<Journal[]> {
  try {
    const res = await fetch(`${API}/api/journals/?ordering=-article_count&limit=4`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API}/api/news/`, { next: { revalidate: 300 } });
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
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s ease 0.1s forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.2s forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s ease 0.4s forwards; opacity: 0; }
        .fade-up-5 { animation: fadeUp 0.7s ease 0.5s forwards; opacity: 0; }
        .fade-up-6 { animation: fadeUp 0.7s ease 0.6s forwards; opacity: 0; }
        .article-card {
          display: block; background: #fff; border-radius: 12px;
          padding: 24px; text-decoration: none;
          border: 1px solid #e8ecf3;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .article-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(28,43,74,0.1); }
        .journal-card {
          display: flex; gap: 16px; background: rgba(255,255,255,0.06);
          border-radius: 12px; padding: 20px; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.2s, border-color 0.2s;
        }
        .journal-card:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(139,157,195,0.4) !important; }
        .news-card {
          background: #fff; border-radius: 12px; overflow: hidden;
          border: 1px solid #e8ecf3; transition: transform 0.2s, box-shadow 0.2s;
        }
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(28,43,74,0.1); }
        .quick-link {
          display: block; padding: 32px 28px; text-decoration: none; transition: background 0.2s;
          border-right: 1px solid #e8ecf3;
        }
        .quick-link:last-child { border-right: none; }
        .quick-link:hover { background: #F4F6FA; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #1C2B4A; padding: 14px 28px;
          border-radius: 10px; text-decoration: none; font-weight: 700;
          font-family: sans-serif; font-size: 15px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .dot-pulse { animation: pulseGlow 2s infinite; }
      `}</style>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 50%, #2D4270 100%)',
        position: 'relative', overflow: 'hidden',
        minHeight: '90vh', display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div style={{
          position: 'absolute', right: '-10%', top: '5%', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,90,138,0.35) 0%, transparent 70%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-5%', bottom: '-15%', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,157,195,0.12) 0%, transparent 70%)', pointerEvents: 'none',
        }} />

        <div className="container mx-auto px-4 md:px-16" style={{ position: 'relative', zIndex: 1, paddingTop: '60px', paddingBottom: '100px' }}>
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <div className="dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9DC3' }} />
            <span style={{ color: '#8B9DC3', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              International Journal of Advanced Research
            </span>
          </div>

          <h1 className="fade-up-1" style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, color: '#fff',
            lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'Georgia, serif',
          }}>
            Ilm-fan va<br />
            <span style={{ color: '#8B9DC3' }}>Tadqiqotlar</span><br />
            Markazi
          </h1>

          <p className="fade-up-2" style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '500px',
            lineHeight: 1.75, marginBottom: '40px', fontFamily: 'sans-serif', fontWeight: 300,
          }}>
            Ochiq kirish jurnallari, xalqaro maʼlumotlar bazalari va zamonaviy tadqiqotlar platformasi.
          </p>

          <div className="fade-up-3" style={{
            display: 'flex', background: 'rgba(255,255,255,0.95)',
            borderRadius: '12px', overflow: 'hidden', maxWidth: '540px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <input type="text" placeholder="Maqolalar, jurnallar, mualliflarni qidiring..."
              style={{ flex: 1, padding: '16px 20px', border: 'none', outline: 'none', fontSize: '14px', color: '#1C2B4A', background: 'transparent', fontFamily: 'sans-serif' }}
            />
            <Link href="/search" style={{
              background: '#1C2B4A', color: 'white', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600,
              fontFamily: 'sans-serif', whiteSpace: 'nowrap',
            }}>
              Izlash <ArrowRight size={16} />
            </Link>
          </div>

          <div className="fade-up-4" style={{ display: 'flex', gap: '48px', marginTop: '56px', flexWrap: 'wrap' }}>
            {[
              { value: stats.journals, label: stats.journals === 1 ? 'ta jurnal' : 'ta jurnal' },
              { value: stats.authors, label: 'ta muallif' },
              { value: stats.articles, label: 'ta maqola' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
                  {s.value}
                </div>
                <div style={{ color: '#8B9DC3', fontSize: '12px', marginTop: '4px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, transparent, #fff)' }} />
      </section>

      {/* QUICK ACTIONS */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e8ecf3' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              { icon: <Upload size={20} />, color: '#1C2B4A', title: 'Maqola topshirish', desc: "Jurnaldan birini tanlab, fayllarni yuklang va tahririyatga yuboring.", link: '/submit' },
              { icon: <Unlock size={20} />, color: '#059669', title: 'Ochiq maqolalar', desc: "Hamma uchun bepul. Istalgan vaqt o'qing va yuklab oling.", link: '/articles?access=open' },
              { icon: <Lock size={20} />, color: '#3D5A8A', title: 'Yopiq maqolalar', desc: "Obuna bo'lgan yoki ruxsat olgan foydalanuvchilar uchun.", link: '/articles?access=closed' },
            ].map((card) => (
              <Link key={card.title} href={card.link} className="quick-link">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: `${card.color}18`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: card.color, marginBottom: '14px',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', marginBottom: '6px', fontFamily: 'sans-serif' }}>{card.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ARTICLES */}
      <section style={{ padding: '80px 0', background: '#F4F6FA' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>So'nggi tadqiqotlar</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif' }}>Mashhur maqolalar</h2>
            </div>
            <Link href="/articles" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3D5A8A', textDecoration: 'none', fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 600 }}>
              Barchasini ko'rish <ArrowUpRight size={14} />
            </Link>
          </div>
          {popularArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
              <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
              <p>Hozircha maqolalar mavjud emas.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', maxWidth: popularArticles.length === 1 ? '400px' : '100%' }}>
              {popularArticles.map((article, i) => (
                <Link key={article.id} href={`/articles/${article.id}`} className={`article-card fade-up-${Math.min(i + 1, 6)}`}>
                  <div style={{ fontSize: '11px', color: '#3D5A8A', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>Ilmiy maqola</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', lineHeight: 1.4, marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '16px' }}>
                    {article.authors_detail?.map(a => a.name).join(', ')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>{new Date(article.published_date).toLocaleDateString('uz-UZ')}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>👁 {article.views ?? 0}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* JOURNALS */}
      <section style={{ background: '#1C2B4A', padding: '80px 0' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>Nashrlar</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>Mashhur jurnallar</h2>
            </div>
            <Link href="/journals" style={{ color: '#8B9DC3', textDecoration: 'none', fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Barchasini ko'rish <ArrowUpRight size={14} />
            </Link>
          </div>
          {popularJournals.length === 0 ? (
            <p style={{ color: '#8B9DC3', fontFamily: 'sans-serif', textAlign: 'center', padding: '40px' }}>Hozircha jurnallar mavjud emas.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px', maxWidth: popularJournals.length === 1 ? '480px' : '100%' }}>
              {popularJournals.map((journal) => (
                <Link key={journal.id} href={`/journals/${journal.id}`} className="journal-card">
                  {journal.cover_image ? (
                    <img src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                      alt={journal.name} style={{ width: '72px', height: '96px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '72px', height: '96px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={24} color="#8B9DC3" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3, fontFamily: 'sans-serif' }}>{journal.name}</h3>
                      <span style={{
                        fontSize: '11px', padding: '3px 8px', borderRadius: '100px', flexShrink: 0,
                        background: journal.access_type === 'open' ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.1)',
                        color: journal.access_type === 'open' ? '#34d399' : '#8B9DC3', fontFamily: 'sans-serif',
                      }}>
                        {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontFamily: 'sans-serif', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {journal.description}
                    </p>
                    <span style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>{journal.article_count} ta maqola</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEWS */}
      {latestNews.length > 0 && (
        <section style={{ padding: '80px 0', background: '#F4F6FA' }}>
          <div className="container mx-auto px-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>Yangiliklar</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C2B4A', fontFamily: 'Georgia, serif' }}>Eng so'nggi yangiliklar</h2>
              </div>
              <Link href="/news" style={{ color: '#3D5A8A', textDecoration: 'none', fontSize: '13px', fontFamily: 'sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Barchasini ko'rish <ArrowUpRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: latestNews.length === 1 ? '420px' : '100%' }}>
              {latestNews.map((item, i) => (
                <div key={item.id} className={`news-card fade-up-${Math.min(i + 1, 6)}`}>
                  {item.image ? (
                    <img src={item.image.startsWith('http') ? item.image : `${API}${item.image}`} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={32} color="#8B9DC3" />
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', marginBottom: '8px', lineHeight: 1.4, fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, fontFamily: 'sans-serif', marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.content}
                    </p>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif' }}>{new Date(item.created_at).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #2D4270 0%, #1C2B4A 100%)', padding: '64px 0' }}>
        <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '12px' }}>Tadqiqotingizni ulashing</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'Georgia, serif' }}>Maqolangizni nashr qiling</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'sans-serif', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Ilmiy tadqiqotingizni dunyoga taqdim eting. Tez ko'rib chiqish va professional tahrir xizmati.
          </p>
          <Link href="/submit" className="cta-btn">
            <Upload size={18} /> Maqola topshirish
          </Link>
        </div>
      </section>
    </div>
  );
}
