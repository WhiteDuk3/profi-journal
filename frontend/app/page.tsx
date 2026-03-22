export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Upload, Unlock, Lock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Stats { journals: number; authors: number; articles: number; }
interface Article {
  id: number; title: string;
  authors_detail: { name: string }[];
  published_date: string; views?: number;
  journal_detail?: { name: string };
  access_type?: 'open' | 'closed';
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
    const res = await fetch(`${API}/api/stats/`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { journals: 0, authors: 0, articles: 0 };
    return res.json();
  } catch { return { journals: 0, authors: 0, articles: 0 }; }
}
async function getPopularArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/?ordering=-published_date&limit=6`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function getPopularJournals(): Promise<Journal[]> {
  try {
    const res = await fetch(`${API}/api/journals/?ordering=-article_count&limit=4`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
async function getLatestNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API}/api/news/`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch { return []; }
}

export default async function Home() {
  const [stats, popularArticles, popularJournals, latestNews] = await Promise.all([
    getStats(), getPopularArticles(), getPopularJournals(), getLatestNews(),
  ]);

  // Split articles: first one is featured hero, rest are the list
  const featuredArticle = popularArticles[0] ?? null;
  const listArticles = popularArticles.slice(1, 6);

  return (
    <div className="min-h-screen" style={{ background: '#060a14', color: '#dde3f0' }}>

      {/* ── GLOBAL STYLES ─────────────────────────────────── */}
      <style>{`
        /* Star canvas sits behind everything */
        #star-canvas {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* Every section sits above the canvas */
        .above { position: relative; z-index: 1; }

        /* ── HERO ENTRANCE SEQUENCE ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ruleExpand {
          from { width: 0; }
          to   { width: 160px; }
        }
        @keyframes breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.55; }
          50%      { transform: translate(-50%,-50%) scale(1.18); opacity: 1;    }
        }
        @keyframes shootingStar {
          0%   { transform: translateX(0)   translateY(0);   opacity: 1; }
          100% { transform: translateX(300px) translateY(120px); opacity: 0; }
        }

        /* Staggered hero elements */
        .h-logo  { animation: fadeUp 2s   cubic-bezier(0.16,1,0.3,1) 0.4s  both; }
        .h-eye   { animation: fadeIn 1.6s ease                        1.2s  both; }
        .h-w0    { animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 1.6s  both; }
        .h-w1    { animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 1.82s both; }
        .h-w2    { animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 2.04s both; }
        .h-w3    { animation: fadeUp 1.1s cubic-bezier(0.16,1,0.3,1) 2.26s both; }
        .h-rule  { animation: ruleExpand 2s ease                      2.6s  both; display:block; height:0.5px; background: linear-gradient(90deg,transparent,rgba(139,157,195,0.45),transparent); margin: 30px auto; }
        .h-sub   { animation: fadeIn 1.4s ease                        2.9s  both; }
        .h-stats { animation: fadeUp 1.4s cubic-bezier(0.16,1,0.3,1) 3.1s  both; }
        .h-cta   { animation: fadeIn 1.2s ease                        3.5s  both; }
        .h-hint  { animation: fadeIn 1s   ease                        4.1s  both; }

        /* Logo glow ring */
        .logo-glow {
          position: absolute; top: 50%; left: 50%;
          width: 150px; height: 150px; border-radius: 50%;
          background: radial-gradient(circle, rgba(61,90,138,0.2) 0%, transparent 70%);
          animation: breathe 4s ease-in-out infinite;
          pointer-events: none;
        }

        /* Scroll hint line pulse */
        @keyframes linePulse {
          0%,100% { opacity: 0.15; }
          50%      { opacity: 0.9; }
        }
        .scroll-line {
          width: 0.5px; height: 52px;
          background: linear-gradient(to bottom, rgba(139,157,195,0.55), transparent);
          animation: linePulse 2.6s ease-in-out infinite;
        }

        /* ── SCROLL REVEAL (added via JS) ── */
        .rv {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 1.4s ease, transform 1.4s ease;
        }
        .rv.in  { opacity: 1; transform: translateY(0); }
        .rv2 {
          opacity: 0; transform: translateY(16px);
          transition: opacity 2s ease, transform 2s ease;
        }
        .rv2.in { opacity: 1; transform: translateY(0); }

        /* Article row slide-in from left */
        .ar {
          opacity: 0; transform: translateX(-16px);
          transition: opacity 1.2s ease, transform 1.2s ease,
                      border-color 0.4s ease;
        }
        .ar.in { opacity: 1; transform: translateX(0); }

        /* ── SECTION LABEL ── */
        .s-label {
          font-family: sans-serif; font-size: 9px;
          letter-spacing: 0.26em; color: #2a3e60;
          text-transform: uppercase; margin-bottom: 52px;
          display: flex; align-items: center; gap: 20px;
        }
        .s-label::after {
          content: ''; flex: 1; height: 0.5px;
          background: rgba(139,157,195,0.1);
        }

        /* ── FEATURED GRID ── */
        .feat-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1px;
          background: rgba(139,157,195,0.08);
        }
        @media (max-width: 768px) {
          .feat-grid { grid-template-columns: 1fr; }
        }
        .feat-main {
          padding: 56px;
          background: rgba(6,10,20,0.97);
          cursor: pointer;
          transition: background 0.5s;
          position: relative; overflow: hidden;
          text-decoration: none; display: block;
        }
        .feat-main::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,157,195,0.55), transparent);
          transform: scaleX(0); transition: transform 0.6s;
        }
        .feat-main:hover { background: rgba(14,22,42,0.97); }
        .feat-main:hover::before { transform: scaleX(1); }
        .feat-main:hover .feat-title {
          color: #eaf0ff;
          text-shadow: 0 0 32px rgba(139,157,195,0.22);
        }
        .feat-side {
          display: flex; flex-direction: column;
          gap: 1px; background: rgba(139,157,195,0.08);
        }
        .feat-item {
          flex: 1; padding: 30px 38px;
          background: rgba(6,10,20,0.97);
          cursor: pointer; transition: background 0.4s;
          text-decoration: none; display: block;
        }
        .feat-item:hover { background: rgba(14,22,42,0.97); }
        .feat-item:hover .feat-item-title { color: #c8d8f0; }

        /* ── ARTICLE ROW HOVER ── */
        .ar:hover .ar-title {
          color: #ddeeff;
          text-shadow: 0 0 22px rgba(139,157,195,0.28);
        }
        .ar:hover .ar-num  { color: rgba(139,157,195,0.2); }
        .ar:hover .ar-cat  { color: #5a7090; }
        .ar:hover .ar-read { opacity: 1; }
        .ar:hover { border-bottom-color: rgba(139,157,195,0.22) !important; }

        /* ── DISCIPLINE CELLS ── */
        .disc-cell {
          padding: 40px 16px;
          background: rgba(6,10,20,0.97);
          text-align: center; cursor: pointer;
          transition: background 0.5s, box-shadow 0.5s;
          position: relative; overflow: hidden;
          text-decoration: none; display: block;
        }
        .disc-cell::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: rgba(139,157,195,0.65);
          transform: scaleX(0); transition: transform 0.5s;
        }
        .disc-cell:hover {
          background: rgba(12,20,38,0.97);
          box-shadow: inset 0 0 40px rgba(61,90,138,0.14);
        }
        .disc-cell:hover::before { transform: scaleX(1); }
        .disc-cell:hover .disc-sym {
          color: #8B9DC3;
          text-shadow: 0 0 18px rgba(139,157,195,0.75);
        }
        .disc-cell:hover .disc-name { color: #7a8fae; }

        /* ── JOURNAL CARDS ── */
        .journal-card {
          display: flex; gap: 20px;
          padding: 28px 32px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(139,157,195,0.1);
          text-decoration: none;
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
          cursor: pointer;
        }
        .journal-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(139,157,195,0.28);
          box-shadow: 0 0 32px rgba(61,90,138,0.1);
        }
        .journal-card:hover .journal-name {
          color: #eaf0ff;
          text-shadow: 0 0 20px rgba(139,157,195,0.2);
        }

        /* ── NEWS CARDS ── */
        .news-card {
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(139,157,195,0.1);
          transition: background 0.4s, border-color 0.4s;
          cursor: pointer; text-decoration: none; display: block;
        }
        .news-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(139,157,195,0.25);
        }
        .news-card:hover .news-title { color: #eaf0ff; }

        /* ── QUOTE BAND ── */
        .quote-band {
          padding: 130px 52px; text-align: center;
          position: relative;
          border-top:    0.5px solid rgba(139,157,195,0.07);
          border-bottom: 0.5px solid rgba(139,157,195,0.07);
        }
        .quote-band::before, .quote-band::after {
          content: ''; position: absolute;
          left: 12%; right: 12%; height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(139,157,195,0.2), transparent);
        }
        .quote-band::before { top: 0; }
        .quote-band::after  { bottom: 0; }

        /* ── BUTTONS ── */
        .btn-primary {
          padding: 14px 40px;
          background: rgba(28,43,74,0.8);
          border: 0.5px solid rgba(139,157,195,0.3);
          color: #c8d8f0;
          font-family: sans-serif; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.35s;
          border-radius: 1px; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover {
          background: rgba(45,66,112,0.9);
          border-color: rgba(139,157,195,0.6);
          color: #eaf0ff;
          box-shadow: 0 0 24px rgba(61,90,138,0.35);
        }
        .btn-ghost {
          padding: 14px 40px; background: transparent;
          border: 0.5px solid rgba(139,157,195,0.15);
          color: #4a5e82; font-family: sans-serif; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; transition: all 0.35s; border-radius: 1px;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover {
          border-color: rgba(139,157,195,0.4); color: #8B9DC3;
        }

        /* ── ACCESS BADGE ── */
        .badge-open   { background: rgba(5,150,105,0.15); color: #34d399; }
        .badge-closed { background: rgba(139,157,195,0.1); color: #8B9DC3; }
        .access-badge {
          font-family: sans-serif; font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 100px;
          display: inline-block;
        }
      `}</style>

      {/* ── STAR CANVAS (animated via client script at bottom) ── */}
      <canvas id="star-canvas" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="above" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 40px 100px',
        position: 'relative',
      }}>

        {/* Logo */}
        <div className="h-logo" style={{ position: 'relative', width: 110, height: 110, marginBottom: 52 }}>
          <div className="logo-glow" />
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <circle cx="55" cy="55" r="50"  stroke="#3D5A8A" strokeWidth="0.7" opacity="0.65"/>
            <circle cx="55" cy="55" r="37"  stroke="#3D5A8A" strokeWidth="0.6" opacity="0.55"/>
            <circle cx="55" cy="55" r="26"  stroke="#3D5A8A" strokeWidth="0.55" opacity="0.5"/>
            <circle cx="55" cy="55" r="16"  stroke="#3D5A8A" strokeWidth="0.5" opacity="0.45"/>
            <circle cx="55" cy="55" r="8"   stroke="#3D5A8A" strokeWidth="0.5" opacity="0.4"/>
            <line x1="55" y1="5" x2="55" y2="105" stroke="#5a7aaa" strokeWidth="0.7" opacity="0.5"/>
            <circle cx="55" cy="55" r="3.5" fill="#9ab0d0" opacity="0.95"/>
            <path d="M55 55 Q67 47 73 55 Q67 63 55 55Z" fill="#8B9DC3" opacity="0.5"/>
            <path d="M55 55 Q43 63 37 55 Q43 47 55 55Z" fill="#2D4270" opacity="0.5"/>
            <path d="M55 55 Q70 43 78 55" stroke="#6a8aaa" strokeWidth="0.6" fill="none" opacity="0.4"/>
            <path d="M55 55 Q72 40 82 55" stroke="#5a7a9a" strokeWidth="0.5" fill="none" opacity="0.3"/>
            <path d="M55 55 Q74 37 86 55" stroke="#4a6a8a" strokeWidth="0.4" fill="none" opacity="0.2"/>
          </svg>
        </div>

        {/* Eyebrow */}
        <div className="h-eye" style={{
          fontFamily: 'sans-serif', fontSize: 10,
          letterSpacing: '0.28em', color: '#3D5A8A',
          textTransform: 'uppercase', marginBottom: 24,
        }}>
          Ilmiy Jurnal · Xalqaro nashr · 2026
        </div>

        {/* Title — word by word */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 82px)', fontWeight: 400,
          lineHeight: 1.05, letterSpacing: '-0.025em',
          color: '#eaf0ff', marginBottom: 20,
        }}>
          <span className="h-w0" style={{ display: 'inline-block', marginRight: '0.2em' }}>Ilm-fan</span>
          <span className="h-w1" style={{ display: 'inline-block', fontStyle: 'italic', color: '#8B9DC3', marginRight: '0.2em' }}>ning</span>
          <br />
          <span className="h-w2" style={{ display: 'inline-block', marginRight: '0.2em' }}>yangi</span>
          <span className="h-w3" style={{ display: 'inline-block' }}>ufqlari</span>
        </h1>

        {/* Rule */}
        <span className="h-rule" />

        {/* Subtitle */}
        <div className="h-sub" style={{
          fontFamily: 'sans-serif', fontSize: 11,
          letterSpacing: '0.12em', color: '#3a4e70',
          textTransform: 'uppercase', marginBottom: 60,
        }}>
          INTEGRA — International Journal of Advanced Research and Studies
        </div>

        {/* Stats */}
        <div className="h-stats" style={{ display: 'flex', gap: 64, marginBottom: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: stats.journals,  label: 'Jurnallar' },
            { value: stats.authors,   label: 'Mualliflar' },
            { value: stats.articles,  label: 'Maqolalar' },
          ].map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: i > 0 ? 64 : 0 }}>
              {i > 0 && <div style={{ width: '0.5px', background: 'rgba(139,157,195,0.15)', height: 40, marginRight: -64 + 64 }} />}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 34, fontWeight: 300, color: '#c8d8f0', letterSpacing: '-0.03em', fontFamily: 'Georgia, serif' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.16em', color: '#3a4a6a', textTransform: 'uppercase', marginTop: 5 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="h-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/articles" className="btn-primary">
            Maqolalarni ko&apos;rish <ArrowRight size={14} />
          </Link>
          <Link href="/submit" className="btn-ghost">
            <Upload size={14} /> Maqola yuborish
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="h-hint" style={{
          position: 'absolute', bottom: 40,
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 12,
        }}>
          <div className="scroll-line" />
          <span style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.22em', color: '#1e2e48', textTransform: 'uppercase' }}>
            Pastga
          </span>
        </div>
      </section>

      {/* ── FEATURED ARTICLES ────────────────────────────────── */}
      <section className="above" style={{ padding: '110px 52px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="s-label rv">Tanlangan maqolalar</div>

        {featuredArticle ? (
          <div className="feat-grid rv" style={{ transitionDelay: '0.1s' }}>
            {/* Main featured */}
            <Link href={`/articles/${featuredArticle.id}`} className="feat-main">
              <div style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#2D4270', textTransform: 'uppercase', marginBottom: 18 }}>
                {featuredArticle.journal_detail?.name ?? 'Ilmiy maqola'}
              </div>
              <h2 className="feat-title" style={{
                fontSize: 27, fontWeight: 400, lineHeight: 1.26,
                color: '#c8d8f0', marginBottom: 16, letterSpacing: '-0.01em',
                transition: 'color 0.4s, text-shadow 0.4s',
              }}>
                {featuredArticle.title}
              </h2>
              <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#2a3a58', marginBottom: 28 }}>
                {featuredArticle.authors_detail?.map(a => a.name).join(', ')}
                {' · '}
                {new Date(featuredArticle.published_date).toLocaleDateString('uz-UZ')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#3D5A8A', textTransform: 'uppercase' }}>
                  Maqolani o&apos;qish →
                </span>
                {featuredArticle.access_type && (
                  <span className={`access-badge ${featuredArticle.access_type === 'open' ? 'badge-open' : 'badge-closed'}`}>
                    {featuredArticle.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                  </span>
                )}
              </div>
            </Link>

            {/* Side items */}
            <div className="feat-side">
              {listArticles.slice(0, 3).map(article => (
                <Link key={article.id} href={`/articles/${article.id}`} className="feat-item">
                  <div style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#2D4270', textTransform: 'uppercase', marginBottom: 12 }}>
                    {article.journal_detail?.name ?? 'Ilmiy maqola'}
                  </div>
                  <h3 className="feat-item-title" style={{
                    fontSize: 14, lineHeight: 1.45,
                    color: '#7a8fae', marginBottom: 10,
                    transition: 'color 0.3s',
                  }}>
                    {article.title}
                  </h3>
                  <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#2a3a58', marginBottom: 14 }}>
                    {article.authors_detail?.map(a => a.name).join(', ')}
                  </div>
                  <span style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#3D5A8A', textTransform: 'uppercase' }}>
                    O&apos;qish →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#2a3a58', fontFamily: 'sans-serif' }}>
            <FileText size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
            <p>Hozircha maqolalar mavjud emas.</p>
          </div>
        )}
      </section>

      {/* ── QUOTE BAND ───────────────────────────────────────── */}
      <div className="above quote-band">
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.25em', color: '#1e2e48', textTransform: 'uppercase', marginBottom: 28 }} className="rv">
            001
          </div>
          <p className="rv2" style={{
            fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 400,
            fontStyle: 'italic', color: '#6a8aaa', lineHeight: 1.4,
            letterSpacing: '-0.01em',
          }}>
            &ldquo;Ilm-fan cheksiz koinot kabidir — har bir kashfiyot yangi savollar eshigini ochadi.&rdquo;
          </p>
          <div className="rv2" style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#1e2e48', textTransform: 'uppercase', marginTop: 28, transitionDelay: '0.4s' }}>
            INTEGRA · 2026
          </div>
        </div>
      </div>

      {/* ── DISCIPLINES ──────────────────────────────────────── */}
      <section className="above" style={{ padding: '110px 52px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="s-label rv">Ilmiy yo&apos;nalishlar</div>
        <div className="rv" style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 1, background: 'rgba(139,157,195,0.07)',
          transitionDelay: '0.15s',
        }}>
          {[
            { sym: '◈', name: 'Falsafa',      href: '/articles?category=philosophy' },
            { sym: '◉', name: 'Iqtisodiyot',  href: '/articles?category=economics' },
            { sym: '◎', name: 'IT',            href: '/articles?category=it' },
            { sym: '◍', name: 'Tibbiyot',      href: '/articles?category=medicine' },
            { sym: '◌', name: 'Psixologiya',   href: '/articles?category=psychology' },
            { sym: '◐', name: 'Ta\'lim',       href: '/articles?category=education' },
          ].map(d => (
            <Link key={d.name} href={d.href} className="disc-cell">
              <div className="disc-sym" style={{ fontSize: 22, marginBottom: 16, color: '#2a3e60', lineHeight: 1, fontFamily: 'sans-serif', transition: 'color 0.4s, text-shadow 0.4s' }}>
                {d.sym}
              </div>
              <div className="disc-name" style={{ fontFamily: 'sans-serif', fontSize: 9, letterSpacing: '0.14em', color: '#2a3a58', textTransform: 'uppercase', transition: 'color 0.4s' }}>
                {d.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LATEST ARTICLES ──────────────────────────────────── */}
      <section className="above" style={{ padding: '0 52px 110px', maxWidth: 1160, margin: '0 auto' }}>
        <div className="s-label rv">So&apos;nggi maqolalar</div>
        <div style={{ borderTop: '0.5px solid rgba(139,157,195,0.08)' }}>
          {listArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#2a3a58', fontFamily: 'sans-serif' }}>
              Maqolalar mavjud emas.
            </div>
          ) : listArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="ar"
              data-delay={i * 150}
              style={{
                display: 'grid', gridTemplateColumns: '56px 1fr 80px',
                gap: 28, alignItems: 'start',
                padding: '32px 0',
                borderBottom: '0.5px solid rgba(139,157,195,0.06)',
                textDecoration: 'none',
              }}
            >
              <div className="ar-num" style={{
                fontSize: 40, fontWeight: 300,
                color: 'rgba(139,157,195,0.07)',
                fontFamily: 'Georgia, serif', lineHeight: 1, paddingTop: 2,
                transition: 'color 0.4s',
              }}>
                {String(i + 2).padStart(2, '0')}
              </div>
              <div>
                <div className="ar-cat" style={{
                  fontFamily: 'sans-serif', fontSize: 9,
                  letterSpacing: '0.14em', color: '#1e2e48',
                  textTransform: 'uppercase', marginBottom: 10,
                  transition: 'color 0.4s',
                }}>
                  {article.journal_detail?.name ?? 'Ilmiy maqola'}
                </div>
                <div className="ar-title" style={{
                  fontSize: 16, fontWeight: 400,
                  color: '#7a8fae', lineHeight: 1.4, marginBottom: 8,
                  transition: 'color 0.4s, text-shadow 0.4s',
                }}>
                  {article.title}
                </div>
                <div style={{ fontFamily: 'sans-serif', fontSize: 10, color: '#1e2e48' }}>
                  {article.authors_detail?.map(a => a.name).join(', ')}
                </div>
                <div className="ar-read" style={{
                  fontFamily: 'sans-serif', fontSize: 9,
                  letterSpacing: '0.14em', color: '#3D5A8A',
                  textTransform: 'uppercase', marginTop: 6,
                  opacity: 0, transition: 'opacity 0.4s',
                }}>
                  O&apos;qish →
                </div>
              </div>
              <div style={{ textAlign: 'right', paddingTop: 4 }}>
                <div style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#1e2e48', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                </div>
                {article.access_type && (
                  <span className={`access-badge ${article.access_type === 'open' ? 'badge-open' : 'badge-closed'}`} style={{ marginTop: 8, display: 'inline-block' }}>
                    {article.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
        {listArticles.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 52 }} className="rv">
            <Link href="/articles" className="btn-ghost">
              Barcha maqolalar <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* ── JOURNALS ─────────────────────────────────────────── */}
      <section className="above" style={{ padding: '110px 52px', borderTop: '0.5px solid rgba(139,157,195,0.07)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 52 }}>
            <div className="s-label rv" style={{ marginBottom: 0, flex: 1 }}>Mashhur jurnallar</div>
            <Link href="/journals" className="btn-ghost" style={{ padding: '10px 24px', fontSize: 9 }}>
              Barchasini ko&apos;rish →
            </Link>
          </div>
          {popularJournals.length === 0 ? (
            <p style={{ color: '#2a3a58', fontFamily: 'sans-serif', textAlign: 'center', padding: 40 }}>
              Hozircha jurnallar mavjud emas.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 1, background: 'rgba(139,157,195,0.07)',
            }}>
              {popularJournals.map((journal, i) => (
                <Link
                  key={journal.id}
                  href={`/journals/${journal.id}`}
                  className={`journal-card rv`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  {journal.cover_image ? (
                    <img
                      src={journal.cover_image.startsWith('http') ? journal.cover_image : `${API}${journal.cover_image}`}
                      alt={journal.name}
                      style={{ width: 64, height: 86, objectFit: 'cover', borderRadius: 2, flexShrink: 0, opacity: 0.85 }}
                    />
                  ) : (
                    <div style={{
                      width: 64, height: 86, flexShrink: 0,
                      background: 'rgba(139,157,195,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BookOpen size={20} color="#2a3a58" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <h3 className="journal-name" style={{
                        fontSize: 14, fontWeight: 400, color: '#c8d8f0',
                        lineHeight: 1.35, fontFamily: 'Georgia, serif',
                        transition: 'color 0.4s, text-shadow 0.4s',
                      }}>
                        {journal.name}
                      </h3>
                      <span className={`access-badge ${journal.access_type === 'open' ? 'badge-open' : 'badge-closed'}`}>
                        {journal.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 12, color: '#2a3a58', lineHeight: 1.6,
                      fontFamily: 'sans-serif', marginBottom: 10,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {journal.description}
                    </p>
                    <span style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#1e2e48', letterSpacing: '0.08em' }}>
                      {journal.article_count} ta maqola
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWS ─────────────────────────────────────────────── */}
      {latestNews.length > 0 && (
        <section className="above" style={{
          padding: '110px 52px',
          borderTop: '0.5px solid rgba(139,157,195,0.07)',
          maxWidth: 1160, margin: '0 auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 52 }}>
            <div className="s-label rv" style={{ marginBottom: 0, flex: 1 }}>Eng so&apos;nggi yangiliklar</div>
            <Link href="/news" className="btn-ghost" style={{ padding: '10px 24px', fontSize: 9 }}>
              Barchasini ko&apos;rish →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 1, background: 'rgba(139,157,195,0.07)',
          }}>
            {latestNews.map((item, i) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className={`news-card rv`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {item.image ? (
                  <img
                    src={item.image.startsWith('http') ? item.image : `${API}${item.image}`}
                    alt={item.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover', opacity: 0.7 }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 180, background: 'rgba(139,157,195,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={28} color="#1e2e48" />
                  </div>
                )}
                <div style={{ padding: '24px 28px' }}>
                  <h3 className="news-title" style={{
                    fontSize: 15, fontWeight: 400, color: '#c8d8f0',
                    marginBottom: 10, lineHeight: 1.4,
                    fontFamily: 'Georgia, serif',
                    transition: 'color 0.3s',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 12, color: '#2a3a58', lineHeight: 1.65,
                    fontFamily: 'sans-serif', marginBottom: 14,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {item.content}
                  </p>
                  <span style={{ fontFamily: 'sans-serif', fontSize: 9, color: '#1e2e48', letterSpacing: '0.08em' }}>
                    {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── SUBMIT CTA ───────────────────────────────────────── */}
      <section className="above" style={{
        padding: '140px 52px',
        textAlign: 'center',
        borderTop: '0.5px solid rgba(139,157,195,0.07)',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div className="rv" style={{
            fontFamily: 'sans-serif', fontSize: 9,
            letterSpacing: '0.25em', color: '#1e2e48',
            textTransform: 'uppercase', marginBottom: 28,
          }}>
            002
          </div>
          <h2 className="rv2" style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400,
            color: '#c8d8f0', lineHeight: 1.15, marginBottom: 20,
            fontFamily: 'Georgia, serif', letterSpacing: '-0.02em',
          }}>
            Tadqiqotingizni<br />
            <span style={{ fontStyle: 'italic', color: '#8B9DC3' }}>dunyoga taqdim eting</span>
          </h2>
          <p className="rv2" style={{
            fontSize: 14, color: '#3a4e6a', lineHeight: 1.8,
            fontFamily: 'sans-serif', marginBottom: 48,
            transitionDelay: '0.2s',
          }}>
            Ilmiy tadqiqotingizni INTEGRA orqali nashr qiling. Tez ko&apos;rib chiqish va professional tahrir xizmati.
          </p>
          <div className="rv" style={{ transitionDelay: '0.3s' }}>
            <Link href="/submit" className="btn-primary">
              <Upload size={14} /> Maqola topshirish
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLIENT-SIDE SCRIPT: stars + scroll reveals ───────── */}
      {/* 
        Next.js 15 app router: inline script runs after hydration.
        We use dangerouslySetInnerHTML on a <script> tag.
        This is safe — no user input is interpolated.
      */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          // ── STAR FIELD ────────────────────────────────────
          const canvas = document.getElementById('star-canvas');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          let W, H, scrollY = 0;

          function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
          }
          resize();
          window.addEventListener('resize', resize);

          // Three depth layers: far (slow parallax), mid, near (fast parallax)
          const layers = [
            Array.from({length: 180}, () => ({ x: Math.random(), y: Math.random(), r: Math.random()*0.5+0.15, a: Math.random()*Math.PI*2, s: Math.random()*0.002+0.0008, d: 0.04 })),
            Array.from({length:  90}, () => ({ x: Math.random(), y: Math.random(), r: Math.random()*0.9+0.3,  a: Math.random()*Math.PI*2, s: Math.random()*0.003+0.001,  d: 0.1  })),
            Array.from({length:  35}, () => ({ x: Math.random(), y: Math.random(), r: Math.random()*1.4+0.5,  a: Math.random()*Math.PI*2, s: Math.random()*0.005+0.002,  d: 0.2  })),
          ];
          const shoots = [];

          function draw() {
            ctx.clearRect(0, 0, W, H);

            // Stars with parallax
            layers.forEach((layer, li) => {
              layer.forEach(s => {
                s.a += s.s;
                const alpha = 0.1 + 0.65 * Math.abs(Math.sin(s.a));
                const py = ((s.y * H - (scrollY * s.d)) % H + H) % H;
                ctx.beginPath();
                ctx.arc(s.x * W, py, s.r, 0, Math.PI * 2);
                ctx.fillStyle = li === 2
                  ? 'rgba(210,225,255,' + alpha + ')'
                  : li === 1
                    ? 'rgba(150,170,210,' + alpha + ')'
                    : 'rgba(90,110,160,'  + (alpha * 0.65) + ')';
                ctx.fill();
              });
            });

            // Occasional shooting stars
            if (Math.random() < 0.003 && shoots.length < 3) {
              shoots.push({ x: Math.random()*W, y: Math.random()*H*0.5, vx: Math.random()*4+3, vy: Math.random()*2+0.5, life: 1 });
            }
            for (let i = shoots.length - 1; i >= 0; i--) {
              const s = shoots[i];
              const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*20, s.y - s.vy*20);
              g.addColorStop(0, 'rgba(220,235,255,' + (s.life*0.9) + ')');
              g.addColorStop(1, 'rgba(220,235,255,0)');
              ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*20, s.y - s.vy*20);
              ctx.strokeStyle = g; ctx.lineWidth = 0.9; ctx.stroke();
              s.x += s.vx; s.y += s.vy; s.life -= 0.022;
              if (s.life <= 0 || s.x > W || s.y > H) shoots.splice(i, 1);
            }

            requestAnimationFrame(draw);
          }
          requestAnimationFrame(draw);

          // ── SCROLL REVEALS ────────────────────────────────
          function reveal() {
            const vh = window.innerHeight;

            // Standard reveals
            document.querySelectorAll('.rv, .rv2').forEach(el => {
              if (el.getBoundingClientRect().top < vh * 0.9 && !el.classList.contains('in')) {
                el.classList.add('in');
              }
            });

            // Article rows — staggered by data-delay
            document.querySelectorAll('.ar').forEach(el => {
              if (el.getBoundingClientRect().top < vh * 0.92 && !el.classList.contains('in')) {
                const delay = parseInt(el.dataset.delay || '0');
                setTimeout(() => el.classList.add('in'), delay);
              }
            });
          }

          window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            reveal();
          }, { passive: true });

          // Initial check (elements already in viewport on load)
          setTimeout(reveal, 400);
        })();
      `}} />
    </div>
  );
}
