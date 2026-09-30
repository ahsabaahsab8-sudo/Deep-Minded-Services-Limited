/**
 * sync-assets.js
 * 
 * Synchronizes all assets from https://web3.esqrd.co/ to the local folder.
 * Supports --force flag to re-download all assets regardless of local existence.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://web3.esqrd.co';
const ROOT_DIR = __dirname;
const FORCE = process.argv.includes('--force');

const ALL_ASSETS = [
  // HTML Pages
  '/',
  '/pl/',

  // Manifest and Meta
  '/site.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/og-image.webp',

  // CSS Stylesheets
  '/_astro/icon-close.BbT4hxQW.css',
  '/_astro/Layout.DBdau1SW.css',

  // JavaScript Runtime Bundle
  '/_astro/Layout.astro_astro_type_script_index_1_lang.Nsb0qlUj.js',

  // Fonts
  '/_astro/Industry-Light.wWiLkxSU.woff2',
  '/_astro/Industry-Light.DndEbTQr.woff',
  '/_astro/Play-Regular.DCGlv3pt.woff2',
  '/_astro/Play-Regular.QBwv04Pu.woff',
  '/_astro/Play-Bold.EA0LPI4m.woff2',
  '/_astro/Play-Bold.BXXJ2tJ5.woff',
  '/fonts/Industry-Light.json',

  // Background Audio
  '/music/background-sound.mp3',

  // Draco & Basis Decoders
  '/draco/draco_decoder.js',
  '/draco/draco_wasm_wrapper.js',
  '/draco/draco_decoder.wasm',
  '/basis/basis_transcoder.js',
  '/basis/basis_transcoder.wasm',

  // 3D Models (.glb)
  '/models/hexagons.glb',
  '/models/cross.glb',
  '/models/lock/lock.glb',
  '/models/chain/chain.glb',
  '/models/gear/gear.glb',
  '/models/ico/rhombus.glb',
  '/models/Icosahedron/Ico.glb',
  '/models/sphere_2/icosphere_1.glb',
  '/models/sphere_2/icosphere_2.glb',
  '/models/sphere_2/icosphere_3.glb',
  '/models/sphere_2/sphere_ico.glb',
  '/models/sphere_2/Nod.glb',
  '/models/sphere_3/sphere.glb',
  '/models/sphere_3/pentagon.glb',
  '/models/sphere_3/sphere_hexagons.glb',
  '/models/sphere_3/hexagon.glb',
  '/models/sphere_4/triangle.glb',

  // 3D Model Textures
  '/models/lock/texture/lock_Emission.png',
  '/models/lock/texture/lock_Alpha.png',
  '/models/chain/texture/chain_Emission.png',
  '/models/chain/texture/chain_Alpha.png',
  '/models/gear/textures/gear_Emission.png',
  '/models/gear/textures/gear_Alpha.png',
  '/models/ico/textures/rhombus_Emission.png',
  '/models/ico/textures/rhombus_Alpha.png',
  '/models/Icosahedron/textures/ico_Emission.png',
  '/models/Icosahedron/textures/ico_Alpha.png',
  '/models/sphere_2/sphere_wf_1.png',

  // WebGL Textures & Grids
  '/textures/displacement.jpg',
  '/textures/grass/grid.png',
  '/textures/fluid-noise.png',

  // Technology Logos
  '/images/technologies/solidity-logo.svg',
  '/images/technologies/etherium-network-logo.svg',
  '/images/technologies/solana-logo.svg',
  '/images/technologies/ethers-js.svg',
  '/images/technologies/wagmi-logo.svg',
  '/images/technologies/rainbow-logo.svg',
  '/images/technologies/connectkit.svg',
  '/images/technologies/react-logo.svg',
  '/images/technologies/vue-js-logo.svg',
  '/images/technologies/js-logo.svg',
  '/images/technologies/golang-logo.svg',
  '/images/technologies/php-logo.svg',
  '/images/technologies/rust-logo.svg',

  // Partner Logos
  '/images/partners/Adidas-Logo.svg',
  '/images/partners/Fill-logo.svg',
  '/images/partners/mawari-logo.svg',
  '/images/partners/pizza-hut-logo.svg',
  '/images/partners/captain-morgan-logo.svg',
  '/images/partners/Honda-logo.svg',
  '/images/partners/Subaru-logo.svg',
  "/images/partners/McDonald's-logo.svg"
];

function getLocalPath(relPath) {
  if (relPath === '/') return path.join(ROOT_DIR, 'index.html');
  if (relPath === '/pl/') return path.join(ROOT_DIR, 'pl', 'index.html');
  const clean = decodeURIComponent(relPath.replace(/^\//, ''));
  return path.join(ROOT_DIR, clean);
}

function downloadFile(relPath) {
  return new Promise((resolve, reject) => {
    const remoteUrl = BASE_URL + encodeURI(decodeURI(relPath));
    const dest = getLocalPath(relPath);

    https.get(remoteUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${remoteUrl}`));
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        const stat = fs.statSync(dest);
        resolve(stat.size);
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function sync() {
  console.log(`=== SYNCING ASSETS (Mode: ${FORCE ? 'FORCE RE-DOWNLOAD' : 'INCREMENTAL'}) ===`);
  console.log(`Target Directory: ${ROOT_DIR}\n`);

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const relPath of ALL_ASSETS) {
    const dest = getLocalPath(relPath);
    const exists = fs.existsSync(dest);

    if (exists && !FORCE) {
      const stat = fs.statSync(dest);
      if (stat.size > 0) {
        skipped++;
        console.log(`[EXISTS] ${relPath} (${stat.size} bytes)`);
        continue;
      }
    }

    try {
      process.stdout.write(`[DOWNLOADING] ${relPath}... `);
      const size = await downloadFile(relPath);
      synced++;
      console.log(`OK (${size} bytes)`);
    } catch (err) {
      failed++;
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log('\n========================================');
  console.log(`Total Assets: ${ALL_ASSETS.length}`);
  console.log(`Synced: ${synced}`);
  console.log(`Skipped (already valid): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

sync();
