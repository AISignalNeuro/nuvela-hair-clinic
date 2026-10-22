// Small deterministic helpers used by the procedural illustrations.

// mulberry32: small seeded PRNG so drawings are identical on every render.
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

// Cheap 2D value noise built on the seeded PRNG (good enough for patchy hair density).
export function valueNoise(seed, cell = 22) {
  const rand = seededRandom(seed);
  const grid = new Map();
  const at = (ix, iy) => {
    const key = `${ix},${iy}`;
    if (!grid.has(key)) grid.set(key, rand());
    return grid.get(key);
  };
  return (x, y) => {
    const gx = x / cell;
    const gy = y / cell;
    const ix = Math.floor(gx);
    const iy = Math.floor(gy);
    const fx = smoothstep(0, 1, gx - ix);
    const fy = smoothstep(0, 1, gy - iy);
    const top = at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx;
    const bottom = at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx;
    return top * (1 - fy) + bottom * fy;
  };
}
