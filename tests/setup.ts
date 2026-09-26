import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export default async function setup() {
  const rootDir = process.cwd();
  const dotAstroStore = path.resolve(rootDir, '.astro', 'data-store.json');
  const cacheStore = path.resolve(rootDir, 'node_modules', '.astro', 'data-store.json');

  let hasValidStore = false;
  for (const storeFile of [dotAstroStore, cacheStore]) {
    if (fs.existsSync(storeFile)) {
      try {
        const content = fs.readFileSync(storeFile, 'utf-8');
        if (content.includes('welcome-to-glyph')) {
          hasValidStore = true;
          break;
        }
      } catch {}
    }
  }

  if (!hasValidStore) {
    console.log(
      '\n[vitest globalSetup] Initializing Content Layer store via bun run build:astro...'
    );
    execSync('bun run build:astro', { stdio: 'inherit' });
  }

  // Astro in serve/vitest mode expects .astro/data-store.json
  // Astro in build mode writes to node_modules/.astro/data-store.json
  // Sync the store file to .astro/data-store.json so Vitest finds it
  if (fs.existsSync(cacheStore)) {
    fs.mkdirSync(path.dirname(dotAstroStore), { recursive: true });
    fs.copyFileSync(cacheStore, dotAstroStore);
  }
}
