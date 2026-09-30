const fs = require('fs');
const path = require('path');
const https = require('https');

const root = 'https://client-zero-tech.lusion.co/';
const output = __dirname;
const force = process.argv.includes('--force');
const queue = new Set([
  '/',
  '/index.html',
  '/style.css',
  '/index.js',
  '/assets/models/bevel_box.buf',
  '/assets/models/cubeAssemble/in.buf',
  '/assets/models/cubeAssemble/out.buf',
  '/assets/textures/specular.png',
  '/assets/textures/chat/1.png',
  '/assets/textures/chat/3.png',
  '/assets/textures/trade/1.png',
  '/assets/textures/share/1.png',
  '/assets/textures/vote/1.png',
  '/assets/textures/stake/1.png',
  '/assets/models/network/network_0.buf',
  '/assets/models/network/network_1.buf',
  '/assets/models/network/network_2.buf',
  '/assets/textures/eclipse/eclipse_0.png',
  '/assets/textures/eclipse/eclipse_clip_0.png',
  '/assets/textures/eclipse/eclipse_clip_1.png',
  '/assets/models/orbit/orbit_ring_items.buf',
  '/assets/textures/orbit/moon_1.png',
  '/assets/textures/ending/sun_0.png',
  '/assets/textures/ending/sun_1.png',
  '/assets/textures/ending/moon_0.png',
  '/assets/textures/ending/moon_1.png',
  '/assets/images/icons/download/android.png',
  '/assets/images/icons/download/ios.png',
  '/assets/images/icons/download/mac.png',
  '/assets/images/icons/download/windows.png',
  '/assets/images/icons/download/linux.png',
  '/assets/images/icons/integrations/ethereum.png',
  '/assets/images/icons/integrations/ipfs.png',
  '/assets/images/icons/integrations/the-graph.png',
  '/assets/images/icons/integrations/snapshot.png',
  '/assets/images/icons/integrations/opensea.png',
  '/assets/images/icons/integrations/gnosis.png',
  '/assets/images/icons/integrations/polygon.png',
  '/assets/images/icons/integrations/starkware.png',
  '/assets/images/icons/integrations/unreal-engine.png',
  '/assets/images/icons/integrations/twitter.png',
  '/assets/images/icons/integrations/discord.png',
  '/assets/images/icons/integrations/telegram.png',
  '/assets/images/icons/integrations/sendbird.png'
]);
const visited = new Set();

function request(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 local-clone-sync' } }, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        return request(new URL(response.headers.location, url).href).then(resolve, reject);
      }
      if (response.statusCode !== 200) {
        response.resume();
        return reject(new Error(`${response.statusCode} ${url}`));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function localPath(url) {
  const parsed = new URL(url);
  const clean = decodeURIComponent(parsed.pathname).replace(/^\/+/, '') || 'index.html';
  return path.join(output, clean);
}

function addReferences(text, sourceUrl) {
  const references = new Set();
  const pattern = /(?:src|href|url)=["']([^"']+)|url\(([^)]+)\)|(["'])(assets\/[A-Za-z0-9_./-]+)\3/g;
  let match;
  while ((match = pattern.exec(text))) {
    const value = (match[1] || match[2] || match[4] || '').trim().replace(/^['"]|['"]$/g, '');
    if (!value || value.startsWith('data:') || value.startsWith('#')) continue;
    const absolute = new URL(value, sourceUrl);
    if (absolute.origin === new URL(root).origin) references.add(absolute.pathname);
  }
  for (const reference of references) queue.add(reference);
}

async function download(reference) {
  const url = new URL(reference, root).href;
  const target = localPath(url);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!force && fs.existsSync(target) && fs.statSync(target).size > 0) return;
  const data = await request(url);
  fs.writeFileSync(target, data);
  console.log(`downloaded ${reference} (${data.length} bytes)`);
}

(async () => {
  while (queue.size) {
    const reference = queue.values().next().value;
    queue.delete(reference);
    if (visited.has(reference)) continue;
    visited.add(reference);
    try {
      await download(reference);
      const target = path.join(output, reference.replace(/^\/+/, ''));
      const extension = path.extname(target).toLowerCase();
      if (['.html', '.css', '.js'].includes(extension)) {
        addReferences(fs.readFileSync(target, 'utf8'), new URL(reference, root).href);
      }
    } catch (error) {
      console.warn(`skipped ${reference}: ${error.message}`);
    }
  }

  for (const file of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) {
    const reference = `/assets/js/draco/${file}`;
    try {
      await download(reference);
    } catch (error) {
      console.warn(`skipped ${reference}: ${error.message}`);
    }
  }
  console.log(`sync complete: inspected ${visited.size} same-origin paths`);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
