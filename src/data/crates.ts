// Per-crate download counts for the rustkit-ai published crates.
// Fetched at build time from the crates.io API, with a baked-in per-crate
// fallback so the build never breaks (and a single failing crate doesn't
// zero out) if crates.io is unreachable. Refresh the fallbacks periodically.

// Last known good all-time downloads per crate (2026-07-06).
const FALLBACK: Record<string, number> = {
  'semtree-core': 310,
  'semtree-embed': 224,
  'semtree-parse': 172,
  'semtree-store': 171,
  'semtree-rag': 119,
  'semtree-cli': 20,
  semstore: 79,
  tersify: 133,
  aimemo: 87,
  trimcp: 30,
  mcpkill: 28,
};

const CRATE_NAMES = Object.keys(FALLBACK);

let cache: Record<string, number> | undefined;

export async function getCratesDownloadMap(): Promise<Record<string, number>> {
  if (cache !== undefined) return cache;
  const entries = await Promise.all(
    CRATE_NAMES.map(async (name): Promise<[string, number]> => {
      try {
        const r = await fetch(`https://crates.io/api/v1/crates/${name}`, {
          headers: { 'User-Agent': 'djamel-bougouffa.com portfolio build (dbougouffa@gmail.com)' },
        });
        if (!r.ok) return [name, FALLBACK[name] ?? 0];
        const d = await r.json();
        const n = d?.crate?.downloads;
        return [name, typeof n === 'number' ? n : FALLBACK[name] ?? 0];
      } catch {
        return [name, FALLBACK[name] ?? 0];
      }
    })
  );
  cache = Object.fromEntries(entries);
  return cache;
}

/** Sum of all-time downloads for a given set of crate names. */
export function sumDownloads(map: Record<string, number>, names: string[]): number {
  return names.reduce((total, name) => total + (map[name] ?? 0), 0);
}
