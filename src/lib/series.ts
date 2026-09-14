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
  const { series, seriesPart } = currentPost.data;
  if (!series || seriesPart === undefined) {
    return null;
  }

  const seriesPosts = allPosts
    .filter((p) => p.data.series === series && !p.data.draft)
    .sort((a, b) => (a.data.seriesPart || 0) - (b.data.seriesPart || 0));

  const maxExplicitTotal = Math.max(
    0,
    ...seriesPosts.map((p) => p.data.seriesTotal || 0),
    currentPost.data.seriesTotal || 0,
    seriesPosts.length,
    seriesPart
  );

  const totalParts = maxExplicitTotal > 0 ? maxExplicitTotal : Math.max(seriesPosts.length, 1);

  const parts: SeriesPart[] = [];
  for (let i = 1; i <= totalParts; i++) {
    const matchingPost = seriesPosts.find((p) => p.data.seriesPart === i);
    parts.push({
      part: i,
      total: totalParts,
      title: matchingPost ? matchingPost.data.title : `Part ${i}`,
      slug: matchingPost ? matchingPost.id.replace(/\.(md|mdx)$/, '') : '',
      isCurrent: i === seriesPart,
    });
  }

  return {
    name: series,
    currentPart: seriesPart,
    totalParts,
    parts,
  };
}
