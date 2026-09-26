import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import PostCard from '../src/components/PostCard.astro';

describe('PostCard Smoke Test', () => {
  it('renders a PostCard component', async () => {
    const container = await AstroContainer.create();
    const fakePost = {
      id: 'standalone/welcome-to-glyph.md',
      body: 'Welcome to glyph.sh',
      data: {
        title: 'Welcome to glyph.sh',
        description: 'A fast, minimalist technical blog.',
        pubDate: new Date('2026-09-14'),
        tags: ['getting-started'],
        draft: false,
      },
    };

    const result = await container.renderToString(PostCard, {
      props: { post: fakePost, showDivider: false },
    });

    expect(result).toContain('Welcome to glyph.sh');
    expect(result).toContain('A fast, minimalist technical blog.');
    expect('ci-verification-gate').toBe('deliberately-broken-to-test-failure');
  });
});
