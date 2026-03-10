import Link from 'next/link';
import { ArrowRight, BookOpen, Users, FileText, Upload, Unlock, Lock, ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen" style={{ background: '#F4F6FA', fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Hero — full bleed editorial */}
      <section style={{
        background: 'linear-gradient(135deg, #0d1b35 0%, #1C2B4A 50%, #2D4270 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Decorative grid lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        {/* Accent circle */}
        <div style={{
          position: 'absolute', right: '-10%', top: '10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,90,138,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-5%', bottom: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,157,195,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container mx-auto px-4 md:px-16" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px', animation: 'fadeUp 0.8s ease forwards' }}>
            {/* Eyebrow tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B9DC3', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#8B9DC3', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                International Journal of Advanced Research
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '700',
              color: '#ffffff', lineHeight: 1.05, marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}>
              Ilm-fan va<br />
              <span style={{ color: '#8B9DC3' }}>Tadqiqotlar</span><br />
              Markazi
            </h1>

            <p style={{
              fontSize: '1.125rem', color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px', lineHeight: 1.7, marginBottom: '40px',
              fontFamily: 'sans-serif', fontWeight: 300,
            }}>
              Ochiq kirish jurnallari, xalqaro maʼlumotlar bazalari va zamonaviy tadqiqotlar platformasi.
            </p>

            {/* Search bar */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.95)',
              borderRadius: '12px', overflow: 'hidden', maxWidth: '560px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <input
                type="text"
                placeholder="Maqolalar, jurnallar, mualliflarni qidiring..."
                style={{
                  flex: 1, padding: '16px 20px', border: 'none', outline: 'none',
                  fontSize: '15px', color: '#1C2B4A', background: 'transparent',
                  fontFamily: 'sans-serif',
                }}
              />
              <Link href="/search" style={{
                background: '#1C2B4A', color: 'white', padding: '16px 24px',
                display: 'flex', alignItems: 'center', gap: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                fontFamily: 'sans-serif', whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}>
                Izlash <ArrowRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '56px', flexWrap: 'wrap' }}>
              {[
                { value: stats.journals, label: 'Jurnal', icon: '📚' },
                { value: stats.authors, label: 'Muallif', icon: '✍️' },
                { value: stats.articles, label: 'Maqola', icon: '📄' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#fff', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ color: '#8B9DC3', fontSize: '13px', marginTop: '4px', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #F4F6FA)',
        }} />
      </section>

      {/* Quick actions */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e8ecf3' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0' }}>
            {[
              {
                icon: <Upload size={20} />, color: '#1C2B4A',
                title: 'Maqola topshirish',
                desc: "Jurnaldan birini tanlab, maqola fayllarini yuklang va tahririyatga yuboring.",
                link: '/submit',
              },
              {
                icon: <Unlock size={20} />, color: '#059669',
                title: 'Ochiq maqolalar',
                desc: "Hamma uchun bepul. Istalgan vaqt o'qing va yuklab oling.",
                link: '/articles?access=open',
              },
              {
                icon: <Lock size={20} />, color: '#3D5A8A',
                title: 'Yopiq maqolalar',
                desc: "Obuna bo'lgan yoki ruxsat olgan foydalanuvchilar uchun.",
                link: '/articles?access=closed',
              },
            ].map((card, i) => (
              <Link key={card.title} href={card.link} style={{
                display: 'block', padding: '32px 28px',
                borderRight: i < 2 ? '1px solid #e8ecf3' : 'none',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
                className="quick-action-link">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: `${card.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: card.color, marginBottom: '14px',
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B4A', marginBottom: '6px', fontFamily: 'sans-serif' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, fontFamily: 'sans-serif' }}>
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section style={{ padding: '80px 0', background: '#F4F6FA' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>
                So'nggi tadqiqotlar
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C2B4A' }}>
                Mashhur maqolalar
              </h2>
            </div>
            <Link href="/articles" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#3D5A8A', textDecoration: 'none', fontSize: '13px',
              fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '0.02em',
            }}>
              Barchasini ko'rish <ArrowUpRight size={14} />
            </Link>
          </div>

          {popularArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
              <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>Hozircha maqolalar mavjud emas.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {popularArticles.map((article, i) => (
                <Link key={article.id} href={`/articles/${article.id}`} className='article-card' style={{
                  display: 'block', background: '#fff', borderRadius: '12px',
                  padding: '24px', textDecoration: 'none',
                  border: '1px solid #e8ecf3',
                  animation: `fadeUp 0.5s ease forwards`,
                  animationDelay: `${i * 0.05}s`,
                  opacity: 0,
                }}
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(28,43,74,0.1)';
                  }}
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '11px', color: '#3D5A8A', fontFamily: 'sans-serif',
                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px',
                    fontWeight: 600,
                  }}>
                    Ilmiy maqola
                  </div>
                  <h3 style={{
                    fontSize: '15px', fontWeight: 700, color: '#1C2B4A',
                    lineHeight: 1.4, marginBottom: '10px',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '16px' }}>
                    {article.authors_detail?.map(a => a.name).join(', ')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                      {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                      👁 {article.views ?? 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Journals — dark band */}
      <section style={{ background: '#1C2B4A', padding: '80px 0' }}>
        <div className="container mx-auto px-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>
                Nashrlar
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
                Mashhur jurnallar
              </h2>
            </div>
            <Link href="/journals" style={{
              color: '#8B9DC3', textDecoration: 'none', fontSize: '13px',
              fontFamily: 'sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              Barchasini ko'rish <ArrowUpRight size={14} />
            </Link>
          </div>

          {popularJournals.length === 0 ? (
            <p style={{ color: '#8B9DC3', fontFamily: 'sans-serif', textAlign: 'center', padding: '40px' }}>
              Hozircha jurnallar mavjud emas.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {popularJournals.map((journal) => (
                <Link key={journal.id} href={`/journals/${journal.id}`} className='journal-card' style={{
                  display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px', padding: '20px', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(139,157,195,0.4)';
                  }}
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {journal.cover_image ? (
                    <img
                      src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                      alt={journal.name}
                      style={{ width: '72px', height: '96px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: '72px', height: '96px', background: 'rgba(255,255,255,0.08)',
                      borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={24} color="#8B9DC3" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                        {journal.name}
                      </h3>
                      <span style={{
                        fontSize: '11px', padding: '3px 8px', borderRadius: '100px', flexShrink: 0,
                        background: journal.access_type === 'open' ? 'rgba(5,150,105,0.2)' : 'rgba(255,255,255,0.1)',
                        color: journal.access_type === 'open' ? '#34d399' : '#8B9DC3',
                        fontFamily: 'sans-serif',
                      }}>
                        {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, fontFamily: 'sans-serif',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '8px',
                    }}>
                      {journal.description}
                    </p>
                    <span style={{ fontSize: '11px', color: '#8B9DC3', fontFamily: 'sans-serif' }}>
                      {journal.article_count} ta maqola
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News */}
      {latestNews.length > 0 && (
        <section style={{ padding: '80px 0', background: '#F4F6FA' }}>
          <div className="container mx-auto px-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '6px' }}>
                  Yangiliklar
                </p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C2B4A' }}>
                  Eng so'nggi yangiliklar
                </h2>
              </div>
              <Link href="/news" style={{
                color: '#3D5A8A', textDecoration: 'none', fontSize: '13px',
                fontFamily: 'sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                Barchasini ko'rish <ArrowUpRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {latestNews.map((item, i) => (
                <div key={item.id} className='news-card' style={{
                  background: '#fff', borderRadius: '12px', overflow: 'hidden',
                  border: '1px solid #e8ecf3',
                  animation: `fadeUp 0.5s ease forwards`, animationDelay: `${i * 0.08}s`, opacity: 0,
                }}
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(28,43,74,0.1)';
                  }}
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image.startsWith('http') ? item.image : `${API}${item.image}`}
                      alt={item.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={32} color="#8B9DC3" style={{ opacity: 0.4 }} />
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C2B4A', marginBottom: '8px', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, fontFamily: 'sans-serif',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '12px',
                    }}>
                      {item.content}
                    </p>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                      {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Submission CTA band */}
      <section style={{
        background: 'linear-gradient(135deg, #2D4270 0%, #1C2B4A 100%)',
        padding: '60px 0',
      }}>
        <div className="container mx-auto px-4" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8B9DC3', fontFamily: 'sans-serif', marginBottom: '12px' }}>
            Tadqiqotingizni ulashing
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
            Maqolangizni nashr qiling
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Ilmiy tadqiqotingizni dunyoga taqdim eting. Tez ko'rib chiqish va professional tahrir xizmati.
          </p>
          <Link href="/submit" className='cta-btn' style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#fff', color: '#1C2B4A', padding: '14px 28px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
            fontFamily: 'sans-serif', fontSize: '15px',
          }}
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
            }}
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Upload size={18} /> Maqola topshirish
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .quick-action-link:hover { background: #F4F6FA !important; }
        .article-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(28,43,74,0.1); }
        .journal-card:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(139,157,195,0.4) !important; }
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(28,43,74,0.1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .article-card, .news-card { transition: transform 0.2s, box-shadow 0.2s; }
        .journal-card { transition: background 0.2s, border-color 0.2s; }
        .cta-btn { transition: transform 0.2s, box-shadow 0.2s; }
      `}</style>
    </div>
  );
}
