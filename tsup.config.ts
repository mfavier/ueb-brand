import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind-preset': 'src/tailwind-preset.ts',
    react: 'src/react.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // The crest is inlined as a text string so consumers need no asset pipeline.
  loader: { '.svg': 'text' },
  external: ['react', 'react/jsx-runtime', 'tailwindcss', 'tailwindcss/plugin'],
});
