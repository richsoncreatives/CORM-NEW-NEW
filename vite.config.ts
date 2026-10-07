import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// Middleware to support clean URLs like /counselors -> /counselors.html in dev server
const cleanUrlsPlugin = (): Plugin => ({
  name: 'clean-urls-plugin',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && !req.url.includes('.') && req.url !== '/') {
        const cleanPath = req.url.split('?')[0].replace(/^\//, '');
        const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
        const targetHtml = path.resolve(__dirname, `${cleanPath}.html`);
        if (fs.existsSync(targetHtml)) {
          req.url = `/${cleanPath}.html${query}`;
        }
      }
      next();
    });
  },
});

export default defineConfig(() => {
  return {
    appType: 'mpa' as const,
    plugins: [react(), tailwindcss(), cleanUrlsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          counselors: path.resolve(__dirname, 'counselors.html'),
          library: path.resolve(__dirname, 'library.html'),
          nuggets: path.resolve(__dirname, 'nuggets.html'),
          operations: path.resolve(__dirname, 'operations.html'),
          partnerships: path.resolve(__dirname, 'partnerships.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          notFound: path.resolve(__dirname, '404.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
