import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { handleApiRequest } from './server/backendHandler.js';

// Vite Plugin to serve backend REST API routes during local development
function backendApiPlugin(): Plugin {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          // For GET, HEAD, OPTIONS: dispatch immediately with zero stream delay
          if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
            (req as any).body = {};
            try {
              return handleApiRequest(req, res);
            } catch (err) {
              console.error('Backend API GET Error:', err);
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: 'Internal API Server Error' }));
            }
          }

          // For POST, PUT, PATCH: collect stream synchronously so chunks are NEVER lost
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            if (body) {
              try {
                (req as any).body = JSON.parse(body);
              } catch {
                (req as any).body = {};
              }
            } else {
              (req as any).body = {};
            }
            try {
              handleApiRequest(req, res);
            } catch (err) {
              console.error('Backend API Handler Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Internal API Server Error' }));
            }
          });
          req.on('error', (err) => {
            console.error('Req error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Request stream error' }));
          });
          return;
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
