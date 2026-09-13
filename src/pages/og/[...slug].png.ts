import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '@/lib/og-image';

export async function getStaticPaths() {
  const isProd = import.meta.env.PROD;
  const posts = await getCollection('blog', ({ data }) => (isProd ? !data.draft : true));

  const paths: { params: { slug: string }; props: { post: (typeof posts)[0] } }[] = [];
  const registered = new Set<string>();

  posts.forEach((post) => {
    const fullSlug = post.id.replace(/\.(md|mdx)$/, '');
    if (!registered.has(fullSlug)) {
      registered.add(fullSlug);
      paths.push({ params: { slug: fullSlug }, props: { post } });
    }

    const parts = fullSlug.split('/');
    const leaf = parts[parts.length - 1];
    if (!registered.has(leaf)) {
      registered.add(leaf);
      paths.push({ params: { slug: leaf }, props: { post } });
    }

    const cleanLeaf = leaf.replace(/^(?:part[-_]?)?\d+[-_]/i, '');
    if (cleanLeaf && !registered.has(cleanLeaf)) {
      registered.add(cleanLeaf);
      paths.push({ params: { slug: cleanLeaf }, props: { post } });
    }
  });

  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const post = props.post;
  const pngBuffer = await generateOgImage({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    pubDate: post.data.pubDate,
  });

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
