import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '@/lib/og-image';

export async function getStaticPaths() {
  const isProd = import.meta.env.PROD;
  const posts = await getCollection('blog', ({ data }) => (isProd ? !data.draft : true));
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, '') },
    props: { post },
  }));
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
