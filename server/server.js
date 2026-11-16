import http from 'http';
import { handleApiRequest } from './backendHandler.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api')) {
    handleApiRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`[E-VAHAN Backend] REST API Server running live at http://localhost:${PORT}/api/health`);
});
