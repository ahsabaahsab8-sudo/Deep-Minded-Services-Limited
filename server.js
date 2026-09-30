const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8090;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff1': 'font/woff',
  '.splinecode': 'application/octet-stream',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  // Handle /_next/image query string proxying
  if (req.url.startsWith('/_next/image')) {
    const match = req.url.match(/[?&]url=([^&]+)/);
    if (match) {
      const targetUrl = decodeURIComponent(match[1]);
      let imgPath = path.join(ROOT, targetUrl);
      if (!fs.existsSync(imgPath)) {
        const webDevImg = path.join(ROOT, 'web-dev', targetUrl);
        if (fs.existsSync(webDevImg)) imgPath = webDevImg;
      }
      if (fs.existsSync(imgPath)) {
        const ext = path.extname(imgPath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        });
        return fs.createReadStream(imgPath).pipe(res);
      }
    }
  }

  // Decode URL and normalize
  const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, decodedUrl);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Fallback check in app-dev or web-dev subdirectories for root-level asset requests
  if (!fs.existsSync(filePath)) {
    const appDevCandidate = path.join(ROOT, 'app-dev', decodedUrl);
    if (fs.existsSync(appDevCandidate)) {
      filePath = appDevCandidate;
    } else {
      const webDevCandidate = path.join(ROOT, 'web-dev', decodedUrl);
      if (fs.existsSync(webDevCandidate)) {
        filePath = webDevCandidate;
      }
    }
  }

  // If path is a directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + decodedUrl);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`DMS local server running at http://localhost:${PORT}`);
});
