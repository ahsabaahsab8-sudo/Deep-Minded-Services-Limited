var assetFallbacks = {
  'white-arrow-down.png': 'assets/images/icons/layout/white-arrow.png',
  'chat.png': 'assets/images/icons/hero/chat-120.png',
  'trade.png': 'assets/images/icons/hero/trade-120.png',
  'share.png': 'assets/images/icons/hero/share-120.png',
  'vote.png': 'assets/images/icons/hero/vote-120.png',
  'stake.png': 'assets/images/icons/hero/stake-120.png',
  'zeroId.png': 'assets/images/logo/zero-logo.png',
};

function resolveAsset(image) {
  var source = image.getAttribute('src');
  if (!source) return;
  if (source.indexOf('/assets/') === 0) {
    image.setAttribute('src', source.slice(1));
  }
  image.addEventListener('error', function () {
    var filename = image.src.split('/').pop();
    var replacement = assetFallbacks[filename];
    if (replacement && image.getAttribute('src') !== replacement) {
      image.setAttribute('src', replacement);
    }
  }, { once: true });
}

document.querySelectorAll('img').forEach(resolveAsset);
new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType !== 1) return;
      if (node.matches('img')) resolveAsset(node);
      node.querySelectorAll('img').forEach(resolveAsset);
    });
  });
}).observe(document.body, { childList: true, subtree: true });

function createSceneFallback() {
  try {
    var probe = document.createElement('canvas');
    if (probe.getContext('webgl2') || probe.getContext('webgl')) return;
  } catch (error) {
    // Keep the fallback for browsers that cannot create a WebGL context.
  }
  if (document.getElementById('local-scene-fallback')) return true;
  var scene = document.createElement('canvas');
  scene.id = 'local-scene-fallback';
  scene.setAttribute('aria-hidden', 'true');
  scene.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.insertBefore(scene, document.body.firstChild);
  var context = scene.getContext('2d');
  var particles = Array.from({ length: 260 }, function (_, index) {
    var angle = (index * 2.399963) % (Math.PI * 2);
    var distance = 90 + (index * 37) % 410;
    return { angle: angle, distance: distance, length: 18 + (index * 11) % 90, speed: .00008 + (index % 7) * .000012 };
  });
  function resize() {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    scene.width = window.innerWidth * ratio;
    scene.height = window.innerHeight * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function draw(time) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var centerX = width * .535;
    var centerY = height * .53;
    context.clearRect(0, 0, width, height);
    var background = context.createRadialGradient(centerX, centerY, 20, centerX, centerY, Math.max(width, height) * .78);
    background.addColorStop(0, '#18264e');
    background.addColorStop(.32, '#111933');
    background.addColorStop(1, '#080914');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    particles.forEach(function (particle, index) {
      var angle = particle.angle + time * particle.speed;
      var distance = particle.distance + Math.sin(time * .0003 + index) * 18;
      var x = centerX + Math.cos(angle) * distance;
      var y = centerY + Math.sin(angle) * distance * .72;
      var endX = x + Math.cos(angle + .15) * particle.length;
      var endY = y + Math.sin(angle + .15) * particle.length;
      context.strokeStyle = 'rgba(150, 169, 202, ' + (.08 + (index % 5) * .025) + ')';
      context.lineWidth = 1 + (index % 3) * .35;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(endX, endY);
      context.stroke();
    });
    var glow = context.createRadialGradient(centerX, centerY, 40, centerX, centerY, 170);
    glow.addColorStop(0, 'rgba(106, 150, 255, .36)');
    glow.addColorStop(.55, 'rgba(80, 118, 226, .12)');
    glow.addColorStop(1, 'rgba(40, 53, 126, 0)');
    context.fillStyle = glow;
    context.fillRect(centerX - 180, centerY - 180, 360, 360);
    var orb = context.createRadialGradient(centerX - 14, centerY - 18, 4, centerX, centerY, 62);
    orb.addColorStop(0, '#142451');
    orb.addColorStop(.76, '#050816');
    orb.addColorStop(1, '#010208');
    context.fillStyle = orb;
    context.beginPath();
    context.arc(centerX, centerY, 55, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgba(183, 207, 255, .86)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 57, Math.PI * .94, Math.PI * 1.78);
    context.stroke();
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw(0);
  var mainCanvas = document.getElementById('canvas');
  if (mainCanvas) mainCanvas.style.visibility = 'hidden';
  document.querySelectorAll('.section, #layout').forEach(function (element) {
    element.style.position = element.id === 'layout' ? 'absolute' : 'relative';
    element.style.zIndex = '1';
  });
  return true;
}

var usingSceneFallback = createSceneFallback();

window.setTimeout(function () {
  document.querySelectorAll('#preloader, .preloader').forEach(function (loader) {
    loader.remove();
  });
  document.documentElement.classList.add('is-ready');
  if (usingSceneFallback) document.body.style.overflow = 'auto';
}, 1200);
