// Seeded Pseudo-Random Number Generator (Mulberry32)
// Ensures repeatable, deterministic telemetry streams for sports analytics

export function createPrng(seed = 1337) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMetricValue(prng, min, max, round = false) {
  const val = min + prng() * (max - min);
  return round ? Math.round(val) : parseFloat(val.toFixed(2));
}
