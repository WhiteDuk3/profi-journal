export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { FileText } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

interface Article {
  id: number;
  title: string;
  abstract: string;
  authors_detail?: { id?: number; name: string }[];
  published_date: string;
  category: string;
  cover_image_url?: string;
  journal_name?: string;
  journal_id?: number;
  views?: number;
  access_type?: 'open' | 'closed';
}

// Fixed: was 5000 (5 seconds) which caused timeouts when Render is cold.
// Now matches the rest of the site at 15 seconds.
async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/api/articles/`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div style={{ minHeight: '100vh', background: '#060a14', color: '#dde3f0' }}>
      <style>{`
        /* ── PAGE HEADER ── */
        .articles-header {
          padding: 140px 52px 80px;
          max-width: 1160px;
          margin: 0 auto;
          position: relative;
        }
        .articles-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 52px; right: 52px;
          height: 0.5px;
          background: linear-gradient(90deg, rgba(139,157,195,0.3), transparent);
        }

        /* ── ARTICLE ROW ── */
        .a-row {
          display: grid;
          grid-template-columns: 56px 80px 1fr auto;
          gap: 24px;
          align-items: start;
          padding: 32px 0;
          border-bottom: 0.5px solid rgba(139,157,195,0.06);
          text-decoration: none;
          cursor: pointer;
          /* Scroll reveal — starts invisible, JS adds .in */
          opacity: 0;
          transform: translateX(-16px);
          transition:
            opacity 1.2s ease,
            transform 1.2s ease,
            border-color 0.4s ease;
        }
        .a-row.in { opacity: 1; transform: translateX(0); }

        /* Hover: title illuminates, number brightens, read link appears */
        .a-row:hover { border-bottom-color: rgba(139,157,195,0.2); }
        .a-row:hover .row-title {
          color: #ddeeff;
          text-shadow: 0 0 22px rgba(139,157,195,0.28);
        }
        .a-row:hover .row-num   { color: rgba(139,157,195,0.2); }
        .a-row:hover .row-cat   { color: #5a7090; }
        .a-row:hover .row-read  { opacity: 1; }
        .a-row:hover .row-thumb { opacity: 1; }

        /* ── THUMBNAIL ── */
        .row-thumb {
          width: 80px; height: 80px;
          object-fit: cover;
          border-radius: 1px;
          opacity: 0.6;
          transition: opacity 0.4s;
          flex-shrink: 0;
        }
        .row-thumb-placeholder {
          width: 80px; height: 80px;
          background: rgba(139,157,195,0.05);
          border: 0.5px solid rgba(139,157,195,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── FILTER BAR ── */
        .filter-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }
        .filter-chip {
          font-family: sans-serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 6px 16px;
          border: 0.5px solid rgba(139,157,195,0.15);
          color: #3a4a6a;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 1px;
          text-decoration: none;
        }
        .filter-chip:hover,
        .filter-chip.active {
          border-color: rgba(139,157,195,0.4);
          color: #8B9DC3;
          background: rgba(61,90,138,0.1);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .articles-header { padding: 120px 24px 60px; }
          .articles-header::after { left: 24px; right: 24px; }
          .articles-body { padding: 0 24px 80px; }
          .a-row {
            grid-template-columns: 40px 1fr auto;
            gap: 16px;
          }
          /* Hide thumbnail column on small screens */
          .row-thumb-col { display: none; }
        }
        @media (max-width: 600px) {
          .a-row {
            grid-template-columns: 32px 1fr;
            gap: 12px;
          }
          .row-meta-col { display: none; }
        }
      `}</style>

      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <div className="articles-header">
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'sans-serif', fontSize: 9,
          letterSpacing: '0.26em', color: '#2a3e60',
          textTransform: 'uppercase', marginBottom: 24,
        }}>
          INTEGRA · Ilmiy maqolalar
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          color: '#eaf0ff',
          marginBottom: 16,
          fontFamily: 'Georgia, serif',
        }}>
          Maqolalar
        </h1>

        {/* Count */}
        <p style={{
          fontFamily: 'sans-serif', fontSize: 12,
          letterSpacing: '0.08em', color: '#2a3a58',
          marginBottom: 48,
        }}>
          {articles.length > 0
            ? `${articles.length} ta nashr etilgan ilmiy maqola`
            : 'Maqolalar yuklanmoqda...'}
        </p>

        {/* Filter chips — links for now, can be wired to search params later */}
        <div className="filter-bar">
          {[
            { label: 'Barchasi',      href: '/articles'                      },
            { label: 'Ochiq kirish',  href: '/articles?access=open'          },
            { label: 'Yopiq kirish',  href: '/articles?access=closed'        },
            { label: 'Falsafa',       href: '/articles?category=philosophy'  },
            { label: 'Iqtisodiyot',   href: '/articles?category=economics'   },
            { label: 'IT',            href: '/articles?category=it'          },
            { label: 'Tibbiyot',      href: '/articles?category=medicine'    },
            { label: 'Psixologiya',   href: '/articles?category=psychology'  },
            { label: 'Ta\'lim',       href: '/articles?category=education'   },
          ].map(f => (
            <Link key={f.label} href={f.href} className="filter-chip">
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── ARTICLE LIST ────────────────────────────────────── */}
      <div
        className="articles-body"
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '48px 52px 120px',
        }}
      >
        {articles.length === 0 ? (
          /* Empty state — shown when backend returns nothing */
          <div style={{
            textAlign: 'center', padding: '100px 0',
            color: '#2a3a58', fontFamily: 'sans-serif',
          }}>
            <FileText
              size={36}
              style={{ margin: '0 auto 16px', opacity: 0.2, display: 'block' }}
              color="#8B9DC3"
            />
            <p style={{ fontSize: 13, letterSpacing: '0.08em' }}>
              Hozircha maqolalar mavjud emas.
            </p>
          </div>
        ) : (
          <div style={{ borderTop: '0.5px solid rgba(139,157,195,0.08)' }}>
            {articles.map((article, i) => {
              const authors = article.authors_detail?.map(a => a.name).join(', ') ?? '';
              const imgSrc = article.cover_image_url
                ? (article.cover_image_url.startsWith('http')
                    ? article.cover_image_url
                    : `${API}${article.cover_image_url}`)
                : null;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="a-row"
                  // data-delay staggers each row's entrance by 100ms
                  // so they cascade in rather than all appearing at once
                  {...{ 'data-delay': i * 100 } as any}
                >
                  {/* Row number — very dim, brightens on hover */}
                  <div className="row-num" style={{
                    fontSize: 32, fontWeight: 300,
                    color: 'rgba(139,157,195,0.07)',
                    fontFamily: 'Georgia, serif',
                    lineHeight: 1, paddingTop: 4,
                    transition: 'color 0.4s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Thumbnail or placeholder */}
                  <div className="row-thumb-col">
                    {imgSrc ? (
                      <img src={imgSrc} alt={article.title} className="row-thumb" />
                    ) : (
                      <div className="row-thumb-placeholder">
                        <FileText size={18} color="#1e2e48" />
                      </div>
                    )}
                  </div>

                  {/* Main content */}
                  <div style={{ minWidth: 0 }}>
                    {/* Category + journal */}
                    <div style={{
                      display: 'flex', gap: 12,
                      alignItems: 'center', marginBottom: 10,
                      flexWrap: 'wrap',
                    }}>
                      {article.category && (
                        <span className="row-cat" style={{
                          fontFamily: 'sans-serif', fontSize: 9,
                          letterSpacing: '0.14em', color: '#1e2e48',
                          textTransform: 'uppercase',
                          transition: 'color 0.4s',
                        }}>
                          {article.category}
                        </span>
                      )}
                      {article.journal_name && (
                        <span style={{
                          fontFamily: 'sans-serif', fontSize: 9,
                          letterSpacing: '0.1em', color: '#1a2a40',
                          textTransform: 'uppercase',
                        }}>
                          · {article.journal_name}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="row-title" style={{
                      fontSize: 17, fontWeight: 400,
                      color: '#8494b0', lineHeight: 1.4,
                      marginBottom: 8,
                      fontFamily: 'Georgia, serif',
                      transition: 'color 0.4s, text-shadow 0.4s',
                      // Clamp to 2 lines to keep rows consistent height
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {article.title}
                    </h2>

                    {/* Authors */}
                    {authors && (
                      <div style={{
                        fontFamily: 'sans-serif', fontSize: 10,
                        color: '#1e2e48', marginBottom: 6,
                      }}>
                        {authors}
                      </div>
                    )}

                    {/* Abstract — 1 line preview */}
                    {article.abstract && (
                      <p style={{
                        fontFamily: 'sans-serif', fontSize: 12,
                        color: '#1a2a40', lineHeight: 1.6,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical' as const,
                        marginBottom: 8,
                      }}>
                        {article.abstract}
                      </p>
                    )}

                    {/* Read link — hidden until hover */}
                    <div className="row-read" style={{
                      fontFamily: 'sans-serif', fontSize: 9,
                      letterSpacing: '0.14em', color: '#3D5A8A',
                      textTransform: 'uppercase',
                      opacity: 0, transition: 'opacity 0.4s',
                    }}>
                      Maqolani o&apos;qish →
                    </div>
                  </div>

                  {/* Right meta column — date + access badge */}
                  <div className="row-meta-col" style={{
                    textAlign: 'right', paddingTop: 4,
                    flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: 'sans-serif', fontSize: 9,
                      color: '#1e2e48', letterSpacing: '0.06em',
                      whiteSpace: 'nowrap', marginBottom: 8,
                    }}>
                      {new Date(article.published_date).toLocaleDateString('uz-UZ')}
                    </div>

                    {article.access_type && (
                      <span style={{
                        fontFamily: 'sans-serif', fontSize: 9,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: 100,
                        display: 'inline-block',
                        background: article.access_type === 'open'
                          ? 'rgba(5,150,105,0.15)'
                          : 'rgba(139,157,195,0.1)',
                        color: article.access_type === 'open'
                          ? '#34d399'
                          : '#8B9DC3',
                      }}>
                        {article.access_type === 'open' ? 'Ochiq' : 'Yopiq'}
                      </span>
                    )}

                    {article.views !== undefined && (
                      <div style={{
                        fontFamily: 'sans-serif', fontSize: 9,
                        color: '#1a2a40', marginTop: 8,
                        letterSpacing: '0.06em',
                      }}>
                        {article.views} ko&apos;rishlar
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CLIENT SCRIPT: scroll reveal ────────────────────── */}
      {/*
        Same reveal pattern as homepage — rows slide in from the left
        as they enter the viewport, staggered by data-delay.
        We don't need the star canvas here because it's position:fixed
        from the homepage and persists across navigation in Next.js.
        Wait — actually on inner pages there's no star canvas because
        the homepage canvas is only rendered inside page.tsx.
        We add a lightweight star canvas here too so the background
        isn't just flat black.
      */}
      <canvas
        id="articles-stars"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          // ── STAR FIELD (same as homepage) ─────────────────
          const canvas = document.getElementById('articles-stars');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          let W, H, SY = 0;

          function resize() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
          }
          resize();
          window.addEventListener('resize', resize);

          const layers = [
            Array.from({length:160}, () => ({ x:Math.random(), y:Math.random(), r:Math.random()*0.5+0.15, a:Math.random()*Math.PI*2, s:Math.random()*0.002+0.0008, d:0.04 })),
            Array.from({length:80},  () => ({ x:Math.random(), y:Math.random(), r:Math.random()*0.9+0.3,  a:Math.random()*Math.PI*2, s:Math.random()*0.003+0.001,  d:0.1  })),
            Array.from({length:30},  () => ({ x:Math.random(), y:Math.random(), r:Math.random()*1.4+0.5,  a:Math.random()*Math.PI*2, s:Math.random()*0.005+0.002,  d:0.2  })),
          ];
          const shoots = [];

          function draw() {
            ctx.clearRect(0, 0, W, H);
            layers.forEach((layer, li) => {
              layer.forEach(s => {
                s.a += s.s;
                const alpha = 0.1 + 0.65 * Math.abs(Math.sin(s.a));
                const py = ((s.y * H - (SY * s.d)) % H + H) % H;
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
              const g = ctx.createLinearGradient(s.x, s.y, s.x-s.vx*20, s.y-s.vy*20);
              g.addColorStop(0, 'rgba(220,235,255,' + (s.life*0.9) + ')');
              g.addColorStop(1, 'rgba(220,235,255,0)');
              ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x-s.vx*20, s.y-s.vy*20);
              ctx.strokeStyle = g; ctx.lineWidth = 0.9; ctx.stroke();
              s.x += s.vx; s.y += s.vy; s.life -= 0.022;
              if (s.life <= 0 || s.x > W || s.y > H) shoots.splice(i, 1);
            }
            requestAnimationFrame(draw);
          }
          requestAnimationFrame(draw);

          // ── SCROLL REVEALS ────────────────────────────────
          window.addEventListener('scroll', () => { SY = window.scrollY; reveal(); }, { passive: true });

          function reveal() {
            const vh = window.innerHeight;
            document.querySelectorAll('.a-row').forEach(el => {
              if (el.getBoundingClientRect().top < vh * 0.92 && !el.classList.contains('in')) {
                const delay = parseInt(el.dataset.delay || '0');
                setTimeout(() => el.classList.add('in'), delay);
              }
            });
          }

          // Initial reveal for rows already in viewport on page load
          setTimeout(reveal, 200);
        })();
      `}} />
    </div>
  );
}
