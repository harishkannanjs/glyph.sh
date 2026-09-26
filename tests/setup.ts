import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export default async function setup() {
  const storePath = path.resolve(process.cwd(), '.astro', 'data-store.json');
  let needsBuild = !fs.existsSync(storePath);
  if (!needsBuild) {
    try {
      const content = fs.readFileSync(storePath, 'utf-8');
      if (!content.includes('welcome-to-glyph')) {
        needsBuild = true;
      }
    } catch {
      needsBuild = true;
    }
  }

  if (needsBuild) {
    console.log(
      '\n[vitest globalSetup] Initializing Content Layer store via bun run build:astro...'
    );
    execSync('bun run build:astro', { stdio: 'inherit' });
  }
}
