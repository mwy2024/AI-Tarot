import { memo } from 'react';

const CX = 250, CY = 250;

function polar(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function circlePath(r: number) {
  return `M ${CX} ${CY - r} A ${r} ${r} 0 1 1 ${CX - 0.001} ${CY - r}`;
}

const s = (o: number) => `rgba(147,51,234,${o})`;
const t = (o: number) => `rgba(196,181,253,${o})`;

const RUNES = ['ψ','φ','ϑ','Ω','Σ','Δ','Λ','Ξ','Π','ρ','σ','τ','υ','χ','ζ','η','θ','κ','μ','ν','ξ','β','γ','δ'];
const PLANETS = ['☉','☽','♂','☿','♃','♀','♄'];
const METALS   = ['GOLD','SILVER','IRON','MERCURY','TIN','COPPER','LEAD'];
const DAYS     = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
const ZODIAC   = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

export default memo(function MagicCircle({ className }: { className?: string }) {
  // Outer tick marks (72 ticks, every 5°)
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const long = i % 6 === 0;
    return { p1: polar(long ? 228 : 233, i * 5), p2: polar(240, i * 5), long };
  });

  // 7-section radial dividers (planets)
  const dividers = Array.from({ length: 7 }, (_, i) => ({
    inner: polar(108, (i * 360) / 7),
    outer: polar(222, (i * 360) / 7),
  }));

  // Planet symbol positions (midpoint of each section)
  const planets = Array.from({ length: 7 }, (_, i) => {
    const angle = (i * 360) / 7 + 180 / 7;
    return { sym: PLANETS[i], metal: METALS[i], day: DAYS[i], pos: polar(193, angle) };
  });

  // Zodiac at r=122
  const zodiac = Array.from({ length: 12 }, (_, i) => ({
    sym: ZODIAC[i],
    pos: polar(122, i * 30),
  }));

  // Inner hexagram (two interlocked triangles)
  const hex = Array.from({ length: 6 }, (_, i) => polar(68, i * 60));
  const tri1 = `M ${hex[0].x},${hex[0].y} L ${hex[2].x},${hex[2].y} L ${hex[4].x},${hex[4].y} Z`;
  const tri2 = `M ${hex[1].x},${hex[1].y} L ${hex[3].x},${hex[3].y} L ${hex[5].x},${hex[5].y} Z`;

  // 8 inner sub-dividers inside zodiac ring (every 45°)
  const innerDividers = Array.from({ length: 8 }, (_, i) => ({
    p1: polar(30, i * 45),
    p2: polar(108, i * 45),
  }));

  return (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <path id="mc-207" d={circlePath(207)} />
        <path id="mc-157" d={circlePath(157)} />
        <radialGradient id="mc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#3b0a8a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0a0220" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx={CX} cy={CY} r="249" fill="url(#mc-glow)" />

      {/* Outer boundary */}
      <circle cx={CX} cy={CY} r="244" fill="none" stroke={s(0.5)} strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r="241" fill="none" stroke={s(0.2)} strokeWidth="0.5" />

      {/* Tick marks */}
      {ticks.map((tk, i) => (
        <line key={i} x1={tk.p1.x} y1={tk.p1.y} x2={tk.p2.x} y2={tk.p2.y}
          stroke={s(tk.long ? 0.55 : 0.28)} strokeWidth={tk.long ? 1 : 0.5} />
      ))}

      {/* Rune letters on outer edge */}
      {RUNES.map((r, i) => {
        const p = polar(235, i * 15);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fill={t(0.45)} fontSize="9" fontFamily="serif"
            transform={`rotate(${i * 15}, ${p.x}, ${p.y})`}>
            {r}
          </text>
        );
      })}

      {/* Planet zone ring borders */}
      <circle cx={CX} cy={CY} r="222" fill="none" stroke={s(0.35)} strokeWidth="0.8" />
      <circle cx={CX} cy={CY} r="218" fill="none" stroke={s(0.2)}  strokeWidth="0.4" strokeDasharray="3,5" />

      {/* Circular text: metals · days */}
      <text fill={t(0.42)} fontSize="7.2" fontFamily="serif" letterSpacing="1.2">
        <textPath href="#mc-207" startOffset="1%">
          {METALS.map((m, i) => `${m} · ${DAYS[i]}  ·  `).join('')}
        </textPath>
      </text>

      {/* Section radial dividers */}
      {dividers.map((d, i) => (
        <line key={i} x1={d.inner.x} y1={d.inner.y} x2={d.outer.x} y2={d.outer.y}
          stroke={s(0.3)} strokeWidth="0.7" />
      ))}

      {/* Planet symbols with small boxes */}
      {planets.map((p, i) => (
        <g key={i}>
          <rect x={p.pos.x - 11} y={p.pos.y - 11} width="22" height="22"
            fill="none" stroke={s(0.3)} strokeWidth="0.6" />
          <text x={p.pos.x} y={p.pos.y} textAnchor="middle" dominantBaseline="central"
            fill={t(0.7)} fontSize="14" fontFamily="serif">
            {p.sym}
          </text>
        </g>
      ))}

      {/* Element zone rings */}
      <circle cx={CX} cy={CY} r="168" fill="none" stroke={s(0.3)} strokeWidth="0.8" />
      <circle cx={CX} cy={CY} r="140" fill="none" stroke={s(0.25)} strokeWidth="0.6" />

      {/* Circular text: elements + directions */}
      <text fill={t(0.38)} fontSize="6.8" fontFamily="serif" letterSpacing="2.5">
        <textPath href="#mc-157" startOffset="0%">
          FIRE · EAST · WATER · NORTH · AIR · WEST · EARTH · SOUTH ·
        </textPath>
      </text>

      {/* Alchemical symbols at 8 cardinal/diagonal positions r=152 */}
      {['△','▽','☲','☵','☴','☳','⊕','✦'].map((sym, i) => {
        const p = polar(152, i * 45 + 22.5);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fill={t(0.45)} fontSize="9" fontFamily="serif">
            {sym}
          </text>
        );
      })}

      {/* Zodiac ring */}
      <circle cx={CX} cy={CY} r="136" fill="none" stroke={s(0.3)} strokeWidth="0.8" />
      <circle cx={CX} cy={CY} r="108" fill="none" stroke={s(0.25)} strokeWidth="0.6" />

      {zodiac.map((z, i) => (
        <text key={i} x={z.pos.x} y={z.pos.y} textAnchor="middle" dominantBaseline="central"
          fill={t(0.55)} fontSize="12" fontFamily="serif">
          {z.sym}
        </text>
      ))}

      {/* Inner dividers */}
      {innerDividers.map((d, i) => (
        <line key={i} x1={d.p1.x} y1={d.p1.y} x2={d.p2.x} y2={d.p2.y}
          stroke={s(0.2)} strokeWidth="0.5" />
      ))}

      {/* Inner hexagram */}
      <circle cx={CX} cy={CY} r="86"  fill="none" stroke={s(0.3)} strokeWidth="0.7" />
      <path d={tri1} fill="none" stroke={s(0.4)} strokeWidth="0.9" />
      <path d={tri2} fill="none" stroke={s(0.4)} strokeWidth="0.9" />
      <circle cx={CX} cy={CY} r="32"  fill="none" stroke={s(0.3)} strokeWidth="0.7" />
      <circle cx={CX} cy={CY} r="18"  fill="none" stroke={s(0.2)} strokeWidth="0.5" />

      {/* Center */}
      <circle cx={CX} cy={CY} r="6" fill={s(0.5)} />
      <circle cx={CX} cy={CY} r="3" fill={s(0.8)} />
    </svg>
  );
});
