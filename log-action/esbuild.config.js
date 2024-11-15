require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist',
  minify: true,
  target: 'node20',
  logLevel: 'info',
  plugins: [require('esbuild-plugin-tsc')({ force: true })],
});
