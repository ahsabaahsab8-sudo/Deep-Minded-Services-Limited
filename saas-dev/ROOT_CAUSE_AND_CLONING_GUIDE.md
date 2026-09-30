# Root Cause and Complete Website Cloning Guide

## What Was Wrong

The local clone initially had the page structure, but it did not have the complete runtime environment required by the real website.

### 1. Missing Runtime Assets

The Three.js scene required files that were not obvious from the HTML, including:

- `.buf` geometry files
- `.wasm` Draco decoder files
- WebGL textures
- Dynamically loaded images
- App-download and integration icons

The page could render its HTML while the animated scene remained incomplete.

### 2. Incorrect or Stale Textures

Some local files existed with the correct filenames but contained incorrect or incomplete data.

For example:

- Local chat texture: approximately `70 KB`
- Live chat texture: approximately `793 KB`
- Local secondary chat texture: approximately `70 KB`
- Live secondary chat texture: approximately `1.8 MB`

Because the synchronizer skipped existing files, incorrect files were never replaced. This caused the local site to show a generic chat sticker instead of the real messaging interface image.

### 3. Fallback Renderer Replaced the Real Scene

`offline-fallback.js` created a custom particle canvas and hid the real WebGL canvas. This made the background and animation different from the live website.

The fallback was changed so it would not run on WebGL-capable browsers, and it was removed from the normal browser load path.

### 4. Scroll System Mismatch

The live site uses:

- A fixed viewport
- An internal scroll controller
- A custom wheel event handler
- Animation state controlled by the runtime

Changing the page to native document scrolling broke the original animation and navigation behavior. The live fixed layout and wheel behavior were restored.

### 5. Local Server Asset Issues

The local server initially had two problems:

- URLs containing query strings could resolve to the wrong local path.
- Binary files were written with text encoding behavior.

The server was updated to normalize request URLs and serve binary buffers directly.

## How It Was Fixed

The clone was repaired by comparing the live and local sites at runtime instead of comparing only the HTML.

The following steps were used:

1. Compared the live and local DOM structures.
2. Inspected browser console errors.
3. Inspected all network requests.
4. Found missing `.buf`, `.wasm`, image, and texture files.
5. Downloaded the missing files from the live website.
6. Compared local and live asset sizes.
7. Found stale and incorrectly mapped textures.
8. Added a `--force` mode to `sync-assets.js` so stale files could be replaced.
9. Refreshed all content textures:
   - Chat
   - Trade
   - Share
   - Vote
   - Stake
10. Removed the fallback canvas from the normal WebGL load path.
11. Restored the live fixed viewport and custom wheel behavior.
12. Fixed local binary asset serving and query-string handling.
13. Re-tested the page from a clean browser reload.

## Validation Results

The repaired local website was checked for:

- Successful WebGL scene initialization
- Completed preloader
- Correct animated background
- Correct cube and starfield animation
- Correct messaging and app textures
- Working section navigation
- Working internal scrolling
- No broken image elements
- No failed image requests
- Correct binary asset sizes
- Correct local favicon loading

The final local validation showed:

- `111` image elements loaded
- `0` broken images
- `0` image HTTP failures
- All six major content textures loaded at the live file sizes
- The preloader completed successfully
- The local WebGL canvas remained visible

## Reusable Process for Future Website Clones

### Step 1: Inspect the Real Website

Open the real website in a browser and inspect:

- DOM structure
- JavaScript files
- CSS files
- Network requests
- Console errors
- Runtime-created elements

Do not assume that copying the HTML is enough.

### Step 2: Record Every Asset

Collect every requested asset, including:

- `<img>` files
- `srcset` variants
- CSS background images
- Fonts
- JSON files
- Audio and video files
- WebGL textures
- `.glb`, `.gltf`, `.buf`, `.bin`, and `.wasm` files
- Dynamically requested images
- Assets requested only after scrolling or clicking a section

### Step 3: Compare Local and Live Files

Do not trust filenames alone. Compare:

- File sizes
- SHA-256 hashes
- Image dimensions
- MIME types
- Browser transfer sizes

An existing file may still be the wrong file.

### Step 4: Check Browser Errors

Look for:

- `404` errors
- CORS errors
- WebGL errors
- Failed fetch requests
- Image decode errors
- Failed font requests
- Pending requests that never finish

### Step 5: Preserve the Original Runtime

Keep the real website's behavior for:

- Fixed versus native scrolling
- Custom wheel and touch handling
- Animation loops
- Preloaders
- WebGL initialization
- Section transitions
- Navigation controls

Avoid replacing complex runtime behavior with a custom approximation unless the original runtime cannot work locally.

### Step 6: Make the Local Server Reliable

The local server should:

- Resolve query-string URLs correctly
- Return the correct MIME type
- Serve binary data without text encoding
- Support `.wasm`, `.buf`, `.bin`, `.glb`, and texture files
- Return `404` only for genuinely missing files

### Step 7: Force Refresh Stale Assets

A synchronizer should not always skip existing files. Provide a force-refresh option, such as:

```powershell
node sync-assets.js --force
```

Use this when an existing local asset may be incomplete or incorrectly mapped.

### Step 8: Validate From a Clean Reload

After synchronization:

1. Reload the local page.
2. Wait for the full preloader to finish.
3. Check all image elements.
4. Check failed network requests.
5. Test scrolling and navigation.
6. Compare screenshots at the same viewport size.
7. Test sections that load content dynamically.

## Main Lesson

A complete clone is not just copied HTML and CSS.

A faithful clone requires reproducing the website's:

- Runtime JavaScript
- Asset graph
- Binary files
- Textures
- Loading sequence
- WebGL scene
- Scroll controller
- Section navigation
- Local server behavior

When a clone looks similar but animations, images, or scrolling are wrong, inspect the runtime network requests first. The root cause is often a missing, stale, incorrectly mapped, or incorrectly served asset rather than a visual CSS problem.
