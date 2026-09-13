import type { APIRoute } from 'astro';
import { generateOgImage } from '@/lib/og-image';
import { siteConfig } from '@/site.config';

export const GET: APIRoute = async () => {
  const pngBuffer = await generateOgImage({
    title: siteConfig.title,
    description: siteConfig.description,
    tags: ['reverse-engineering', 'systems', 'robotics', 'bug-bounty'],
  });

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
