import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection, render } from 'astro:content';
import BlogPostLayout from '../src/layouts/BlogPostLayout.astro';

describe('Blog Post Smoke Test', () => {
  it('renders welcome-to-glyph.md via BlogPostLayout without throwing', async () => {
    const posts = await getCollection('blog');
    console.log(
      '[DEBUG CI] posts count:',
      posts?.length,
      'ids:',
      posts?.map((p) => p.id)
    );
    const targetPost = posts.find((p) => p.id.includes('welcome-to-glyph'));
    expect(targetPost).toBeDefined();

    const { headings } = await render(targetPost!);
    const container = await AstroContainer.create();

    const result = await container.renderToString(BlogPostLayout, {
      props: {
        post: targetPost!,
        allPosts: posts,
        headings: headings || [],
      },
      slots: {
        default: '<p>Welcome to glyph.sh content body</p>',
      },
    });

    expect(result).toBeDefined();
    expect(result).toContain(targetPost!.data.title);
    expect(result).toContain('Welcome to glyph.sh content body');
  });
});
