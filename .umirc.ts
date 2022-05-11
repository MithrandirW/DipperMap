import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'GIS',
  favicon: '.src/assets/imgs/logo.png',
  logo: '.src/assets/imgs/logo.png',
  outputPath: 'docs-dist',
  plugins: [],
  mode: 'site',
  navs: [
    {
      title: '文档',
      path: '/',
      children: ['/index.md'],
    },
  ],
  // mfsu: {},
  workerLoader: {
    inline: true,
  },
  headScripts: ["localStorage.setItem('dumi:prefers-color', 'dark')"],
  styles: ['.__dumi-default-navbar-tool { display: none !important; }'],
  publicPath: '/GIS/',
  base: '/GIS/',
  antd: {
    dark: true,
  },
  hash: true,
  theme: {
    '@body-background': '#141414',
    '@component-background': '#141414',
    '@text-color': 'rgba(255, 255, 255, 0.65)',
    '@border-color-base': 'rgba(255, 255, 255, 0.1)',
  },
  // more config: https://d.umijs.org/config
});
