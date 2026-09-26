import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      'Blogs/**',
      'guardrails/**',
      '**/*.d.ts',
      // Header.astro has a raw unescaped '>' token flagged by astro-eslint-parser.
      // Per Phase 1 constraint (do not touch src/components/), we ignore it here
      // and flag it in the PR description for a subsequent phase fix.
      'src/components/Header.astro',
    ],
  },
  // Scope typescript-eslint to TS/JS files so it does not override astro-eslint-parser on .astro files
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.mjs'],
  })),
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Tune rules to match existing codebase conventions without triggering mass reformatting
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-const': 'off',
      'astro/no-set-html-directive': 'off',
    },
  },
];
