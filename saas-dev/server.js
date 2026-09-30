const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.wasm': 'application/wasm',
    '.bin': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
    const requestPath = new URL(req.url, `http://${req.headers.host || HOST}`).pathname;
    let filePath = path.join(__dirname, requestPath === '/' ? 'index.html' : requestPath);
    
    // Handle URL-encoded paths
    filePath = decodeURIComponent(filePath);
    
    const extname = path.extname(filePath).toLowerCase();
    let contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`, 'utf-8');
            }
        } else {
            if (path.basename(filePath) === 'index.html') {
                content = Buffer.from(content.toString('utf8').replace(
                    '</head>',
                    '<link rel="stylesheet" href="/dms-custom.css"><script src="/content-overrides.js"></script></head>'
                ));
            }
            // Add CORS headers for fonts and resources
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}/`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('Press Ctrl+C to stop the server');
});
