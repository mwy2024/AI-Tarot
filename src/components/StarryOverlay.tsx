import { useMemo } from 'react';

type Star = {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

function makeStars(count: number, seed = 1): Star[] {
  // Deterministic pseudo-random so SSR/CSR match if ever rendered server-side.
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    top: `${rand() * 100}%`,
    left: `${rand() * 100}%`,
    size: 1 + rand() * 2.2,
    delay: `${rand() * 8}s`,
    duration: `${4.5 + rand() * 5}s`,
    opacity: 0.3 + rand() * 0.7,
  }));
}

interface StarryOverlayProps {
  showMoon?: boolean;
  intensity?: 'low' | 'high';
}

export default function StarryOverlay({ showMoon = false, intensity = 'high' }: StarryOverlayProps) {
  const smallStars = useMemo(() => makeStars(intensity === 'high' ? 50 : 25, 1), [intensity]);
  const bigStars = useMemo(() => makeStars(intensity === 'high' ? 12 : 8, 17), [intensity]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {/* Soft nebula glows */}
      <div
        className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 70%)',
          animation: 'nebula-drift 22s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full opacity-35 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)',
          animation: 'nebula-drift-2 28s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)',
          animation: 'nebula-drift 30s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Moon — only on intro */}
      {showMoon && (
        <div
          className="absolute top-[10%] right-[12%] w-24 h-24 md:w-32 md:h-32 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde68a 35%, #d8b4fe 70%, transparent 100%)',
            boxShadow:
              '0 0 60px 20px rgba(253, 230, 138, 0.25), 0 0 120px 40px rgba(216, 180, 254, 0.18)',
            animation: 'moon-glow 6s ease-in-out infinite alternate',
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay"
            style={{
              background:
                'radial-gradient(circle at 60% 70%, rgba(120,90,160,0.6) 0%, transparent 35%), radial-gradient(circle at 30% 50%, rgba(120,90,160,0.4) 0%, transparent 25%)',
            }}
          />
        </div>
      )}

      {/* Twinkling small stars */}
      {smallStars.map((s, i) => (
        <div
          key={`s-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.8)`,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Bigger glowing stars */}
      {bigStars.map((s, i) => (
        <div
          key={`b-${i}`}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size * 1.6}px`,
            height: `${s.size * 1.6}px`,
            background: 'radial-gradient(circle, #f5d0fe 0%, #d8b4fe 50%, transparent 100%)',
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 6}px rgba(216,180,254,0.7)`,
            animation: `twinkle-slow ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

    </div>
  );
}
