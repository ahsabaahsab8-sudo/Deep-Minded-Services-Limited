(function () {
  var replacements = {
    'ZERO - Distribute the Future': 'DMS SaaS Engine - Scale The Future',
    'SAVE THE FUTURE. CREATE A DAO. Supercharge your community with tokenization, on-chain voting, and secure messaging.': 'ENGINEER THE FUTURE. SCALE YOUR SAAS. Production-ready platforms for enterprise traffic.',
    'Intro': 'Intro',
    'Zero OS': 'DMS Engine',
    'Integrations': 'Database & Infrastructure',
    'Zero ID': 'DMS Identity',
    'Launch ZERO': 'Contact',
    'Hub': 'Book a Call',
    'Community': 'Global Network',
    'ZERO Hub': 'DMS Engine Hub',
    'JOIN ZERO': 'START YOUR SAAS PROJECT',
    'Join Zero': 'Start Your SaaS Project',
    '© 2023 Zero': '© 2026 Deep Minded Services Limited (DMS). All Rights Reserved.',
    'DistributeThe Future': 'Engineering Scalable SaaS Platforms',
    'Distribute The Future': 'Engineering Scalable SaaS Platforms',
    'Zero is a new OS that is secure, sovereign, decentralized, censorship-resistant, community owned and open-source.': 'Deep Minded Services Limited (DMS) is an elite software engineering studio building production-ready, multi-tenant SaaS platforms engineered with fault-tolerant database architecture, microservice backends, and high-converting user web interfaces built to handle enterprise-level traffic.',
    '2023': '2026',
    'A FORK IN TIME': 'A PARADIGM SHIFT IN SAAS ENGINEERING',
    'PROBLEM': 'THE PROBLEM',
    'SOLUTION': 'THE SOLUTION',
    "Big tech has taken control of the simulation. They own your online identity, surveil your every move and make trillions off of your data.": 'Legacy web platforms suffer from monolithic bloat, unindexed database bottlenecks, fragile tenant isolation, and slow API response times that destroy user retention.',
    'Sovereignty, security, privacy and transparency are fundamental tenets of internet platforms moving forward. The future will be owned by everyone.': 'Resilient backend microservices, optimized multi-tenant database schemas, real-time WebSockets, automated subscription pipelines, and 60FPS dynamic WebGL admin interfaces form the core foundation of scalable SaaS products.',
    "IT'S TIME TO SHIFT THE TIMELINE": "IT'S TIME TO ELEVATE YOUR TECH STACK",
    'DISTRIBUTE THE POWER AND REIMAGINE THE NOW': 'DISTRIBUTE COMPUTE POWER AND REIMAGINE ENTERPRISE SOFTWARE',
    'Your Web3 OS': 'Full-Stack SaaS Architecture',
    'Zero ships with six native apps and is infinitely extensible': 'DMS Engine ships with six core cloud modules and is infinitely extensible via custom enterprise APIs.',
    'Chat': 'Compute',
    'Trade': 'Database',
    'Share': 'Billing',
    'Vote': 'Auth',
    'Stake': 'Interface',
    'Zero ID App': 'DMS Identity & API Vault',
    'Communicate with confidence and clarity': 'Distributed Backend Microservices',
    'Encrypted audio calling, video conferencing and messaging.': 'Low-latency asynchronous server pipelines, task queues, and REST/gRPC API layers.',
    'Encrypted messaging.': 'Scalable Cloud Engine.',
    'Say goodbye to your Orwellian overlords. Securely connect with fellow creators with text, voice, video, GIFs and file messaging.': 'Say goodbye to server downtime, unhandled request timeouts, and backend bottlenecks. Connect frontend platforms with high-throughput API gateway layers, real-time WebSocket feeds, background worker queues, and automated daemon monitoring.',
    'Rich messaging: text, emojis, GIFs, & files.': 'Low-latency RESTful APIs and real-time bidirectional WebSocket feeds.',
    'Public & private channels.': 'Asynchronous background job processing and task queue orchestration.',
    'Voice memos.': 'Automated health checks, process monitoring, and self-healing cloud daemons.',
    'Secure audio and video calling.': 'Multi-cloud infrastructure orchestration across AWS, GCP, DigitalOcean, and high-performance Linux VPS.',
    'Group video conferencing.': 'Auto-scaling microservice container clusters.',
    'High-definition video and audio calling.': 'Row-Level Security (RLS), ACID compliance, sub-millisecond query execution, and real-time telemetry analytics.',
    'Using Zero Video and Audio replaces your regular phone connection, removes long-distance fees, and secures your video calls.': 'Deploying optimized database pipelines eliminates query latency, prevents data leaks across tenant environments, and empowers SaaS users with instantaneous data visualizations and live dashboards.',
    'Secure video & audio calling.': 'Multi-tenant database strategies using isolated schemas and shared databases with Row-Level Security.',
    'Public & private video channels.': 'High-performance indexing, query optimization, and connection pooling.',
    'Integrated live chat.': 'Dual-layer storage with PostgreSQL, Redis caching, and NoSQL document stores.',
    'Discover the power of digital collectibles': 'Monetize Your SaaS Infrastructure',
    'Explore, launch and trade NFTs.': 'Flexible Stripe, custom gateways, and automated subscription workflows.',
    'The future of digital ownership.': 'The Future of Automated SaaS Revenue.',
    "It’s now possible to own anything digitally. Easily mint, share and trade NFTs – secure, transparent and tradable assets on the Ethereum blockchain.": 'Turn complex software features into predictable monthly recurring revenue. Launch, manage, and scale tiered plans, usage-based metering, and automated enterprise invoicing securely.',
    'Nested collections.': 'Multi-tier subscription engines: Freemium, Pro, Scale, and Enterprise.',
    'Proof of ownership.': 'Automated invoice generation, dunning management, and webhook listeners.',
    'Transparency.': 'Usage-based billing metrics, credit consumption, and API rate metering.',
    'Automatic integration with OpenSea, LooksRare and more.': 'Multi-currency support and global payment gateway integrations.',
    'Reprogram your mind with sovereign social media': 'Enterprise Access Control & Data Isolation',
    'Transparent, censorship-resistant and sufficiently decentralized social media.': 'Role-Based Access Control (RBAC), OAuth2 SSO, and Zero-Trust Vaults.',
    'Proof of humanity with Zero ID.': 'Absolute Tenant Integrity.',
    'Zero limits bots and spam by requiring citizens to hold a unique, on-chain and sovereign Zero ID.': 'Eliminate unauthorized access, cross-tenant data leaks, and security vulnerabilities across frontend platforms, admin portals, and backend microservices.',
    'Know who you are speaking with.': 'Multi-Factor Authentication, OAuth2, SSO, and Magic Links.',
    'Reduce the likelihood of bot-farms and fake accounts.': 'Fine-grained Role-Based Access Control and feature permission matrices.',
    'Own your own identity; benefit from the value of your profile page.': 'Encrypted JWT rotation, session invalidation, and secure HTTP-only cookies.',
    'Create your own DAO': 'High-Converting WebGL Admin Dashboards',
    'Easily launch, coordinate and create value using Decentralized Autonomous Organizations.': 'Elevate user retention with fluid 3D graphics, interactive WebGL canvases, and responsive UI design.',
    'Make choices together.': 'Stand Out in Crowded B2B Markets.',
    'Utilize the power of DAOs to start, operate and scale natively digital cooperative organisations on the Ethereum blockchain.': 'Transform static SaaS admin panels into visually captivating, interactive digital experiences that increase product usage.',
    'Easily launch, find and join DAOs.': 'Real-time WebGL interactive canvas rendering in standard browsers.',
    'Create, vote and execute proposals.': 'GPU-accelerated 3D product visualizers and interactive data models.',
    'Create tasks and bounties.': 'Fluid 60FPS micro-interactions and scroll-triggered UI animations.',
    'Integrates with Gnosis SAFE.': 'Fully responsive web application layouts for desktop and mobile viewports.',
    'Get rewarded for your contributions': 'Enterprise API Key Management & Developer Gateways',
    'Leverage the power of Decentralized Finance to create reward structures for the people who build and grow your network.': 'Centralized identity layers, API key issuance, rate-limiting, and developer credential vaults.',
    'Add value. Earn token.': 'Zero Overhead. Total Control.',
    'Easily participate in community staking pools and receive rewards based on capital or work you contribute to the network.': 'Issue API keys, set request quotas, throttle heavy usage, and monetize your developer API ecosystem effortlessly.',
    'Easily create, stake and unstake tokens.': 'Instant API key generation, cryptographic hashing, and scope enforcement.',
    'Get paid for the value you contribute.': 'Automated rate-limiting, request throttling, and bandwidth metering.',
    'Participate in different staking pools with different risk/reward profiles.': 'Auto-generated OpenAPI and Swagger developer portals with API documentation.',
    'INTEGRATIONS': 'ENTERPRISE INTEGRATIONS',
    'Zero is secure, sovereign, decentralized, censorship-resistant, community owned and 100% open-source.': 'DMS SaaS Engine is secure, cloud-native, fully customizable, and built on modern full-stack web and database technologies.',
    'Freedom with Zero ID': 'Freedom with DMS SaaS Platform',
    'Purchase a Zero ID to receive citizenship to Nation Zero and worlds build on Zero.': 'Architect your software from day one to handle millions of daily API requests and database queries without degradation.',
    'Own your identity forever with no need to pay annual renewal fees.': 'Maintain total ownership of your codebase, user records, and database instances with zero vendor lock-in.',
    'Easily connect multiple unique wallets to your unique Zero ID, easily receive payments, sign smart contracts, verify your identity and participate in the Web3 economy.': 'Deploy on resilient cloud infrastructure backed by automated health checks, process monitoring, and zero-downtime CI/CD pipelines.',
    'Distribute the future.': 'Build The Future Of Enterprise SaaS.',
    'Get started by becoming a citizen of Zero or launching your own world.': 'Get started by scheduling an architectural review or launching your SaaS product development cycle with Deep Minded Services Limited.',
    'Launch ZERO': 'Contact',
    'Launch a World': 'Book Discovery Call'
  };

  function replaceText(node) {
    if (node.nodeType !== 3) return;
    var value = node.nodeValue;
    if (!value.trim()) return;
    Object.keys(replacements).forEach(function (source) {
      if (value.indexOf(source) !== -1) value = value.split(source).join(replacements[source]);
    });
    if (node.nodeValue !== value) node.nodeValue = value;
  }

  function apply() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) replaceText(node);
    document.title = replacements['ZERO - Distribute the Future'];
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = replacements['SAVE THE FUTURE. CREATE A DAO. Supercharge your community with tokenization, on-chain voting, and secure messaging.'];
    document.querySelectorAll('a[href]').forEach(function (link) {
      var text = link.textContent.trim();
      if (/zero\.tech|twitter\.com|t\.me|github\.com|zer0\.io|uniswap/i.test(link.href) || /Launch Project|Start SaaS Project|Book Discovery Call|Launch a World/i.test(text)) {
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    });
    document.querySelectorAll('.navbar-logo img').forEach(function (image) {
      image.style.display = 'none';
    });
    var logo = document.querySelector('.navbar-logo');
    if (logo && !logo.querySelector('.dms-logo')) {
      var mark = document.createElement('div');
      mark.className = 'dms-logo';
      mark.setAttribute('aria-label', 'DMS logo');
      mark.textContent = 'DMS';
      logo.appendChild(mark);
    }
  }

  function createContactModal() {
    if (document.getElementById('dmsContactModal')) return;
    var modal = document.createElement('div');
    modal.id = 'dmsContactModal';
    modal.innerHTML = '<div class="dms-contact-panel" role="dialog" aria-modal="true" aria-labelledby="dmsContactTitle"><button class="dms-contact-close" type="button" aria-label="Close contact form">&times;</button><p class="dms-contact-kicker">DMS ENGINE / CONTACT</p><h2 id="dmsContactTitle">Book a call.</h2><p class="dms-contact-copy">Tell us what you are building and our engineering team will get back to you.</p><div class="dms-call-details"><span>For team inquiries</span><a href="tel:+923008156021">+92 3008156021</a></div><form class="dms-contact-form"><label>Your Name<input name="name" type="text" autocomplete="name"></label><label>Your Gmail<input name="email" type="email" autocomplete="email" placeholder="you@gmail.com"></label><label>Your Company <span>(Optional)</span><input name="company" type="text" autocomplete="organization"></label><label class="dms-project-field">Your Project<textarea name="project" rows="4"></textarea></label><label>Your Number<input name="number" type="tel" autocomplete="tel"></label><button class="dms-contact-submit" type="submit">Save</button><p class="dms-contact-status" aria-live="polite"></p></form></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('.dms-contact-close')) modal.classList.remove('is-open');
    });
    modal.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      var form = event.currentTarget;
      var required = ['name', 'email', 'project', 'number'];
      var missing = required.some(function (name) { return !form.elements[name].value.trim(); });
      var email = form.elements.email.value.trim();
      var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var status = modal.querySelector('.dms-contact-status');
      if (missing) {
        status.className = 'dms-contact-status is-error';
        status.textContent = 'Please complete all required fields.';
        return;
      }
      if (!validEmail) {
        status.className = 'dms-contact-status is-error';
        status.textContent = 'Please enter a valid Gmail address.';
        return;
      }
      status.className = 'dms-contact-status';
      status.textContent = 'Saved. Your inquiry is ready for the DMS team.';
    });
  }

  function wireContactActions() {
    createContactModal();
    var launch = document.getElementById('launchZeroBtn');
    var book = document.getElementById('hubBtn');
    if (launch) {
      launch.querySelectorAll('.button-text').forEach(function (text) { text.textContent = 'Contact'; });
      launch.removeAttribute('href');
      launch.closest('a')?.removeAttribute('href');
      if (!launch.dataset.dmsWired) {
        launch.dataset.dmsWired = 'true';
        launch.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          document.getElementById('dmsContactModal').classList.add('is-open');
        }, true);
      }
    }
    if (book) {
      book.querySelectorAll('.button-text').forEach(function (text) { text.textContent = 'Book a Call'; });
      if (!book.dataset.dmsWired) {
        book.dataset.dmsWired = 'true';
        book.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          document.getElementById('dmsContactModal').classList.add('is-open');
        }, true);
      }
    }
  }

  function interceptBookCall(event) {
    var book = event.target.closest && event.target.closest('#hubBtn');
    if (!book) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = 'none';
      menu.setAttribute('aria-hidden', 'true');
    }
    createContactModal();
    document.getElementById('dmsContactModal').classList.add('is-open');
  }

  ['pointerdown', 'mousedown', 'click'].forEach(function (eventName) {
    document.addEventListener(eventName, interceptBookCall, true);
  });

  function scheduleApply() {
    apply();
    window.setTimeout(apply, 500);
    window.setTimeout(apply, 1500);
    window.setTimeout(apply, 3000);
    window.setTimeout(apply, 6000);
  }

  if (document.body) scheduleApply();
  else document.addEventListener('DOMContentLoaded', scheduleApply, { once: true });
  window.setTimeout(wireContactActions, 700);
  window.setTimeout(wireContactActions, 1800);
  window.setTimeout(wireContactActions, 3500);
})();
