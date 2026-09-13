import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // USER: Change this to your actual GitHub Pages URL, e.g. https://yourusername.github.io
  site: 'https://harish.github.io',
  output: 'static',
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha',
        },
        wrap: true,
      },
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
