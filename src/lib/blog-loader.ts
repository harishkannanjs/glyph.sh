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

  const isSeries = normalizedId.toLowerCase().startsWith('series/') || /\/blogs\/series\//i.test(normalizedPath);
  const isStandalone = normalizedId.toLowerCase().startsWith('standalone/') || /\/blogs\/standalone\//i.test(normalizedPath);

  const leafFilename = path.basename(filePath);

  // Read file content once for metadata extraction & word count
  let contentWithoutFrontmatter = '';
  try {
    if (filePath && fs.existsSync(filePath)) {
      const rawFile = fs.readFileSync(filePath, 'utf-8');
      contentWithoutFrontmatter = rawFile.replace(/^---[\s\S]*?---/, '');
    }
  } catch {}

  // Dynamic Title: frontmatter title takes priority, then leading markdown H1, then filename
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    const h1Match = contentWithoutFrontmatter.match(/^#\s+(.+)$/m);
    if (h1Match && h1Match[1].trim()) {
      data.title = h1Match[1].trim();
    } else {
      data.title = formatTitleFromSlug(leafFilename);
    }
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

    // Series Part Number: Check frontmatter, episode tags, filename prefix, or file index
    if (data.seriesPart === undefined || data.seriesPart === null) {
      if (Array.isArray(data.tags)) {
        const epTag = data.tags.find((t: any) => typeof t === 'string' && /^episode-\d+$/i.test(t));
        if (epTag) {
          const parsed = parseInt(epTag.replace(/^episode-/i, ''), 10);
          if (!isNaN(parsed) && parsed > 0) {
            data.seriesPart = parsed;
          }
        }
      }
    }

    if (data.seriesPart === undefined || data.seriesPart === null) {
      const parsedPart = extractPartNumber(leafFilename);
      if (parsedPart !== null) {
        data.seriesPart = parsedPart;
      } else {
        const fileIdx = siblingFiles.indexOf(leafFilename);
        data.seriesPart = fileIdx !== -1 ? fileIdx + 1 : 1;
      }
    }

    // Ensure episode tag is present in data.tags
    if (data.seriesPart !== undefined && data.seriesPart !== null) {
      const epTag = `episode-${data.seriesPart}`;
      if (Array.isArray(data.tags)) {
        if (!data.tags.includes(epTag)) {
          data.tags.push(epTag);
        }
      } else {
        data.tags = [epTag];
      }
    }

    // Determine max part and max seriesTotal across all files in this series folder
    let maxSiblingPart = totalSiblings;
    let maxExplicitTotal = 0;
    for (const sib of siblingFiles) {
      try {
        const sibPath = path.join(seriesDir, sib);
        const rawContent = fs.readFileSync(sibPath, 'utf-8');
        const match = rawContent.match(/seriesPart:\s*(\d+)/i) || rawContent.match(/episode-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSiblingPart) maxSiblingPart = num;
        }
        const totalMatch = rawContent.match(/seriesTotal:\s*(\d+)/i);
        if (totalMatch) {
          const tNum = parseInt(totalMatch[1], 10);
          if (!isNaN(tNum) && tNum > maxExplicitTotal) maxExplicitTotal = tNum;
        }
      } catch {}
    }

    // Series Total: respects explicit user specification, or highest known episode count
    const explicitTotal = (typeof data.seriesTotal === 'number' && data.seriesTotal > 0) ? data.seriesTotal : maxExplicitTotal;
    data.seriesTotal = Math.max(explicitTotal || 0, totalSiblings, maxSiblingPart, data.seriesPart || 1);
  } else if (isStandalone) {
    // Standalone writeup - ensure no dangling series fields so schema refinement passes
    delete data.series;
    delete data.seriesPart;
    delete data.seriesTotal;
  } else {
    // Other root posts - if series explicitly specified in frontmatter, ensure part & total exist
    if (data.series) {
      data.seriesPart = typeof data.seriesPart === 'number' && data.seriesPart > 0 ? data.seriesPart : 1;
      data.seriesTotal = typeof data.seriesTotal === 'number' && data.seriesTotal >= data.seriesPart ? data.seriesTotal : Math.max(data.seriesPart, 1);
    } else {
      delete data.series;
      delete data.seriesPart;
      delete data.seriesTotal;
    }
  }

  // Exact word count calculated directly from actual file content (no guesswork)
  if (data.words === undefined) {
    try {
      const wordCount = contentWithoutFrontmatter
        .replace(/<[^>]*>/g, '')
        .replace(/[#*`~_\[\]()]/g, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      data.words = wordCount;
    } catch {
      data.words = 0;
    }
  }

  // Description fallback
  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    const paragraphs = contentWithoutFrontmatter
      .split(/\n\s*\n/)
      .map((p) => p.replace(/<[^>]*>/g, '').replace(/[#*`~_\[\]()]/g, '').trim())
      .filter((p) => p.length > 20 && !p.startsWith('#'));
    if (paragraphs.length > 0) {
      data.description = paragraphs[0].slice(0, 160).trim() + (paragraphs[0].length > 160 ? '...' : '');
    } else {
      data.description = `Notes and article on ${data.title}.`;
    }
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
      data.tags = [tagSlug || 'series'];
    } else {
      data.tags = ['general'];
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
  // Support both ./Blogs and ./blogs casing across Windows and Linux environments
  let blogsBase = './Blogs';
  if (!fs.existsSync(path.resolve(process.cwd(), 'Blogs')) && fs.existsSync(path.resolve(process.cwd(), 'blogs'))) {
    blogsBase = './blogs';
  }
  const baseLoader = glob({ pattern: '**/*.{md,mdx}', base: blogsBase });

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

      const result = await baseLoader.load(context);

      // Clean up any stale entries in store whose underlying files no longer exist
      if (context.store) {
        for (const key of Array.from(context.store.keys())) {
          const entry = context.store.get(key);
          if (entry?.filePath) {
            const absPath = path.resolve(process.cwd(), entry.filePath);
            if (!fs.existsSync(absPath)) {
              context.store.delete(key);
            }
          }
        }
      }

      return result;
    },
  };
}
