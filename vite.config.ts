import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite Plugin to serve backend REST API routes during local development
function backendApiPlugin(): Plugin {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          try {
            const { handleApiRequest } = await import('./server/backendHandler.js');
            return handleApiRequest(req, res);
          } catch (err) {
            console.error('Backend API Middleware Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal API Server Error' }));
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
