import type { CollectionEntry } from 'astro:content';

export interface SeriesPart {
  part: number;
  total: number;
  title: string;
  slug: string;
  isCurrent: boolean;
}

export interface SeriesInfo {
  name: string;
  currentPart: number;
  totalParts: number;
  parts: SeriesPart[];
}

/**
 * Given a post and all blog posts, resolves the complete series information.
 */
export function getSeriesInfo(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[]
): SeriesInfo | null {
  const { series, seriesPart, seriesTotal } = currentPost.data;
  if (!series || seriesPart === undefined || seriesTotal === undefined) {
    return null;
  }

  const seriesPosts = allPosts
    .filter((p) => p.data.series === series && !p.data.draft)
    .sort((a, b) => (a.data.seriesPart || 0) - (b.data.seriesPart || 0));

  const parts: SeriesPart[] = [];
  for (let i = 1; i <= seriesTotal; i++) {
    const matchingPost = seriesPosts.find((p) => p.data.seriesPart === i);
    parts.push({
      part: i,
      total: seriesTotal,
      title: matchingPost ? matchingPost.data.title : `Part ${i}`,
      slug: matchingPost ? matchingPost.id.replace(/\.(md|mdx)$/, '') : '',
      isCurrent: i === seriesPart,
    });
  }

  return {
    name: series,
    currentPart: seriesPart,
    totalParts: seriesTotal,
    parts,
  };
}
