/**
 * server.js
 * 
 * High-performance local static server tailored for Three.js, WASM, and WebGL assets.
 * Handles binary streaming, query string stripping, correct MIME types, and CORS.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.buf': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse URL and strip query string
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path
  let safePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Security check to prevent directory traversal
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if target is a directory
  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    const indexPath = path.join(safePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      safePath = indexPath;
    }
  }

  // Check if file exists
  if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
    console.warn(`[404 Not Found] ${req.method} ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${pathname}`);
    return;
  }

  const stat = fs.statSync(safePath);
  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Support range requests for audio / video streaming
  const range = req.headers.range;
  if (range && (ext === '.mp3' || ext === '.ogg' || ext === '.wav')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType
    });

    const fileStream = fs.createReadStream(safePath, { start, end });
    fileStream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-cache'
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const fileStream = fs.createReadStream(safePath);
  fileStream.pipe(res);
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`  Web3.esqrd.co Clone Server running at:`);
  console.log(`  -> Local:   http://localhost:${PORT}/`);
  console.log(`  -> Polish:  http://localhost:${PORT}/pl/`);
  console.log('====================================================');
});
