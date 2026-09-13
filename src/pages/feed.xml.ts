import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/site.config';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/, '')}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
