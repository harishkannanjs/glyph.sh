import { glob } from 'astro/loaders';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Formats a slug, folder name, or filename into a human-readable title.
 * Handles kebab-case, snake_case, leading numbering, and common security/dev acronyms.
 */
export function formatTitleFromSlug(slug: string): string {
  // Strip file extension if present
  let clean = slug.replace(/\.(md|mdx)$/i, '');

  // Strip leading numbering prefixes: "01-", "01_", "1-", "part-1-", "part_1_"
  clean = clean.replace(/^(?:part[-_]?)?\d+[-_]/i, '');

  // Replace dashes and underscores with spaces
  clean = clean.replace(/[-_]+/g, ' ').trim();

  // Acronyms and technical terms to preserve exact uppercase/special casing
  const specialWords: Record<string, string> = {
    alpc: 'ALPC',
    ipc: 'IPC',
    dr0: 'DR0',
    dr1: 'DR1',
    dr2: 'DR2',
    dr3: 'DR3',
    dr6: 'DR6',
    dr7: 'DR7',
    pte: 'PTE',
    cpu: 'CPU',
    pid: 'PID',
    api: 'API',
    rpc: 'RPC',
    dll: 'DLL',
    cli: 'CLI',
    toc: 'TOC',
    ui: 'UI',
    x86: 'x86',
    'x86-64': 'x86-64',
    x64: 'x64',
    arm64: 'ARM64',
    rust: 'Rust',
    linux: 'Linux',
    windows: 'Windows',
    hyperv: 'Hyper-V',
    'hyper-v': 'Hyper-V',
    ntoskrnl: 'ntoskrnl.exe',
  };

  const lowerArticles = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in'
  ]);

  return clean
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (specialWords[lower]) return specialWords[lower];
      if (index > 0 && lowerArticles.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extracts numeric part from filename prefix if present.
 * e.g. "01-kernel-alpc-race.mdx" -> 1
 * "part-2-dr7.md" -> 2
 */
export function extractPartNumber(filename: string): number | null {
  const clean = filename.replace(/\.(md|mdx)$/i, '');
  const match = clean.match(/^(?:part[-_]?)?(\d+)(?:[-_]|$)/i);
  if (match) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
}

/**
 * Dynamically infers and augments blog post metadata based on location:
 * - Inside Blogs/series/<seriesName>/... -> dynamically sets series, seriesPart, seriesTotal, and title
 * - Inside Blogs/standalone/... -> dynamically clears series fields, sets standalone title
 * - Missing title, pubDate, description, tags, or draft are safely auto-inferred
 */
export function enhanceBlogData(
  id: string,
  rawFrontmatter: Record<string, any>,
  filePath: string
): Record<string, any> {
  const data = { ...rawFrontmatter };
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedId = id.replace(/\\/g, '/');

  const isSeries = normalizedId.startsWith('series/') || normalizedPath.includes('/Blogs/series/');
  const isStandalone = normalizedId.startsWith('standalone/') || normalizedPath.includes('/Blogs/standalone/');

  const leafFilename = path.basename(filePath);

  // Dynamic Title: frontmatter title takes priority, otherwise derived from filename
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    data.title = formatTitleFromSlug(leafFilename);
  }

  if (isSeries) {
    // Determine series folder name
    let seriesFolderName = '';
    if (normalizedId.startsWith('series/')) {
      const segs = normalizedId.split('/');
      if (segs.length > 1) seriesFolderName = segs[1];
    } else {
      const match = normalizedPath.match(/\/Blogs\/series\/([^/]+)/i);
      if (match) seriesFolderName = match[1];
    }

    // Dynamic Series Name
    if (!data.series) {
      data.series = formatTitleFromSlug(seriesFolderName || 'Series');
    }

    // Scan sibling files in the same series folder to count total and resolve sequence
    const seriesDir = path.dirname(filePath);
    let siblingFiles: string[] = [];
    try {
      if (fs.existsSync(seriesDir)) {
        siblingFiles = fs.readdirSync(seriesDir)
          .filter((f) => /\.(md|mdx)$/i.test(f))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      }
    } catch {}

    const totalSiblings = siblingFiles.length > 0 ? siblingFiles.length : 1;

    // Series Part Number
    if (data.seriesPart === undefined || data.seriesPart === null) {
      const parsedPart = extractPartNumber(leafFilename);
      if (parsedPart !== null) {
        data.seriesPart = parsedPart;
      } else {
        const fileIdx = siblingFiles.indexOf(leafFilename);
        data.seriesPart = fileIdx !== -1 ? fileIdx + 1 : 1;
      }
    }

    // Series Total
    if (data.seriesTotal === undefined || data.seriesTotal === null) {
      data.seriesTotal = Math.max(totalSiblings, data.seriesPart || 1);
    }
  } else if (isStandalone) {
    // Standalone writeup - ensure no dangling series fields so schema refinement passes
    delete data.series;
    delete data.seriesPart;
    delete data.seriesTotal;
  } else {
    // Other root posts - treat as standalone
    delete data.series;
    delete data.seriesPart;
    delete data.seriesTotal;
  }

  // Description fallback
  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    data.description = `Research notes and technical writeup on ${data.title}.`;
  }

  // Publication date fallback
  if (!data.pubDate) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        data.pubDate = stat.birthtime || stat.mtime || new Date();
      } else {
        data.pubDate = new Date();
      }
    } catch {
      data.pubDate = new Date();
    }
  }

  // Tags fallback
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    if (isSeries && data.series) {
      const tagSlug = String(data.series)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      data.tags = [tagSlug || 'series', 'research'];
    } else {
      data.tags = ['research', 'security'];
    }
  }

  // Draft fallback
  data.draft = Boolean(data.draft);

  return data;
}

/**
 * Creates the Astro 5 Content Layer loader that points to `./Blogs` at repository root
 * and dynamically intercepts `parseData` to enrich entries.
 */
export function createBlogLoader() {
  const baseLoader = glob({ pattern: '**/*.{md,mdx}', base: './Blogs' });

  return {
    name: 'dynamic-blogs-root-loader',
    load: async (context: any) => {
      const originalParseData = context.parseData;

      context.parseData = async (props: { id: string; data: Record<string, any>; filePath?: string }) => {
        const enhanced = enhanceBlogData(props.id, props.data, props.filePath || '');
        return originalParseData({
          ...props,
          data: enhanced,
        });
      };

      return baseLoader.load(context);
    },
  };
}
