const fs = require('fs');
const path = require('path');

const file = 'c:/Users/PC/Desktop/AI Agents And Automations/web3.esqrd.co/index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Title & Meta tags
html = html.replace(
  /<title>.*?<\/title>/,
  '<title>Autonomous AI Agents & Enterprise Automation Services | Deep Minded Services Limited (DMS)</title>'
);

html = html.replace(
  /<meta name="description" content=".*?">/,
  '<meta name="description" content="Custom AI agent engineering by Deep Minded Services Limited: Multi-LLM telemetry engines, real-time voice assistants, 24/7 autonomous support bots, and Playwright web automation pipelines.">'
);

html = html.replace(
  /<meta name="keywords" content=".*?">/,
  '<meta name="keywords" content="AI Agents, Autonomous AI, Multi-LLM Telemetry, Asynchronous Python, FastAPI, Voice AI, Vapi, ElevenLabs, Playwright Automation, AI Agentic Workflows, Deep Minded Services Limited, Zerion AI">'
);

html = html.replace(
  /<meta property="og:title" content=".*?">/,
  '<meta property="og:title" content="Autonomous AI Agents & Enterprise Automation Services | DMS">'
);

html = html.replace(
  /<meta property="og:description" content=".*?">/,
  '<meta property="og:description" content="Production-ready AI agent engineering: Multi-model consensus, voice synthesis, automated web scraping, and 24/7 self-healing microservice daemons.">'
);

html = html.replace(
  /<meta name="twitter:title" content=".*?">/,
  '<meta name="twitter:title" content="Autonomous AI Agents & Enterprise Automation Services | DMS">'
);

html = html.replace(
  /<meta name="twitter:description" content=".*?">/,
  '<meta name="twitter:description" content="Production-ready AI agent engineering: Multi-model consensus, voice synthesis, automated web scraping, and 24/7 self-healing microservice daemons.">'
);

html = html.replace(
  /<meta name="apple-mobile-web-app-title" content=".*?">/,
  '<meta name="apple-mobile-web-app-title" content="Deep Minded Services Limited | DMS">'
);

// 2. Preloader
html = html.replace(
  /<div class="preloader__text" data-ready=".*?" data-astro-cid-sckkx6r4="">[\s\S]*?<\/div>/,
  `<div class="preloader__text" data-ready="SYSTEM ONLINE — DMS AI CORE" data-astro-cid-sckkx6r4="">
INITIALIZING AI ENGINE...
</div>`
);

// 3. Header Logo & Badge & Audio
const dmsLogoHtml = `<a class="header__logo" href="/" aria-label="DEEP MINDED SERVICES LIMITED" style="display:flex;align-items:center;text-decoration:none;gap:10px;">
<img src="/images/dms-logo.jpg" alt="DMS Logo" style="height:32px;width:32px;object-fit:contain;border-radius:4px;box-shadow:0 0 10px rgba(153,137,99,0.3);">
<span style="font-family:'Play',sans-serif;font-weight:700;font-size:14px;letter-spacing:0.08em;color:#fff;white-space:nowrap;">DEEP MINDED SERVICES LIMITED</span>
</a>`;

html = html.replace(/<a class="header__logo svg svg--current-color"[\s\S]*?<\/a>/, dmsLogoHtml);

// Badge replacement
html = html.replace(
  /aria-label="CSS Design Award - Special Kudos Award 2026"/,
  'aria-label="Production AI Engineering Studio — 2026"'
);

// Header Audio control labels
html = html.replace(/data-label-on="Sound ON" data-label-off="Sound OFF">[\s\S]*?Sound OFF/, 'data-label-on="Audio ON" data-label-off="Audio OFF">\nAudio OFF');

// Header CTA button
html = html.replace(
  /<span class="btn__text">[\s\r\n]*Contact Us[\s\r\n]*<\/span>/,
  '<span class="btn__text">\nDeploy AI Agents\n</span>'
);

// 4. Section 1: Hero Orbit Points & Subtitles & Title
// Points:
html = html.replace(
  /<span class="text">[\s\r\n]*NFT & tokens[\s\r\n]*<\/span>/,
  '<span class="text">\nMulti-LLM Consensus\n</span>'
);
html = html.replace(
  /aria-label="NFT & tokens"/,
  'aria-label="Multi-LLM Consensus"'
);

html = html.replace(
  /<span class="text">[\s\r\n]*Wallet Integration[\s\r\n]*<\/span>/,
  '<span class="text">\nReal-Time AI Voice\n</span>'
);
html = html.replace(
  /aria-label="Wallet Integration"/,
  'aria-label="Real-Time AI Voice"'
);

html = html.replace(
  /<span class="text">[\s\r\n]*Blockchain[\s\r\n]*<\/span>/,
  '<span class="text">\nAsync Python Engine\n</span>'
);
html = html.replace(
  /aria-label="Blockchain"/,
  'aria-label="Async Python Engine"'
);

html = html.replace(
  /<span class="text">[\s\r\n]*Smart contracts[\s\r\n]*<\/span>/,
  '<span class="text">\nWeb Automation\n</span>'
);
html = html.replace(
  /aria-label="Smart contracts"/,
  'aria-label="Web Automation"'
);

// Subtitles
html = html.replace(
  /<h2 class="heading heading--style-3 section__subtitle section__subtitle--left js-subtitle-left">[\s\S]*?<\/h2>/,
  `<h2 class="heading heading--style-3 section__subtitle section__subtitle--left js-subtitle-left">
Multi-model telemetry, voice agents, scraping pipelines, and autonomous support.
</h2>`
);

html = html.replace(
  /<h2 class="heading heading--style-3 section__subtitle section__subtitle--right js-subtitle-right">[\s\S]*?<\/h2>/,
  `<h2 class="heading heading--style-3 section__subtitle section__subtitle--right js-subtitle-right">
Deterministic by design.<br>
Self-healing by default. Enterprise AI.
</h2>`
);

// Main Heading
html = html.replace(
  /<h1 class="heading heading--style-1 section__title js-title">[\s\S]*?<\/h1>/,
  `<h1 class="heading heading--style-1 section__title js-title">
Engineering Autonomous
				<span class="color-gold">AI Agents</span> &amp;&nbsp;Real-Time Automation Systems
</h1>`
);

// Hero sound button label
html = html.replace(/data-label-on="Sound ON" data-label-off="Sound OFF">[\s\S]*?Sound OFF/, 'data-label-on="Audio ON" data-label-off="Audio OFF">\nAudio OFF');

// 5. Section 2: Our Results
html = html.replace(
  /<h2 class="section__title heading heading--style-2">[\s\r\n]*Our Results[\s\r\n]*<\/h2>/,
  '<h2 class="section__title heading heading--style-2">\nOur AI System Performance\n</h2>'
);

// Replace Results Slides
// Slide 1
html = html.replace(
  /<div class="results-screen__number">[\s\r\n]*10\+[\s\r\n]*<\/div>[\s\r\n]*<div class="results-screen__measure">[\s\r\n]*Million Dollars[\s\r\n]*<\/div>/,
  '<div class="results-screen__number">\nSub-100ms\n</div>\n<div class="results-screen__measure">\nTelemetry\n</div>'
);
html = html.replace(
  /Our systems securely manage over \$10 million in assets, ensuring full control over financial flows and on-chain transactions\./,
  'Our Zerion AI telemetry engine evaluates high-frequency WebSocket data streams and executes multi-LLM consensus in milliseconds.'
);

// Slide 2
html = html.replace(
  /<div class="results-screen__number">[\s\r\n]*10k\+[\s\r\n]*<\/div>[\s\r\n]*<div class="results-screen__measure">[\s\r\n]*Users[\s\r\n]*<\/div>/,
  '<div class="results-screen__number">\n5M+\n</div>\n<div class="results-screen__measure">\nDaily Actions\n</div>'
);
html = html.replace(
  /Supported by our infrastructure, ensuring stability even under peak load\./,
  'Autonomous agents and Playwright scraping daemons running continuously without system failure or rate-limit blocks.'
);

// Slide 3
html = html.replace(
  /<div class="results-screen__number">[\s\r\n]*50%[\s\r\n]*<\/div>[\s\r\n]*<div class="results-screen__measure">[\s\r\n]*Time Saved[\s\r\n]*<\/div>/,
  '<div class="results-screen__number">\n80%\n</div>\n<div class="results-screen__measure">\nCost & Time Saved\n</div>'
);
html = html.replace(
  /An intuitive interface with AI helps teams reduce time spent on management and analytics\./,
  'Asynchronous Python and Multi-LLM routing reduce operational overhead while accelerating task execution.'
);

// Slide 4
html = html.replace(
  /<div class="results-screen__number">[\s\r\n]*24\/7[\s\r\n]*<\/div>[\s\r\n]*<div class="results-screen__measure">[\s\r\n]*Support[\s\r\n]*<\/div>/,
  '<div class="results-screen__number">\n24/7\n</div>\n<div class="results-screen__measure">\nSelf-Healing\n</div>'
);
html = html.replace(
  /Provided by our team to ensure continuous protection of your systems and instant response and resolution of any incidents\./,
  'Systemd background worker daemons with automated reconnect logic ensuring zero-downtime AI agent execution.'
);

// Slide 5
html = html.replace(
  /<div class="results-screen__number">[\s\r\n]*2 x[\s\r\n]*<\/div>[\s\r\n]*<div class="results-screen__measure">[\s\r\n]*Faster Launch[\s\r\n]*<\/div>/,
  '<div class="results-screen__number">\n3x\n</div>\n<div class="results-screen__measure">\nFaster Deployment\n</div>'
);
html = html.replace(
  /Delivered by combining AI-driven workflows, deep industry experience, and custom-built solutions, ensuring both speed and long-term system stability\./,
  'Pre-architected Python/FastAPI microservices and plug-and-play agent connectors accelerate production release timelines.'
);

// 6. Section 3: Our Services
html = html.replace(
  /<h2 class="section__title heading heading--style-2">[\s\r\n]*Our Services[\s\r\n]*<\/h2>/,
  '<h2 class="section__title heading heading--style-2">\nOur Autonomous AI Capabilities\n</h2>'
);
html = html.replace(
  /<h3 class="section__subtitle heading heading--style-3">[\s\S]*?Full Range of Blockchain Development and Security Management[\s\S]*?<\/h3>/,
  '<h3 class="section__subtitle heading heading--style-3">\nFull Stack AI Agent Engineering and Process Automation\n</h3>'
);

// Service 1: Smart Contract Development -> Multi-LLM Telemetry & Consensus Engines
html = html.replace(
  /Smart Contract Development and Audit/,
  'Multi-LLM Telemetry & Consensus Engines'
);
html = html.replace(
  /Design and development of smart contracts tailored to your business logic/,
  'Multi-model voting architecture combining DeepSeek V4, Gemini 3.6 Flash, and GPT'
);
html = html.replace(
  /Secure development with full project testing/,
  'Real-time WebSocket data ingestion and dynamic indicator processing'
);
html = html.replace(
  /Independent audit: vulnerability detection, logical errors, optimization/,
  'Strict JSON schema enforcement and prompt guardrails preventing hallucination'
);
html = html.replace(
  /Support for EVM, Solana, and other networks/,
  'Asynchronous signal dispatching and custom execution hooks'
);

// Service 2: Weekly Stability -> Enterprise Real-Time AI Voice Assistants
html = html.replace(
  /Weekly Stability and Security Monitoring/,
  'Enterprise Real-Time AI Voice Assistants'
);
html = html.replace(
  /Continuous monitoring of client systems/,
  'Ultra-low latency audio processing pipelines combining Speech-to-Text and TTS engines'
);
html = html.replace(
  /Detection of anomalies, suspicious transactions, and abnormal load/,
  'Integration with ElevenLabs API, Vapi, and Twilio automated call routing'
);
html = html.replace(
  /Weekly reports with recommendations/,
  'Natural conversational memory for dynamic outbound and inbound customer phone calls'
);
html = html.replace(
  /Real-time alerts via Slack and Telegram/,
  'Custom fallback logic for human operator handoff'
);

// Service 3: Wallet Integration -> 24/7 Autonomous Customer Support Bots
html = html.replace(
  /Wallet Integration and Billing/,
  '24/7 Autonomous Customer Support Bots'
);
html = html.replace(
  /Integration of MetaMask, WalletConnect, Coinbase Wallet, and other wallets/,
  'Multi-platform conversational agents integrated with Telegram, WhatsApp, and Web APIs'
);
html = html.replace(
  /Configuration of transaction flows/,
  'Context-aware vector database querying (RAG) using PostgreSQL / Supabase'
);
html = html.replace(
  /Development of on-chain payment systems and automated payments/,
  'Automated ticket resolution, booking execution, and CRM updates'
);
html = html.replace(
  /Setup of fees, limits, and whitelists/,
  'Live agent escalation hooks and real-time conversation logging'
);

// Service 4: License Management -> Headless Web Automation & Data Scraping
html = html.replace(
  /License Management System and Sales Analytics/,
  'Headless Web Automation & Data Scraping'
);
html = html.replace(
  /Hybrid license management/,
  'Asynchronous Playwright browser automation engines'
);
html = html.replace(
  /Sales dashboards: revenue, active licenses, and performance trends/,
  'Multi-proxy routing, anti-bot bypass mechanisms, and session management'
);
html = html.replace(
  /API for integration with CRM systems and external services/,
  'Automated end-to-end data extraction and live database syncing (operating 24/7 on dedicated Linux VPS)'
);

// Service 5: NFT Infrastructure -> Custom Agentic Workflow Architecture
html = html.replace(
  /NFT Infrastructure/,
  'Custom Agentic Workflow Architecture'
);
html = html.replace(
  /Creation of NFT collections/,
  'Multi-agent supervisor networks directing specialized sub-agents'
);
html = html.replace(
  /NFTs for brands, games, and loyalty programs/,
  'Asynchronous task queue distribution powered by Celery, Redis, and RabbitMQ'
);
html = html.replace(
  /Storage configuration/,
  'Custom API wrappers and RESTful microservices built in Python & FastAPI'
);
html = html.replace(
  /User minting dashboard/,
  'Production monitoring dashboards tracking LLM latency, token usage, and execution status'
);

// 7. Section 4: Technology Stack
html = html.replace(
  /<h2 class="section__title heading heading--style-2">[\s\r\n]*Technology Stack[\s\r\n]*<\/h2>/,
  '<h2 class="section__title heading heading--style-2">\nEnterprise AI Tech Stack\n</h2>'
);

// Categories
html = html.replace(
  /<div class="technology-screen__category technology-screen__category--1">[\s\S]*?Blockchain[\s\S]*?<\/div>/,
  '<div class="technology-screen__category technology-screen__category--1">\nAI & LLMs\n</div>'
);
html = html.replace(
  /<div class="technology-screen__category technology-screen__category--2">[\s\S]*?Frontend[\s\S]*?<\/div>/,
  '<div class="technology-screen__category technology-screen__category--2">\nAutomation & Voice\n</div>'
);
html = html.replace(
  /<div class="technology-screen__category technology-screen__category--3">[\s\S]*?Backend[\s\S]*?<\/div>/,
  '<div class="technology-screen__category technology-screen__category--3">\nBackend & Databases\n</div>'
);

// Tech item names
html = html.replace(/<span class="sr-only">Technology <\/span>Solidity/g, '<span class="sr-only">Technology </span>Python 3.11+');
html = html.replace(/<span class="sr-only">Technology <\/span>Etherium Network/g, '<span class="sr-only">Technology </span>FastAPI / AsyncIO');
html = html.replace(/<span class="sr-only">Technology <\/span>Solana/g, '<span class="sr-only">Technology </span>DeepSeek V4');
html = html.replace(/<span class="sr-only">Technology <\/span>Ethers\.js/g, '<span class="sr-only">Technology </span>Gemini 3.6 Flash');
html = html.replace(/<span class="sr-only">Technology <\/span>Wagmi/g, '<span class="sr-only">Technology </span>OpenAI API');
html = html.replace(/<span class="sr-only">Technology <\/span>RainbowKit/g, '<span class="sr-only">Technology </span>Playwright');
html = html.replace(/<span class="sr-only">Technology <\/span>ConnectKit/g, '<span class="sr-only">Technology </span>ElevenLabs API');
html = html.replace(/<span class="sr-only">Technology <\/span>React/g, '<span class="sr-only">Technology </span>Vapi / Twilio');
html = html.replace(/<span class="sr-only">Technology <\/span>Vue\.js/g, '<span class="sr-only">Technology </span>PostgreSQL / Supabase');
html = html.replace(/<span class="sr-only">Technology <\/span>JavaScript/g, '<span class="sr-only">Technology </span>Redis / Celery');
html = html.replace(/<span class="sr-only">Technology <\/span>Golang/g, '<span class="sr-only">Technology </span>Docker');
html = html.replace(/<span class="sr-only">Technology <\/span>PHP/g, '<span class="sr-only">Technology </span>Linux VPS / Systemd');
html = html.replace(/<span class="sr-only">Technology <\/span>RUST/g, '<span class="sr-only">Technology </span>WebSockets & gRPC');

// 8. Section 5: About Us
html = html.replace(
  /<h2 class="section__title heading heading--style-2">[\s\r\n]*About ESQRD[\s\r\n]*<\/h2>/,
  '<h2 class="section__title heading heading--style-2">\nAbout Deep Minded Services Limited (DMS)\n</h2>'
);

// Slide 1
html = html.replace(
  /The ESQRD team \(Warsaw, Poland\) is an experienced group of developers specializing in Web3 and blockchain solutions, including smart contracts, payment systems, digital product licensing, and NFT mechanics\. We ensure maximum stability, security, and protection of projects, guaranteeing reliable operation of applications and platforms\./,
  'Deep Minded Services Limited (DMS) is an elite software engineering studio specializing in autonomous AI agents, multi-LLM telemetry, low-latency voice pipelines, and high-throughput Python backends. We build resilient software architectures engineered to automate complex enterprise workflows with absolute speed and reliability.'
);
html = html.replace(
  /Senior-Level Team and Development Focus/,
  'Production-Grade AI & Systems Engineering'
);
html = html.replace(
  /<a class="btn btn--default btn--with-icon" href="https:\/\/esqrd\.co\/" target="_blank">[\s\S]*?<span class="btn__text">[\s\r\n]*Visit Our Website[\s\r\n]*<\/span>/,
  `<a class="btn btn--default btn--with-icon" href="https://github.com/ahsabaahsab8-sudo" target="_blank">
<span class="btn__lines" aria-hidden="true">
<span class="line line--1"></span>
<span class="line line--2"></span>
<span class="line line--3"></span>
<span class="line line--4"></span>
<span class="line line--5"></span>
<span class="line line--6"></span>
</span>
<span class="btn__text">
Explore GitHub Repositories
</span>`
);

// Slide 2
html = html.replace(
  /We build and operate systems that handle millions of dollars in transactions and thousands of users simultaneously - without compromising speed or performance\. Our solutions deliver enterprise-grade data protection, ensuring the highest level of security for all sensitive information\./,
  'We engineer systems that execute millions of daily automated tasks, evaluate high-frequency data feeds, and power autonomous customer interactions without human lag or server downtime. Our microservices are built on deterministic standards, ensuring complete data security and isolated tenant execution.'
);

// Slide 3
html = html.replace(
  /We are trusted by global brands and technology leaders: Mawari, SuperPhoenix, Adidas, F1, and Pizza Hut\. These companies choose us for our reliability, the quality of our solutions, and our ability to launch projects that truly work and deliver results\./,
  `Our proven track record includes engineering Zerion AI (a multi-model telemetry and signal evaluation engine), Nature AI systems, and automated voice calling platforms for high-growth tech startups and B2B enterprises.<br><br>
<strong style="color:#998963;font-size:14px;letter-spacing:0.05em;">KEY SOLUTIONS DEPLOYED:</strong><br>
• Zerion AI Telemetry &bull; Nature AI Platform &bull; Autonomous Calling Bots &bull; Playwright Scraping Systems &bull; Multi-Tenant SaaS Backends`
);

// Slide 4
html = html.replace(
  /We provide 24\/7 support for any type of project, with continuous monitoring, instant issue resolution, and full system protection\. Our reliability is proven by production systems handling large-scale data and long-term client partnerships\./,
  'We provide 24/7 infrastructure monitoring, systemd daemon management, and continuous optimization for every AI agent we deploy.'
);
html = html.replace(
  /Because we understand that your idea needs a system that doesn’t slow down your growth - but scales alongside your ambition\./,
  'Because we understand that your company needs a system that doesn’t crash under load—but scales seamlessly with your business ambition.'
);

// Change all About section "Contact Us" buttons to "Deploy AI Agents"
html = html.replace(/<span class="btn__text">[\s\r\n]*Contact Us[\s\r\n]*<\/span>/g, '<span class="btn__text">\nDeploy AI Agents\n</span>');

// 9. Section 6: Contact Us
html = html.replace(
  /Create Your <span class="color-gold">Web3 Project<\/span> With&nbsp;Us/,
  'Deploy Custom <span class="color-gold">AI Agents</span> With&nbsp;DMS'
);

// Form labels
html = html.replace(
  /<label class="form__label" for="user-phone">[\s\r\n]*Phone Number[\s\r\n]*<\/label>/,
  '<label class="form__label" for="user-phone">\nPhone Number / Telegram Handle\n</label>'
);

html = html.replace(
  /<label class="form__label" for="message">[\s\r\n]*Message[\s\r\n]*<\/label>/,
  '<label class="form__label" for="message">\nProject Requirements (AI Agents / Voice / Automation / SaaS)\n</label>'
);

// Form submit button
html = html.replace(
  /data-sending="Sending\.\.\." data-label="Send Form">/,
  'data-sending="Deploying Request..." data-label="Initialize Project Sprint">'
);
html = html.replace(
  /<span class="btn__text">[\s\r\n]*Send Form[\s\r\n]*<\/span>/,
  '<span class="btn__text">\nInitialize Project Sprint\n</span>'
);

// Success modal
html = html.replace(
  /<div class="form-message__title heading heading--style-2 color-gold">[\s\r\n]*Thank You![\s\r\n]*<\/div>/,
  '<div class="form-message__title heading heading--style-2 color-gold">\nSprint Request Received!\n</div>'
);
html = html.replace(
  /<div class="form-message__description">[\s\r\n]*The form has been successfully submitted, we will contact you shortly\.[\s\r\n]*<\/div>/,
  '<div class="form-message__description">\nOur technical engineering team will contact you within 12 hours with an architectural roadmap.\n</div>'
);
html = html.replace(
  /<span class="btn__text">[\s\r\n]*Back to Home[\s\r\n]*<\/span>/g,
  '<span class="btn__text">\nBack to Console\n</span>'
);

// Socials
html = html.replace(
  /<h2 class="section__subtitle heading heading--style-3">[\s\r\n]*Our Socials[\s\r\n]*<\/h2>/,
  '<h2 class="section__subtitle heading heading--style-3">\nOfficial Channels\n</h2>'
);

// Social links
html = html.replace(
  /href="https:\/\/www\.linkedin\.com\/company\/esqrd\/" aria-label="Follow Us On LinkedIn"/,
  'href="https://www.linkedin.com/company/esqrd/" aria-label="LinkedIn: Deep Minded Services Limited"'
);

html = html.replace(
  /href="https:\/\/clutch\.co\/profile\/esqrd" aria-label="Follow Us On Clutch"/,
  'href="https://github.com/ahsabaahsab8-sudo" aria-label="GitHub: github.com/ahsabaahsab8-sudo"'
);

html = html.replace(
  /href="https:\/\/x\.com\/esqrd_co" aria-label="Follow Us On X"/,
  'href="mailto:contact@deepmindedservices.com" aria-label="Direct Email: contact@deepmindedservices.com"'
);

// 10. Footer Logo & Copyright
const footerLogoHtml = `<div class="footer__logo" aria-label="DEEP MINDED SERVICES LIMITED" style="display:flex;align-items:center;gap:10px;">
<img src="/images/dms-logo.jpg" alt="DMS Logo" style="height:32px;width:32px;object-fit:contain;border-radius:4px;">
<span style="font-family:'Play',sans-serif;font-weight:700;font-size:14px;letter-spacing:0.08em;color:#fff;">DEEP MINDED SERVICES LIMITED (DMS)</span>
</div>`;

html = html.replace(/<div class="footer__logo svg" aria-label="WEB3 ESQRD">[\s\S]*?<\/div>/, footerLogoHtml);

html = html.replace(
  /ESQRD Copyright\. All Rights Reserved\. <span class="copyright">2026©<\/span>/,
  '© 2026 Deep Minded Services Limited (DMS). All Rights Reserved.'
);

fs.writeFileSync(file, html, 'utf8');
console.log('Successfully updated index.html with new DMS content!');
