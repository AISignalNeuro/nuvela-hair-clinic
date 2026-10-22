import { memo, useId, useMemo } from "react";
import { seededRandom, smoothstep, valueNoise } from "../../utils/random.js";

/*
  Procedural before/after illustration.
  Instead of real patient photos (privacy!) every case is drawn from its own
  parameters: variant (scalp | female | beard | brow), severity 1–5 and a seed.
  Thousands of hair strands are merged into a single <path> to keep the DOM light.
*/

const W = 200;
const H = 240;
const f = (n) => Math.round(n * 10) / 10;

function strand(x, y, angle, len) {
  return `M${f(x)} ${f(y)}l${f(Math.cos(angle) * len)} ${f(Math.sin(angle) * len)}`;
}

// --- Top-down male scalp ----------------------------------------------------
function buildScalp({ stage, severity, seed }) {
  const rand = seededRandom(seed * 97 + (stage === "after" ? 7 : 3));
  const noise = valueNoise(seed);
  const cx = 100;
  const cy = 128;
  const rx = 70;
  const ry = 90;
  const whorl = { x: 100, y: 160 };
  const s = stage === "after" ? 0 : severity;
  const dark = [];
  const light = [];
  const hairlineAt = (u) => {
    let h = -0.62 + 0.2 * u * u;
    if (s) h += s * 0.07 + s * 0.065 * smoothstep(0.12, 0.62, Math.abs(u));
    return h;
  };

  for (let gy = 30; gy < 224; gy += 4) {
    for (let gx = 28; gx < 172; gx += 4) {
      const x = gx + (rand() - 0.5) * 3.6;
      const y = gy + (rand() - 0.5) * 3.6;
      const u = (x - cx) / rx;
      const v = (y - cy) / ry;
      if (u * u + v * v > 0.97) continue;

      const au = Math.abs(u);
      const hairline = hairlineAt(u);
      if (v < hairline - 0.05) continue;

      let density = stage === "after" ? 0.93 : 0.9;
      if (v < hairline) density = 0.32; // soft transition zone of single hairs

      if (s) {
        const crownR = s >= 3 ? 0.065 * s : 0;
        if (crownR) {
          const dist = Math.hypot(u, (v - 0.36) * 1.15);
          density *= smoothstep(crownR * 0.55, crownR * 1.35, dist);
        }
        if (s >= 4 && v < 0.32 && au < 0.52) density *= 0.18 + 0.1 * (5 - s);
        density *= 0.62 + 0.38 * noise(x, y);
      }

      // Donor horseshoe (sides and back) is always dense.
      const donor = Math.max(smoothstep(0.66, 0.8, au), smoothstep(0.55, 0.7, v));
      density = density * (1 - donor) + 0.95 * donor;

      if (rand() > density) continue;
      // Hair flows outward from the crown whorl; it lies flatter (shorter strokes) near the edges.
      const angle = Math.atan2(y - whorl.y, x - whorl.x) + (rand() - 0.5) * 0.5;
      const len = 4.2 + rand() * 2.8;
      (rand() < 0.24 ? light : dark).push(strand(x, y, angle, len));
      if (density > 0.7 && rand() < 0.5) dark.push(strand(x + 1.4, y + 1.1, angle + (rand() - 0.5) * 0.3, len * 0.85));
    }
  }

  // Polygon of the hair-bearing region (below the hairline) for the soft "hair mass" underlay.
  const pts = [];
  for (let x = 26; x <= 174; x += 4) pts.push(`${x} ${f(cy + ry * hairlineAt((x - cx) / rx))}`);
  const mass = `M${pts.join("L")}L174 232L26 232Z`;
  return { dark: dark.join(""), light: light.join(""), mass };
}

// --- Top-down female scalp with part line -----------------------------------
function buildFemale({ stage, severity, seed }) {
  const rand = seededRandom(seed * 131 + (stage === "after" ? 11 : 5));
  const noise = valueNoise(seed + 3, 18);
  const cx = 100;
  const cy = 128;
  const rx = 70;
  const ry = 90;
  const s = stage === "after" ? 0 : severity;
  const dark = [];
  const light = [];

  for (let gy = 30; gy < 222; gy += 4.4) {
    for (let gx = 28; gx < 172; gx += 4.4) {
      const x = gx + (rand() - 0.5) * 3.6;
      const y = gy + (rand() - 0.5) * 3.6;
      const u = (x - cx) / rx;
      const v = (y - cy) / ry;
      if (u * u + v * v > 0.97) continue;
      const hairline = -0.66 + 0.18 * u * u;
      if (v < hairline) continue;

      const au = Math.abs(u);
      const partZone = v < 0.25;
      const gap = partZone ? (s ? 0.028 * s : 0.022) : 0;
      if (au < gap) continue;

      let density = 0.93;
      if (s && partZone) {
        const thinning = 1 - smoothstep(0.02, 0.3 + 0.05 * s, au);
        density -= thinning * 0.15 * s;
        density *= 0.7 + 0.3 * noise(x, y);
      }
      if (rand() > Math.max(0.05, density)) continue;

      // Hair falls away from the part line.
      const side = u < 0 ? Math.PI : 0;
      const tilt = u < 0 ? -0.35 : 0.35;
      const angle = side + tilt * (partZone ? 1 : 2.2) + (rand() - 0.5) * 0.4 + (v > 0.3 ? Math.sign(u || 1) * 0.7 : 0);
      const len = 8 + rand() * 4.5;
      (rand() < 0.25 ? light : dark).push(strand(x, y, angle, len));
    }
  }
  const pts = [];
  for (let x = 26; x <= 174; x += 4) {
    const u = (x - cx) / rx;
    pts.push(`${x} ${f(cy + ry * (-0.66 + 0.18 * u * u))}`);
  }
  return { dark: dark.join(""), light: light.join(""), mass: `M${pts.join("L")}L174 232L26 232Z` };
}

// --- Front view beard -------------------------------------------------------
function buildBeard({ stage, severity, seed }) {
  const rand = seededRandom(seed * 61 + (stage === "after" ? 13 : 2));
  const noise = valueNoise(seed + 9, 16);
  const s = stage === "after" ? 0 : severity;
  const dark = [];
  const light = [];

  const insideFace = (x, y) => {
    const halfWidth = y < 110 ? 70 : 70 * Math.sqrt(Math.max(0, 1 - ((y - 110) / 112) ** 2));
    return Math.abs(x - 100) < halfWidth - 2;
  };

  for (let gy = 52; gy < 224; gy += 3.2) {
    for (let gx = 30; gx < 172; gx += 3.2) {
      const x = gx + (rand() - 0.5) * 2.8;
      const y = gy + (rand() - 0.5) * 2.8;
      if (!insideFace(x, y)) continue;
      const dx = x - 100;
      const cheekLine = 122 - 0.0125 * dx * dx;
      const isMoustache = Math.abs(dx) < 36 && y > 112 && y < 133;
      const onLips = Math.abs(dx) < 30 && y >= 133 && y < 157;
      if (onLips) continue;
      if (y < cheekLine && !isMoustache) continue;
      if (Math.abs(dx) < 20 && y < 112) continue;

      let density = 0.92;
      if (s) {
        const cheek = Math.abs(dx) > 38 && y < 178;
        const base = cheek ? 0.55 - s * 0.1 : isMoustache ? 0.62 - s * 0.06 : 0.8 - s * 0.07;
        density = Math.max(0.03, base) * (0.45 + 0.9 * noise(x, y));
      }
      if (rand() > density) continue;

      const angle = isMoustache
        ? Math.PI / 2 + Math.sign(dx || 1) * (0.55 + rand() * 0.35)
        : Math.PI / 2 + dx * 0.009 + (rand() - 0.5) * 0.45;
      const len = isMoustache ? 5 + rand() * 2.5 : 5.5 + rand() * 3;
      (rand() < 0.2 ? light : dark).push(strand(x, y, angle, len));
    }
  }

  // Beard region outline (face edge + cheek line + moustache) for the shading underlay.
  const outer = [];
  for (let y = 62; y <= 222; y += 6) {
    const half = y < 110 ? 68 : 68 * Math.sqrt(Math.max(0, 1 - ((y - 110) / 112) ** 2));
    outer.push([100 + half, y]);
  }
  // Walk the inner edge left → right so the polygon closes without crossing itself.
  const cheek = (x) => 122 - 0.0125 * (x - 100) ** 2;
  const inner = [];
  for (let x = 34; x <= 64; x += 5) inner.push([x, cheek(x)]);
  inner.push([64, 112], [136, 112]);
  for (let x = 136; x <= 166; x += 5) inner.push([x, cheek(x)]);
  const left = outer.map(([x, y]) => [200 - x, y]).reverse();
  const poly = [...outer, ...left, ...inner].map(([x, y]) => `${f(x)} ${f(y)}`);
  return { dark: dark.join(""), light: light.join(""), mass: `M${poly.join("L")}Z` };
}

// --- Eyebrow close-up --------------------------------------------------------
function buildBrow({ stage, severity, seed }) {
  const rand = seededRandom(seed * 41 + (stage === "after" ? 17 : 1));
  const noise = valueNoise(seed + 5, 10);
  const s = stage === "after" ? 0 : severity;
  const dark = [];
  const light = [];

  for (let t = 0; t <= 1; t += 0.0042) {
    const cxp = 30 + 148 * t;
    const cyp = 104 - 30 * Math.sin(Math.PI * Math.min(1, t * 0.82 + 0.05));
    const thick = 17 - 12.5 * t ** 1.2;
    const strandsHere = 3;
    for (let k = 0; k < strandsHere; k++) {
      const w = (rand() * 2 - 1) * (thick / 2);
      const x = cxp + (rand() - 0.5) * 2;
      const y = cyp + w;
      let density = 0.88;
      if (s) {
        const tailLoss = smoothstep(0.45, 0.85, t) * (0.12 * s);
        density = Math.max(0.04, 0.62 - 0.08 * s - tailLoss) * (0.5 + noise(x, y));
      }
      if (rand() > density) continue;
      const head = 1 - smoothstep(0.04, 0.26, t);
      const along = -0.32 + t * 0.62;
      const angle = head * (-1.35 + (rand() - 0.5) * 0.3) + (1 - head) * (along + (rand() - 0.5) * 0.35);
      const len = 8 + rand() * 4;
      (rand() < 0.25 ? light : dark).push(strand(x, y + 3, angle, len));
    }
  }
  return { dark: dark.join(""), light: light.join("") };
}

const BUILDERS = { scalp: buildScalp, female: buildFemale, beard: buildBeard, brow: buildBrow };

function ScalpArt({ variant = "scalp", stage = "after", severity = 3, seed = 1, title, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const strands = useMemo(
    () => (BUILDERS[variant] ?? buildScalp)({ stage, severity, seed }),
    [variant, stage, severity, seed],
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`scalp-art ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EAF4F2" />
          <stop offset="1" stopColor="#D2E5E2" />
        </linearGradient>
        <radialGradient id={`skin-${uid}`} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#F4D9C6" />
          <stop offset="0.7" stopColor="#E5B898" />
          <stop offset="1" stopColor="#CF9A7A" />
        </radialGradient>
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2D4BF" />
          <stop offset="1" stopColor="#DDA986" />
        </linearGradient>
        <radialGradient id={`mass-${uid}`} cx="0.5" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#4A3426" />
          <stop offset="1" stopColor="#2C1F18" />
        </radialGradient>
        <clipPath id={`head-${uid}`}>
          <ellipse cx="100" cy="128" rx="70" ry="90" />
        </clipPath>
        <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        {/* "Before" masks: hide the hair mass where hair is thin (crown/top or along the part). */}
        <mask id={`thin-${uid}`}>
          <rect width={W} height={H} fill="#fff" />
          {variant === "female" ? (
            <ellipse cx="100" cy="98" rx={10 + severity * 6} ry="66" fill="#000" filter={`url(#soft-${uid})`} />
          ) : (
            <ellipse cx="100" cy={110 + severity * 2} rx={30 + severity * 5} ry={44 + severity * 6} fill="#000" filter={`url(#soft-${uid})`} />
          )}
        </mask>
      </defs>
      <rect width={W} height={H} fill={`url(#bg-${uid})`} />

      {(variant === "scalp" || variant === "female") && (
        <g>
          <ellipse cx="100" cy="226" rx="62" ry="10" fill="#0B1B2B" opacity="0.08" />
          <ellipse cx="31" cy="140" rx="8" ry="16" fill="#D9A684" />
          <ellipse cx="169" cy="140" rx="8" ry="16" fill="#D9A684" />
          <ellipse cx="100" cy="128" rx="70" ry="90" fill={`url(#skin-${uid})`} />
          <ellipse cx="100" cy="44" rx="10" ry="5" fill="#E8BFA2" opacity="0.7" />
          {strands.mass && (
            <path
              d={strands.mass}
              clipPath={`url(#head-${uid})`}
              mask={stage === "before" ? `url(#thin-${uid})` : undefined}
              fill={`url(#mass-${uid})`}
              opacity={stage === "before" ? 0.42 : 0.58}
            />
          )}
        </g>
      )}

      {variant === "beard" && (
        <g>
          <path d="M28 0H172L172 110Q170 178 130 210Q100 234 70 210Q30 178 28 110Z" fill={`url(#face-${uid})`} />
          <path d="M88 52Q86 84 81 92Q91 101 100 99Q109 101 119 92Q114 84 112 52" fill="none" stroke="#B9826A" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
          {strands.mass && (
            <path d={strands.mass} fill={`url(#mass-${uid})`} opacity={stage === "before" ? 0.12 + 0.04 * (5 - severity) : 0.5} filter={`url(#soft-${uid})`} />
          )}
          <path d="M70 142Q86 132 100 137Q114 132 130 142Q114 149 100 148Q86 149 70 142Z" fill="#C4806C" />
          <path d="M72 143Q100 163 128 143Q100 152 72 143Z" fill="#B06B5A" />
        </g>
      )}

      {variant === "brow" && (
        <g>
          <rect width={W} height={H} fill={`url(#face-${uid})`} />
          <path d="M38 158Q100 112 162 158Q100 192 38 158Z" fill="#FBF6F2" stroke="#9E6E57" strokeWidth="1.5" />
          <circle cx="100" cy="156" r="18" fill="#5C3D2D" />
          <circle cx="100" cy="156" r="8.5" fill="#1D130E" />
          <circle cx="106" cy="150" r="3.2" fill="#FFFFFF" opacity="0.85" />
          <path d="M44 146Q100 102 156 146" fill="none" stroke="#B07E66" strokeWidth="1.3" opacity="0.45" />
        </g>
      )}

      <g clipPath={variant === "scalp" || variant === "female" ? `url(#head-${uid})` : undefined}>
        <path d={strands.dark} stroke="#2C1F18" strokeWidth={variant === "brow" ? 1.25 : 1.05} strokeLinecap="round" fill="none" opacity="0.9" />
        <path d={strands.light} stroke="#7A5A45" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.85" />
      </g>
    </svg>
  );
}

export default memo(ScalpArt);
