import { defineConfig } from 'vite';

export default defineConfig({
  // ⚠️  Change this to your GitHub repo name: '/your-repo-name/'
  // If deploying to a custom domain, set base: './'
  base: '/Al-Bushira-Result-App/',
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
