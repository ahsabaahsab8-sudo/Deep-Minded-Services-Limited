const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 4040;
const ROOT = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.exr': 'application/octet-stream',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.wasm': 'application/wasm',
};

function serveFile(res, filePath, cache) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cache || (ext === '.js' ? 'no-cache' : 'public, max-age=3600'),
    });
    res.end(data);
  });
}

function serveIndex(res) {
  const indexPath = path.join(ROOT, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

function serveRscPayload(res) {
  const payloadPath = path.join(ROOT, '..', 'rsc_payload.txt');
  fs.readFile(payloadPath, 'utf8', (err, data) => {
    res.writeHead(200, {
      'Content-Type': 'text/x-component; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'x-nextjs-cache': 'HIT',
    });
    res.end(err ? '0:["$@1",null]' : data);
  });
}

function findInDir(dir, baseName, ext) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  const files = fs.readdirSync(dir);
  const match = files.find(f => {
    const fBase = path.basename(f, path.extname(f));
    const fExt = path.extname(f);
    return fBase === baseName && fExt === ext;
  });
  if (match) return path.join(dir, match);
  const partial = files.find(f => f.startsWith(baseName) && f.endsWith(ext));
  if (partial) return path.join(dir, partial);
  return null;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let urlPath = decodeURIComponent(parsed.pathname);
  if (urlPath === '/') urlPath = '/index.html';

  // Handle RSC payload requests - return empty RSC response
  // Next.js client sends these with ?_rsc= query param or x-rsc header
  const isRSC = parsed.query._rsc !== undefined || req.headers['rsc'] !== undefined;
  if (isRSC) {
    serveRscPayload(res);
    return;
  }

  // Handle /api/send-form - stub endpoint
  if (urlPath === '/api/send-form') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ success: true, message: 'Form submitted (local stub)' }));
    });
    return;
  }

  // Handle CORS preflight for API routes
  if (req.method === 'OPTIONS' && urlPath.startsWith('/api/')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Handle _next/image - serve pre-optimized images
  if (urlPath.startsWith('/_next/image')) {
    const queryString = req.url.split('?')[1] || '';
    const imgDir = path.join(ROOT, '_next', 'image');
    if (fs.existsSync(imgDir)) {
      const files = fs.readdirSync(imgDir);
      const match = files.find(f => {
        const decoded = decodeURIComponent(f);
        return decoded === '?' + queryString || f === '?' + queryString;
      });
      if (match) {
        serveFile(res, path.join(imgDir, match), 'public, max-age=31536000');
        return;
      }
      const match2 = files.find(f => {
        const nameWithoutExt = path.basename(f, path.extname(f));
        return queryString.startsWith(nameWithoutExt.replace(/&/g, '%26'));
      });
      if (match2) {
        serveFile(res, path.join(imgDir, match2), 'public, max-age=31536000');
        return;
      }
    }
    // Fallback: try to serve the brand image directly
    const brandImg = path.join(ROOT, 'assets', 'images', 'brand', 'DMS_logo_white.png');
    if (fs.existsSync(brandImg)) {
      serveFile(res, brandImg, 'public, max-age=31536000');
      return;
    }
    res.writeHead(404);
    res.end('Image not found');
    return;
  }

  // Handle _vercel paths gracefully
  if (urlPath.startsWith('/_vercel/') || urlPath.startsWith('/vercel.')) {
    res.writeHead(204);
    res.end();
    return;
  }

  let filePath = path.join(ROOT, urlPath);

  // Direct file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (urlPath === '/index.html') { serveIndex(res); return; }
    serveFile(res, filePath);
    return;
  }

  // If it's a directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const idx = path.join(filePath, 'index.html');
    if (fs.existsSync(idx)) { serveFile(res, idx); return; }
  }

  // Smart matching: try _dpl suffix, partial name match, etc.
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirPath = path.dirname(filePath);

  // Try with _dpl suffix
  const dplPath = filePath.replace(ext, '_dpl=dpl_FtcqDSk5XX7p3FVW3E32CQArR5vE' + ext);
  if (fs.existsSync(dplPath)) { serveFile(res, dplPath); return; }

  // Try finding a matching file in the directory
  const found = findInDir(dirPath, baseName, ext);
  if (found) { serveFile(res, found); return; }

  // SPA fallback for non-asset routes
  if (!urlPath.startsWith('/_next/') && !urlPath.startsWith('/assets/') && !urlPath.includes('.')) {
    serveIndex(res);
    return;
  }

  res.writeHead(404);
  res.end('Not Found: ' + urlPath);
});

server.listen(PORT, () => {
  console.log(`Deep Minded Services Limited clone running at http://localhost:${PORT}`);
});
