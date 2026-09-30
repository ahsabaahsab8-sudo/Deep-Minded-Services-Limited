(() => {
  const brand = 'Deep Minded Services Limited';
  const oldBrand = /\bFlowty\b/gi;
  const oldHeroCopy = 'Work moves better when focus and recovery take turns. Block noisy apps and find your daily rhythm with Deep Minded Services Limited — a minimalist focus-break timer.';
  const oldNeedsCopy = 'Stop fighting your willpower. Deep Minded Services Limited automatically blocks distracting apps and silences notifications the moment your focus session starts.';
  const wristHeading = 'Powerful Apps, Right on Your Wrist';

  const disableExternalLinks = (root = document) => {
    root.querySelectorAll?.('a[href^="http://"], a[href^="https://"]').forEach((link) => {
      if (link.dataset.externalDisabled) return;
      link.dataset.externalDisabled = 'true';
      link.dataset.originalHref = link.getAttribute('href');
      link.setAttribute('href', '#');
      link.addEventListener('click', (event) => event.preventDefault());
    });
    root.querySelectorAll?.('button[aria-label*="App Store"], button[aria-label*="Google Play"]').forEach((button) => {
      if (button.dataset.externalDisabled) return;
      button.dataset.externalDisabled = 'true';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
    });
  };

  const removeQrContent = (root = document) => {
    root.querySelectorAll?.('button[aria-label*="Scan QR code"], [aria-label*="Scan QR code"]').forEach((element) => {
      element.remove();
    });
    root.querySelectorAll?.('footer > div > div').forEach((row) => {
      if (!/Scan this QR code/i.test(row.innerText || '')) return;
      [...row.children].forEach((child) => child.remove());
    });
    root.querySelectorAll?.('*').forEach((element) => {
      if (!/Scan this QR code/i.test(element.innerText || '') || element.children.length > 4) return;
      const container = element.closest('.flex.items-center') || element.parentElement?.parentElement || element;
      container.classList.add('dms-qr-removed');
      container.setAttribute('aria-hidden', 'true');
    });
  };

  const replaceDownloadContent = (root = document) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      if (node.parentElement?.matches('script, style')) return;
      node.nodeValue = node.nodeValue.replace(/\bDownload\b/gi, 'Contact');
    });
    root.querySelectorAll?.('*').forEach((element) => {
      for (const attribute of element.attributes) {
        if (attribute.name === 'href' || attribute.name === 'src') continue;
        attribute.value = attribute.value.replace(/\bDownload\b/gi, 'Contact');
      }
    });
  };

  const replaceHeroContent = () => {
    const candidates = [...document.querySelectorAll('div')];
    const hero = candidates.find((element) => element.textContent.replace(/\s+/g, ' ').trim() === oldHeroCopy);
    if (!hero || hero.parentElement.querySelector('.dms-hero-rendered')) return;
    hero.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-hero-rendered';
    replacement.innerHTML = `
      <h2>App Development Solutions</h2>
      <p><strong>Engineering High-Performance Mobile Applications That Dominate the App Stores.</strong></p>
      <h3>Building Apps That Scale &amp; Go Viral</h3>
      <p>We don't just write code; we architect powerful, production-ready mobile experiences. From intuitive consumer apps to high-throughput enterprise platforms, <strong>Deep Minded Services Limited (DMS)</strong> delivers end-to-end mobile engineering for iOS and Android.</p>
      <p>Leveraging modern multi-platform frameworks like <strong>Flutter</strong> alongside native capabilities, we build applications that feature silky-smooth UI/UX, bulletproof security, and seamless API integrations. Whether you want to launch a next-gen AI utility like <em>Nature AI</em>, a specialized identifier tool, or a scalable real-time streaming platform, we take your product from concept to 100% verified App Store and Google Play deployment.</p>
      <h3>What We Deliver:</h3>
      <ul>
        <li><strong>Cross-Platform Excellence:</strong> High-performance apps built with Flutter, optimized for both iOS and Android.</li>
        <li><strong>AI &amp; Advanced Integration:</strong> Real-time camera processing, multi-LLM integrations, and custom backend syncing.</li>
        <li><strong>Monetization &amp; Store Deployment:</strong> Full setup of in-app purchases (IAP), subscriptions, AdMob, and guaranteed store approval pipelines.</li>
      </ul>
      <p>Let’s turn your app idea into the next market leader.</p>`;
    hero.after(replacement);
  };

  const replaceNeedsContent = () => {
    const section = document.querySelector('[data-section="needs"]');
    if (!section || section.querySelector('.dms-needs-rendered')) return;
    const paragraph = [...section.querySelectorAll('div')]
      .filter((element) => element.innerText?.includes('Stop fighting your willpower.') && element.innerText.includes('the moment your focus session starts.'))
      .sort((first, second) => first.textContent.length - second.textContent.length)[0];
    const heading = section.querySelector('h2');
    if (!paragraph || !heading) return;
    heading.style.display = 'none';
    paragraph.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-needs-rendered';
    replacement.innerHTML = `
      <h2>Kill Ordinary Apps. Build Market Leaders.</h2>
      <p><strong>Stop settling for basic templates. Deep Minded Services Limited engineers custom, high-performance mobile applications designed to hook users and dominate the App Stores from day one.</strong></p>
      <h3>Redefining Mobile Experiences</h3>
      <p>We build feature-rich, lightning-fast mobile apps using modern frameworks like <strong>Flutter, Android, and iOS</strong>. Whether it's an advanced AI-powered utility camera, a real-time streaming platform, or a complex utility app, we transform your vision into a scalable, production-ready product with flawless UI/UX and verified store deployments.</p>`;
    heading.after(replacement);
  };

  const replaceWristHeading = () => {
    const heading = [...document.querySelectorAll('h3')].find((element) => element.textContent.replace(/\s+/g, '').trim() === 'DeepMindedServicesLimitedOnYourWrist');
    if (!heading || heading.nextElementSibling?.classList.contains('dms-wrist-heading')) return;
    heading.style.display = 'none';
    const replacement = document.createElement('h3');
    replacement.className = `${heading.className} dms-wrist-heading`;
    replacement.textContent = wristHeading;
    heading.after(replacement);
  };

  const replaceStatsContent = () => {
    const section = document.querySelector('[data-section="stats"]');
    if (!section || section.querySelector('.dms-stats-rendered')) return;
    const heading = section.querySelector('h3');
    const paragraphs = [...section.querySelectorAll('p')];
    const research = paragraphs.find((element) => element.innerText.includes('Research shows'));
    const closing = paragraphs.find((element) => element.innerText.includes('Be one of them'));
    if (!heading || !research) return;
    heading.style.display = 'none';
    research.parentElement.style.display = 'none';
    if (closing) closing.parentElement.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-stats-rendered';
    replacement.innerHTML = `
      <h3>Up To <strong>100%</strong></h3>
      <ul>
        <li><strong>1st</strong> — Guaranteed App Store &amp; Google Play Store Submission Success.</li>
        <li><strong>3x</strong> — Faster Development Cycles with Cross-Platform Frameworks.</li>
        <li><strong>10M+</strong> — Scalable Architecture Capacity for High-Traffic Users.</li>
        <li><strong>0%</strong> — Compromise on UI/UX, Performance, or Security Standards.</li>
      </ul>
      <p>Research shows that by engineering high-performance mobile architectures and flawless UI/UX, <strong>Deep Minded Services Limited (DMS)</strong> helps brands reclaim user attention, boost engagement, and launch viral apps that stand out in crowded markets.</p>`;
    research.parentElement.after(replacement);
  };

  const replaceIndustriesContent = () => {
    const section = document.querySelector('[data-section="industries"]');
    const heading = section?.querySelector('h4');
    if (!section || !heading || section.querySelector('.dms-industries-rendered')) return;
      if (!heading.textContent.includes("Whether you're a developer")) return;
    heading.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-industries-rendered';
    replacement.innerHTML = `
      <h4>Tailored for Every Industry</h4>
      <p>Whether you're building an AI-powered utility, a real-time streaming platform, an e-commerce ecosystem, or a high-performance enterprise app — choose or customize a tech stack and feature set that fits your exact business goals perfectly.</p>`;
    heading.after(replacement);
  };

  const replaceGetMoreStats = () => {
    const card = document.querySelector('[data-section="get-more"] [data-get-more-item="-10"]');
    if (!card || card.querySelector('.dms-app-metrics')) return;
    const heading = [...card.querySelectorAll('div')].find((element) => element.innerText?.trim() === 'Statistics');
    const paragraph = [...card.querySelectorAll('div')].find((element) => element.innerText?.includes('Track your Efficiency Score'));
    if (!heading || !paragraph) return;
    heading.style.display = 'none';
    paragraph.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-app-metrics';
    replacement.innerHTML = `
      <h4>App Metrics &amp; Analytics</h4>
      <p>Track your app's performance, analyze user engagement, and use real-time data insights to eliminate guesswork and build viral mobile products that truly perform.</p>`;
    heading.parentElement.parentElement.prepend(replacement);
  };

  const replaceIndustryIntro = () => {
    const section = document.querySelector('[data-section="industries"]');
    const heading = section?.querySelector('h4');
    if (!section || !heading || section.querySelector('.dms-industries-rendered')) return;
    if (!heading.textContent.includes("Whether you're a developer")) return;
    heading.style.display = 'none';
    const replacement = document.createElement('div');
    replacement.className = 'dms-industries-rendered';
    replacement.innerHTML = `
      <h4>Tailored for Every Industry</h4>
      <p>Whether you're building an AI-powered utility, a real-time streaming platform, an e-commerce ecosystem, or a high-performance enterprise app — choose or customize a tech stack and feature set that fits your exact business goals perfectly.</p>`;
    heading.after(replacement);
  };

  const replaceReviewContent = () => {
    const section = [...document.querySelectorAll('section')].find((element) => element.querySelector('[data-review-block]'));
    if (!section || section.querySelector('.dms-review-copy')) return;
    const reviews = [
      'DMS turned our app concept into a polished Flutter product for iOS and Android. The team handled the UX, backend integration, testing, and store submission with impressive attention to detail.',
      'We brought DMS in to build AI agents and workflow automations for our operations. They connected the models to our existing tools and delivered a reliable system that saves our team hours every week.',
      'DMS built the SaaS platform our business needed to scale. The architecture is fast, secure, and easy to extend, and the team stayed focused on both the product experience and the technical foundation.',
      'Our 3D web experience went from an ambitious idea to a smooth, high-performing product. DMS made the interactions feel premium while keeping the experience responsive across desktop and mobile.',
      'DMS delivered a complete mobile application and guided us through App Store and Google Play approval. Their process was organized, transparent, and focused on shipping a product users genuinely enjoy.',
      'From strategy to launch, DMS felt like a true technology partner. They combined strong engineering with thoughtful design to build an efficient product that is ready for real customers and future growth.'
    ];
    section.querySelectorAll('[data-review-block]').forEach((card, index) => {
      const body = card.querySelector('.text-P1-22-R');
      if (body && reviews[index]) body.textContent = reviews[index];
    });
    const heading = [...section.querySelectorAll('h4')].find((element) => element.innerText.includes('What do users think'));
    if (heading) {
      heading.style.display = 'none';
      const replacement = document.createElement('h4');
      replacement.className = `${heading.className} dms-review-copy`;
      replacement.textContent = 'What DMS Clients Say About Their Projects';
      heading.after(replacement);
    }
  };

  const replaceFaqContent = () => {
    const section = document.querySelector('[data-section="questions"]');
    if (!section || section.querySelector('.dms-faq-intro')) return;
    const intro = [...section.querySelectorAll('div')]
      .filter((element) => element.innerText?.includes('Got questions?') && element.innerText.includes('common ones below'))
      .sort((first, second) => first.textContent.length - second.textContent.length)[0];
    if (intro) {
      intro.textContent = 'Frequently Asked Questions';
      intro.classList.add('dms-faq-intro');
    }
    const items = [
      {
        question: 'Is Deep Minded Services Limited (DMS) a free agency?',
        answer: 'Deep Minded Services Limited is a premier tech studio—we partner with startups and enterprises on custom, high-ticket digital engineering projects, starting from discovery and scoping to full-scale deployment.'
      },
      {
        question: 'What does our project development lifecycle include?',
        answer: 'Our professional development engagements cover everything required to ship market-leading products: custom UI/UX design, high-performance Flutter mobile architecture, WebGL/3D web animations, robust Python/FastAPI backends, AI agent integrations, and guaranteed App Store/Google Play store deployment.'
      },
      {
        question: 'Does DMS have a partnership or referral program?',
        answer: 'Yes—if you refer a client or brand to us for software development, mobile apps, or AI integration, you earn referral bonuses or collaborative partnership perks upon project kickoff.'
      }
    ];
    items.forEach((item) => {
      const container = [...section.querySelectorAll('div')]
        .filter((element) => element.className.includes('flex flex-col') && element.innerText?.includes('Is Deep Minded Services Limited free?') || element.innerText?.includes('What does Professional unlock?') || element.innerText?.includes('Does Deep Minded Services Limited have a referral system?'))
        .sort((first, second) => first.textContent.length - second.textContent.length)[0];
      if (!container) return;
      container.innerHTML = `<div class="text-H4-38-R font-Outfit mobile:!text-M-H5-20-R tablet:!text-M-H4-24-R">${item.question}</div><div class="text-H5-28-L font-Outfit text-Grey mobile:!text-M-P1-16-R tablet:!text-M-H5-20-R">${item.answer}</div>`;
      container.classList.add('dms-faq-content');
    });
  };

  const replaceContactCta = () => {
    const footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.dms-footer-project')) return;
    const cta = footer.children[0]?.firstElementChild;
    if (cta) {
      cta.innerHTML = `
        <div class="dms-footer-project">
          <h5>Ready to Build Something Extraordinary?</h5>
          <p>Partner with <strong>Deep Minded Services Limited (DMS)</strong> to engineer high-performance mobile apps, immersive WebGL experiences, and custom AI solutions that dominate your market. Let's turn your vision into production reality.</p>
          <h6>Start Your Project Today</h6>
          <div class="dms-footer-actions"><a href="/support">Book a Discovery Call</a><a href="/support">Contact Our Team</a></div>
          <nav class="dms-footer-navigation" aria-label="Footer Navigation & Links">
            <strong>Footer Navigation &amp; Links</strong>
            <div><a href="/">Home</a><a href="/features">Services</a><a href="/features">AI Agents</a><a href="/">Portfolio</a><a href="/support">Contact</a></div>
            <strong>Connect With Us</strong>
            <div><a href="https://www.linkedin.com/company/flowty-co">LinkedIn</a><a href="https://www.instagram.com/flowty.co/">Instagram</a><a href="https://github.com/">GitHub</a></div>
            <strong>Legal &amp; Compliance</strong>
            <div><a href="/terms-of-use">Terms of Use</a><a href="/privacy-policy">Privacy Policy</a></div>
            <span>© 2026 Deep Minded Services Limited (DMS). All rights reserved.</span>
          </nav>
        </div>`;
    }
    const download = [...footer.querySelectorAll('a')].find((element) => element.innerText.trim() === 'Download');
    if (download) {
      download.textContent = 'Contact';
      download.setAttribute('aria-label', 'Contact Deep Minded Services Limited');
    }
    footer.querySelectorAll('a').forEach((link) => {
      const labels = { Features: 'Services', Referral: 'AI Agents', Pricing: 'Portfolio' };
      const label = link.innerText.trim();
      if (labels[label]) link.textContent = labels[label];
    });
  };

  const replaceBranding = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      if (oldBrand.test(root.nodeValue)) {
        root.nodeValue = root.nodeValue.replace(oldBrand, brand);
      }
      oldBrand.lastIndex = 0;
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
    root.querySelectorAll?.('*').forEach((element) => {
      for (const attribute of element.attributes) {
        if (attribute.name === 'href' || attribute.name === 'src') continue;
        if (oldBrand.test(attribute.value)) {
          element.setAttribute(attribute.name, attribute.value.replace(oldBrand, brand));
        }
        oldBrand.lastIndex = 0;
      }
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(replaceBranding);
    document.title = document.title.replace(oldBrand, brand);
    oldBrand.lastIndex = 0;
  };

  const applyDmsContent = () => {
    replaceDownloadContent();
    disableExternalLinks();
    removeQrContent();
    replaceHeroContent();
    replaceNeedsContent();
    replaceWristHeading();
    replaceStatsContent();
    replaceIndustriesContent();
    replaceGetMoreStats();
    replaceIndustryIntro();
    replaceReviewContent();
    replaceFaqContent();
    replaceContactCta();
  };

  let replacementTimer;
  const scheduleReplacements = (delay = 1200) => {
    if (replacementTimer) return;
    replacementTimer = setTimeout(() => {
      replacementTimer = undefined;
      applyDmsContent();
    }, delay);
  };
  const refreshAfterRoute = () => {
    scheduleReplacements(1200);
    setTimeout(applyDmsContent, 3200);
  };

  replaceBranding(document);
  disableExternalLinks(document);
  removeQrContent(document);
  new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        replaceBranding(node);
        disableExternalLinks(node);
        removeQrContent(node);
      });
    });
    scheduleReplacements();
  }).observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (link && link.origin === location.origin) refreshAfterRoute();
  }, true);
  window.addEventListener('popstate', refreshAfterRoute);
  let lastPath = location.pathname;
  const checkRoute = () => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      refreshAfterRoute();
    }
  };
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    checkRoute();
    return result;
  };
  history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    checkRoute();
    return result;
  };
  setInterval(checkRoute, 500);
  if (document.readyState === 'complete') scheduleReplacements(1500);
  else window.addEventListener('load', () => scheduleReplacements(1500), { once: true });
})();
