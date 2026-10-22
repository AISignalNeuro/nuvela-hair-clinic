// Stylised Istanbul skyline: Galata Tower, the Bosphorus Bridge and a mosque with minarets.
// Pure SVG shapes drawn with currentColor so it can be tinted from CSS.
function Minaret({ x, top, base = 200, width = 7 }) {
  return (
    <g>
      <rect x={x - width / 2} y={top} width={width} height={base - top} />
      <rect x={x - width / 2 - 2.5} y={top + (base - top) * 0.32} width={width + 5} height="3" />
      <rect x={x - width / 2 - 2} y={top + (base - top) * 0.55} width={width + 4} height="3" />
      <path d={`M${x - width / 2} ${top}L${x} ${top - 26}L${x + width / 2} ${top}Z`} />
    </g>
  );
}

export default function IstanbulSkyline({ className = "" }) {
  return (
    <svg className={`skyline ${className}`} viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" fill="currentColor" aria-hidden="true">
      {/* distant hills & buildings */}
      <path
        opacity="0.35"
        d="M0 200V150l40-8 30 10 40-18 55 14 30-6 60 12 45-20 70 18 50-10 60 16 40-6 80 14 55-18 60 12 45-8 70 16 60-14 50 10 70-12 60 14 45-8 60 12 45-6 60 12 50-8V200Z"
      />
      {/* Galata tower */}
      <g>
        <rect x="160" y="88" width="42" height="112" />
        <rect x="152" y="78" width="58" height="12" rx="2" />
        <path d="M152 78L181 24L210 78Z" />
        <rect x="179.5" y="8" width="3" height="18" />
        <rect x="130" y="150" width="30" height="50" />
        <rect x="202" y="140" width="38" height="60" />
      </g>
      {/* Bosphorus bridge */}
      <g opacity="0.9">
        <rect x="455" y="92" width="11" height="108" />
        <rect x="838" y="92" width="11" height="108" />
        <rect x="380" y="168" width="540" height="6" />
        <path d="M380 168Q418 120 460 94Q651 196 843 94Q885 120 920 168" fill="none" stroke="currentColor" strokeWidth="3" />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 482 + i * 22;
          const t = (x - 460) / 383;
          // Point on the quadratic cable curve (control point y = 196).
          const y = 94 + 204 * t * (1 - t);
          return <rect key={i} x={x} y={y} width="1.4" height={168 - y} />;
        })}
      </g>
      {/* Mosque (Sultanahmet-inspired) */}
      <g>
        <rect x="1010" y="150" width="290" height="50" />
        <path d="M1095 150a60 60 0 01120 0Z" />
        <rect x="1150" y="70" width="10" height="12" />
        <path d="M1150 70h10l-5-16Z" />
        <path d="M1050 158a38 38 0 0176 0Z" />
        <path d="M1184 158a38 38 0 0176 0Z" />
        <path d="M1028 166a20 20 0 0140 0Z" />
        <path d="M1242 166a20 20 0 0140 0Z" />
        <rect x="1140" y="88" width="30" height="8" />
        <Minaret x={996} top={66} />
        <Minaret x={1032} top={86} />
        <Minaret x={1278} top={86} />
        <Minaret x={1314} top={66} />
      </g>
      {/* small mosque on the right */}
      <g opacity="0.85">
        <rect x="1360" y="168" width="80" height="32" />
        <path d="M1372 168a28 28 0 0156 0Z" />
        <Minaret x={1352} top={110} width={6} />
      </g>
      {/* seagulls */}
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55">
        <path d="M600 60q8-8 16 0q8-8 16 0" />
        <path d="M660 40q6-6 12 0q6-6 12 0" />
        <path d="M1220 30q6-6 12 0q6-6 12 0" />
      </g>
      {/* water */}
      <rect x="0" y="200" width="1440" height="40" opacity="0.5" />
      <g opacity="0.35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M120 214h80M260 222h120M520 212h90M700 226h140M980 216h110M1180 224h130M1340 212h70" />
      </g>
    </svg>
  );
}
