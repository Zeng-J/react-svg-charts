import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'rs-charts',
    footer: false,
  },
  logo: false,
  base: '/react-svg-charts/',
  publicPath: '/react-svg-charts/',
});
