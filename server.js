const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8090;
const ROOT = __dirname;
const APP_DEV_DIR = path.join(ROOT, 'app-dev');
const AI_AGENTS_DIR = path.join(ROOT, 'ai-agents');
const SAAS_DEV_DIR = path.join(ROOT, 'saas-dev');

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
  '.bin': 'application/octet-stream',
  '.buf': 'application/octet-stream',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
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

  // Decode URL, strip trailing punctuation/parentheses, and normalize
  let cleanUrl = req.url.split('?')[0].replace(/[\)\],]+$/, '');
  const decodedUrl = decodeURIComponent(cleanUrl);

  let filePath;
  // Localhost root or /app-dev directly opens the cloned App Dev website
  if (decodedUrl === '/' || decodedUrl === '' || decodedUrl === '/app-dev' || decodedUrl === '/app-dev/') {
    filePath = path.join(APP_DEV_DIR, 'index.html');
  } else if (decodedUrl === '/web-dev' || decodedUrl === '/web-dev/') {
    filePath = path.join(ROOT, 'web-dev', 'index.html');
  } else if (decodedUrl === '/ai-agents' || decodedUrl === '/ai-agents/' || decodedUrl === '/ai-agent' || decodedUrl === '/aiagents' || decodedUrl === '/ai') {
    filePath = path.join(AI_AGENTS_DIR, 'index.html');
  } else if (decodedUrl === '/saas-dev' || decodedUrl === '/saas-dev/' || decodedUrl === '/saasdev' || decodedUrl === '/saas') {
    filePath = path.join(SAAS_DEV_DIR, 'index.html');
  } else if (decodedUrl === '/main' || decodedUrl === '/main/' || decodedUrl === '/dms') {
    filePath = path.join(ROOT, 'index.html');
  } else {
    // Check if file exists inside saas-dev if requested under /saas-dev
    if (decodedUrl.startsWith('/saas-dev/')) {
      const relCandidate = path.join(SAAS_DEV_DIR, decodedUrl.replace(/^\/saas-dev\//, ''));
      if (fs.existsSync(relCandidate) && !fs.statSync(relCandidate).isDirectory()) {
        filePath = relCandidate;
      }
    }
    // Check if file exists inside ai-agents if prefixed or asset
    if (!filePath && decodedUrl.startsWith('/ai-agents/')) {
      const relCandidate = path.join(AI_AGENTS_DIR, decodedUrl.replace(/^\/ai-agents\//, ''));
      if (fs.existsSync(relCandidate) && !fs.statSync(relCandidate).isDirectory()) {
        filePath = relCandidate;
      }
    }
    if (!filePath) {
      // Check if file exists inside app-dev first
      const appDevCandidate = path.join(APP_DEV_DIR, decodedUrl.replace(/^\/app-dev/, ''));
      if (fs.existsSync(appDevCandidate) && !fs.statSync(appDevCandidate).isDirectory()) {
        filePath = appDevCandidate;
      } else {
        filePath = path.join(ROOT, decodedUrl);
      }
    }
  }

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Fallback checks
  if (!fs.existsSync(filePath)) {
    const fallbackInSaas = path.join(SAAS_DEV_DIR, decodedUrl.replace(/^\/saas-dev\/?/, ''));
    if (fs.existsSync(fallbackInSaas) && !fs.statSync(fallbackInSaas).isDirectory()) {
      filePath = fallbackInSaas;
    } else {
      const fallbackInAi = path.join(AI_AGENTS_DIR, decodedUrl.replace(/^\/ai-agents\/?/, ''));
      if (fs.existsSync(fallbackInAi) && !fs.statSync(fallbackInAi).isDirectory()) {
        filePath = fallbackInAi;
      } else {
        const fallbackInAiDirect = path.join(AI_AGENTS_DIR, decodedUrl);
        if (fs.existsSync(fallbackInAiDirect) && !fs.statSync(fallbackInAiDirect).isDirectory()) {
          filePath = fallbackInAiDirect;
        } else {
          const fallbackInAppDev = path.join(APP_DEV_DIR, decodedUrl);
          if (fs.existsSync(fallbackInAppDev)) {
            filePath = fallbackInAppDev;
          } else {
            const fallbackInWebDev = path.join(ROOT, 'web-dev', decodedUrl);
            if (fs.existsSync(fallbackInWebDev)) {
              filePath = fallbackInWebDev;
            }
          }
        }
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
  console.log(`Cloned App Dev website running at http://localhost:${PORT}`);
});
