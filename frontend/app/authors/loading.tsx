export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
      {/* Pulsing logo circle */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer ring */}
        <div className="absolute w-24 h-24 rounded-full border-2 border-brand-mist/30 animate-ping" />
        {/* Middle ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-brand-steel/40"
          style={{ animation: 'spin 2s linear infinite' }} />
        {/* Inner logo circle */}
        <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center shadow-lg"
          style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          <span className="text-white font-bold text-sm tracking-tight">I</span>
        </div>
      </div>

      {/* Brand name */}
      <p className="text-brand-navy font-semibold text-lg tracking-widest uppercase mb-1">
        INTEGRA
      </p>
      <p className="text-brand-mist text-xs tracking-widest">
        Yuklanmoqda...
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-steel"
            style={{
              animation: `bounce 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
