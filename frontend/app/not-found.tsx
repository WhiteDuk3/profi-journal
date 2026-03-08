import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* Floating background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-navy/5"
          style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-brand-steel/5"
          style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/3 -right-10 w-48 h-48 rounded-full bg-brand-mist/10"
          style={{ animation: 'float 7s ease-in-out infinite 1s' }} />
      </div>

      <div className="relative text-center max-w-lg">

        {/* Illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* Book */}
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Book body */}
            <rect x="40" y="50" width="120" height="110" rx="6" fill="#1C2B4A" />
            <rect x="45" y="55" width="110" height="100" rx="4" fill="#2D4270" />
            {/* Book spine */}
            <rect x="40" y="50" width="15" height="110" rx="4" fill="#1C2B4A" />
            {/* Pages */}
            <rect x="60" y="70" width="70" height="4" rx="2" fill="#8B9DC3" opacity="0.6" />
            <rect x="60" y="82" width="55" height="4" rx="2" fill="#8B9DC3" opacity="0.6" />
            <rect x="60" y="94" width="65" height="4" rx="2" fill="#8B9DC3" opacity="0.6" />
            <rect x="60" y="106" width="45" height="4" rx="2" fill="#8B9DC3" opacity="0.6" />
            {/* Question mark on book */}
            <text x="100" y="145" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="serif">?</text>
            {/* Magnifying glass */}
            <circle cx="148" cy="60" r="22" stroke="#3D5A8A" strokeWidth="5" fill="white" fillOpacity="0.9" />
            <line x1="163" y1="75" x2="175" y2="88" stroke="#3D5A8A" strokeWidth="5" strokeLinecap="round" />
            <circle cx="148" cy="60" r="12" fill="#F4F6FA" />
            <text x="148" y="65" textAnchor="middle" fill="#1C2B4A" fontSize="14" fontWeight="bold">!</text>
          </svg>
          {/* Floating stars */}
          {['top-2 right-4', 'top-8 left-2', 'bottom-8 right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-brand-mist`}
              style={{ animation: `twinkle 2s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
              ✦
            </div>
          ))}
        </div>

        {/* 404 text */}
        <div className="relative mb-4">
          <p className="text-8xl font-black text-brand-navy/10 absolute -top-4 left-1/2 -translate-x-1/2 select-none w-full text-center">
            404
          </p>
          <h1 className="relative text-3xl font-bold text-brand-navy pt-2">
            Sahifa topilmadi!
          </h1>
        </div>

        <p className="text-gray-500 mb-2 text-base">
          Siz qidirayotgan sahifa yo'qolgan yoki ko'chirilgan.
        </p>
        <p className="text-brand-mist text-sm mb-8">
          Balki maqola o'chirilgandir? Yoki URL xato kiritilgandir? 🤔
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-brand-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-mid transition hover:-translate-y-0.5 transform shadow-md"
          >
            🏠 Bosh sahifaga
          </Link>
          <Link
            href="/articles"
            className="bg-white text-brand-navy px-6 py-3 rounded-xl font-medium border border-brand-mist/30 hover:border-brand-steel hover:shadow-md transition hover:-translate-y-0.5 transform"
          >
            📚 Maqolalar
          </Link>
          <Link
            href="/search"
            className="bg-white text-brand-navy px-6 py-3 rounded-xl font-medium border border-brand-mist/30 hover:border-brand-steel hover:shadow-md transition hover:-translate-y-0.5 transform"
          >
            🔍 Qidirish
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
