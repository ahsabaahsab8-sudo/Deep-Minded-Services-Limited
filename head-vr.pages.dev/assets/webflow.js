/**
 * WEBFLOW CUSTOM LOGIC - IMMEDIATE EXECUTION
 * Fixes: "Target not found" & "NodeList" errors
 */

(function () {
    // --- SAFE DEFAULT FOR HAND TRACKING STATE ---
    if (typeof window.isPinching === 'undefined') {
        window.isPinching = false;
    }

    // --- FORCE START AT TOP ON RELOAD (important for Lenis + ScrollTrigger) ---
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);


    // =======================================
    // GLOBAL SECTION NAVIGATION FUNCTION
    // =======================================

    window.goToSection = function (direction) {
        const sections = gsap.utils.toArray(".track-section");
        const mainTrigger = ScrollTrigger.getById("mainScroll");
        if (!mainTrigger) return;

        const total = sections.length;

        let currentIndex = Math.round(mainTrigger.progress * (total - 1));

        if (direction === "next" && currentIndex < total - 1) {
            currentIndex++;
        } else if (direction === "prev" && currentIndex > 0) {
            currentIndex--;
        } else {
            return;
        }

        const targetProgress = currentIndex / (total - 1);
        const targetScroll = mainTrigger.start + (mainTrigger.end - mainTrigger.start) * targetProgress;

        gsap.to(window, {
            scrollTo: { y: targetScroll },
            duration: 2.2,
            ease: "power3.inOut"
        });
    };

    // =======================================
    // SNAP TO NEAREST SECTION (mid-point)
    // =======================================

    window.snapToNearestSection = function () {
        const sections = gsap.utils.toArray(".track-section");
        const mainTrigger = ScrollTrigger.getById("mainScroll");
        if (!sections.length || !mainTrigger) return;

        const total = sections.length;

        const rawProgress = (window.scrollY - mainTrigger.start) / (mainTrigger.end - mainTrigger.start);
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        let closestIndex = Math.round(clampedProgress * (total - 1));

        console.log("📌 Snapping to section index:", closestIndex, "from raw progress:", clampedProgress);

        const targetProgress = closestIndex / (total - 1);
        const targetScroll = mainTrigger.start + (mainTrigger.end - mainTrigger.start) * targetProgress;

        gsap.to(window, {
            scrollTo: { y: targetScroll },
            duration: 1.4,
            ease: "power3.inOut",
            onComplete: () => {
                ScrollTrigger.refresh();
            }
        });
    };




    // =================================================================
    // 1. MAIN ANIMATION RUNNER
    // =================================================================
    function runGsapAnimations() {
        console.log("🚀 GSAP: Starting Immediate Execution");

        // Safety: if Lenis isn't ready yet, wait for it
        if (!window.lenis) {
            console.log("⏳ Waiting for Lenis to initialize...");
            const waitForLenis = setInterval(() => {
                if (window.lenis) {
                    clearInterval(waitForLenis);
                    console.log("✅ Lenis detected, continuing setup");
                    initLenisSync();
                }
            }, 50);
        } else {
            initLenisSync();
        }

        function initLenisSync() {
            window.lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                window.lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
            console.log("✅ Lenis synced via GSAP ticker (single RAF loop)");
        }

        // ... rest of your code (scroll settings, animations, etc.)

        // --- B. SCROLL SETTINGS ---
        if (ScrollTrigger.isTouch === 1) {
            ScrollTrigger.normalizeScroll({ allowNestedScroll: true, lockAxis: false, momentum: true });
        }
        ScrollTrigger.config({ ignoreMobileResize: true });

        // --- C. FLAT WORD ANIMATION (Fixed) ---
        const flatElements = gsap.utils.toArray(".flat");

        flatElements.forEach(element => {
            // Use textContent instead of innerText so it works even when hidden by a preloader
            const rawText = element.textContent || "";
            if (!rawText.trim()) return;

            // Trim and normalize spaces (textContent reads HTML line-breaks, this cleans it up)
            const text = rawText.trim().replace(/\s+/g, ' ');

            element.innerHTML = text.split("").map(char =>
                char === " " ? `&nbsp;` : `<span style="display:inline-block; transform-origin: 50% 100%; line-height: 1; vertical-align: baseline;">${char}</span>`
            ).join("");

            const chars = gsap.utils.toArray(element.querySelectorAll("span"));

            if (chars.length === 0) {
                console.warn("GSAP: No characters found in .flat element", element);
                return;
            }

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    once: true
                }
            });

            tl.fromTo(chars,
                { scaleY: 0.1, scaleX: 1.8, y: 20, opacity: 0 },
                { scaleY: 1, scaleX: 1, y: -1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.6)", stagger: 0.02 }
            );

            tl.to(chars, {
                scaleY: 0.85, scaleX: 1.15,
                duration: 0.5, ease: "power1.inOut",
                yoyo: true, repeat: -1, repeatDelay: 2, stagger: 0.05
            });
        });

        // --- D. WAVE ANIMATION (Fixed) ---
        const waveElements = gsap.utils.toArray(".italic-wave");

        waveElements.forEach(element => {
            const rawText = element.textContent || "";
            if (!rawText.trim()) return;

            const text = rawText.trim().replace(/\s+/g, ' ');

            element.innerHTML = text.split("").map(char =>
                char === " " ? `&nbsp;` : `<span style="display:inline-block; transform-origin: center center;">${char}</span>`
            ).join("");

            const chars = gsap.utils.toArray(element.querySelectorAll("span"));

            if (chars.length === 0) return;

            gsap.to(chars, {
                keyframes: [
                    { scale: 1.15, rotationY: 45, duration: 0.2, ease: "power2.out" },
                    { scale: 1, rotationY: 0, duration: 0.5, ease: "power2.inOut" }
                ],
                stagger: { each: 0.04, repeat: -1, repeatDelay: 2.5 }
            });
        });

        // --- E. PLAYCANVAS SCROLL SYNC ---
        const pcFrame = document.getElementById("playcanvas-frame");
        const content = document.getElementById("page-content");
        const trackSections = gsap.utils.toArray(".track-section");

        window.cameraStops = [];

        if (content && trackSections.length > 0) {

            const calculateStops = () => {
                const totalHeight = content.offsetHeight - window.innerHeight;

                let stops = [];

                trackSections.forEach((section, index) => {

                    if (index === 0) {
                        stops.push(0);
                    } else {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;

                        const stopPoint =
                            (sectionTop + (sectionHeight / 1.6) - (window.innerHeight / 1.6))
                            / totalHeight;

                        stops.push(
                            Math.max(0, Math.min(1, stopPoint))
                        );
                    }
                });

                stops.push(1);

                window.cameraStops = [...new Set(stops)].sort((a, b) => a - b);
            };

            calculateStops();
            window.addEventListener("resize", calculateStops);

            // FIXED: Track scrub velocity to detect active scrolling WITHOUT intercepting events
            let lastProgress = -1;
            let isScrubMoving = false;
            let scrubSettleTimer = null;
            let lastSentProgress = -1;

            ScrollTrigger.create({
                id: "mainScroll",
                trigger: content,
                start: "top top",
                end: "bottom bottom",
                scrub: 3,

                snap: {
                    snapTo: (value) => {
                        if (isScrubMoving) return value;
                        if (window.isPinching) return value;
                        if (!window.cameraStops || window.cameraStops.length === 0) return value;
                        return gsap.utils.snap(window.cameraStops, value);
                    },
                    directional: false,
                    inertia: false,
                    duration: { min: 2.2, max: 2.2 },
                    delay: 0.4,
                    ease: "power3.inOut"
                },

                onUpdate: (self) => {
                    const progressDelta = Math.abs(self.progress - lastProgress);

                    if (progressDelta > 0.0005) {
                        isScrubMoving = true;
                        clearTimeout(scrubSettleTimer);
                        scrubSettleTimer = setTimeout(() => {
                            isScrubMoving = false;
                        }, 200);
                    }

                    lastProgress = self.progress;

                    const roundedProgress = Math.round(self.progress * 10000) / 10000;
                    if (roundedProgress === lastSentProgress) return;
                    lastSentProgress = roundedProgress;

                    if (pcFrame && pcFrame.contentWindow) {
                        pcFrame.contentWindow.postMessage(
                            { type: "SCROLL_UPDATE", value: self.progress },
                            "*"
                        );
                    }
                }
            });
        }

        // --- F. POINTER MOVE (Mouse + Touch Unified) ---
        let targetMouseX = 0.5,
            targetMouseY = 0.5,
            smoothMouseX = 0.5,
            smoothMouseY = 0.5,
            hasNewMouseData = false;

        // POINTER EVENTS (works for mouse, touch, stylus)
        window.addEventListener("pointermove", (e) => {
            targetMouseX = e.clientX / window.innerWidth;
            targetMouseY = e.clientY / window.innerHeight;
            hasNewMouseData = true;
        }, { passive: true });

        // Fallback for older mobile browsers
        window.addEventListener("touchmove", (e) => {
            if (!e.touches || !e.touches.length) return;
            const t = e.touches[0];

            targetMouseX = t.clientX / window.innerWidth;
            targetMouseY = t.clientY / window.innerHeight;

            hasNewMouseData = true;
        }, { passive: true });

        // SMOOTH INTERPOLATION (prevents "jumping" touch input)
        gsap.ticker.add(() => {

            // smoothing factor (lower = smoother)
            const ease = 0.18;

            smoothMouseX += (targetMouseX - smoothMouseX) * ease;
            smoothMouseY += (targetMouseY - smoothMouseY) * ease;

            if (pcFrame && pcFrame.contentWindow) {

                pcFrame.contentWindow.postMessage({
                    type: "MOUSE_MOVE",
                    x: smoothMouseX,
                    y: smoothMouseY
                }, "*");

            }

        });



        // --- G. CUSTOM CURSOR ---
        if (window.innerWidth > 991) {
            const dot = document.querySelector(".cursor-dot");
            const ring = document.querySelector(".cursor-ring");

            if (dot && ring) {
                gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

                let xTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
                let yTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
                let ringX = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3.out" });
                let ringY = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3.out" });

                let isWrapping = false;
                let mouseX = window.innerWidth / 2;
                let mouseY = window.innerHeight / 2;

                window.addEventListener("mousemove", (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;

                    xTo(mouseX);
                    yTo(mouseY);

                    if (!isWrapping) {
                        ringX(mouseX);
                        ringY(mouseY);
                    }
                });

                // 1. NORMAL LINKS
                const normalLinks = document.querySelectorAll('a:not(.w-button), input, textarea, .clickable, .btn-close-panel, .nav-dot, .btn-close-popup');

                normalLinks.forEach(link => {
                    // PREVENT CONFLICT: If this link is also a wrap button, skip it!
                    if (link.matches('.w-button, button, #enable-head-tracking')) return;

                    link.addEventListener("mouseenter", () => {
                        ring.classList.add("active"); // Fades ring
                        dot.classList.add("active");  // Fades dot
                    });
                    link.addEventListener("mouseleave", () => {
                        ring.classList.remove("active");
                        dot.classList.remove("active");
                    });
                });

                // 2. PILL BUTTONS (The Wrap Effect)
                const wrapButtons = document.querySelectorAll('.w-button, button, #enable-head-tracking');

                wrapButtons.forEach(btn => {
                    btn.addEventListener("mouseenter", () => {
                        isWrapping = true;
                        dot.classList.add("active"); // Fade the dot
                        ring.classList.remove("active"); // FORCE ring to stay visible (Overrides conflicts)

                        const rect = btn.getBoundingClientRect();
                        const padding = 16; // Now every single button gets the same 8px visual gap

                        // Tell quickTo to glide to the center of the button smoothly
                        ringX(rect.left + rect.width / 2);
                        ringY(rect.top + rect.height / 2);

                        // Only use gsap.to for changing the shape/size of the cursor
                        gsap.to(ring, {
                            width: rect.width + padding,
                            height: rect.height + padding,
                            borderRadius: "999px",
                            duration: 0.4,
                            ease: "power3.out",
                            overwrite: "auto"
                        });
                    });

                    btn.addEventListener("mouseleave", () => {
                        dot.classList.remove("active");
                        isWrapping = false;

                        // Tell quickTo to glide back to the current mouse position
                        ringX(mouseX);
                        ringY(mouseY);

                        // Revert the shape back to your default 50x50 circle
                        gsap.to(ring, {
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            duration: 0.4,
                            ease: "power3.out",
                            overwrite: "auto"
                        });
                    });
                });
            }
        }

        // --- INJECT CUSTOM CSS FOR NAV SYSTEM ---
        const navStyles = document.createElement('style');

        navStyles.innerHTML = `

        /* --- DOT BASE STYLE --- */
        .nav-item .nav-dot {
            position: relative;
            width: 8px;
            height: 8px;
            border: 1px solid #FFFFFF;
            border-radius: 50%;
            background-color: transparent;
            opacity: 0.5;
            transition: all 0.2s ease;
        }

        /* --- INVISIBLE HIT AREA (EASIER CLICK) --- */
        .nav-item .nav-dot::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500%;
            height: 500%;
            border-radius: 50%;
            cursor: pointer;

            /* Debug (uncomment to see hit area) */
            /* background-color: rgba(255, 0, 0, 0.2); */
        }

        /* --- LABEL BASE (HIDDEN) --- */
        .nav-item .text-navleftbar {
            opacity: 0;
            transform: translateX(-8px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
        }

        /* --- HOVER ONLY ON DOT --- */
        .nav-dot:hover + .text-navleftbar {
            opacity: 1;
            transform: translateX(0);
        }

        /* --- ACTIVE STATE (CURRENT SECTION) --- */
        .nav-item.is-active .nav-dot {
            background-color: #FFFFFF;
            border-color: transparent;
            transform: scale(1.4);
            opacity: 1;
        }

        .nav-item.is-active .text-navleftbar {
            opacity: 1;
            transform: translateX(0);
        }

        /* --- OPTIONAL: DOT HOVER FEEDBACK --- */
        .nav-dot:hover {
            transform: scale(1.2);
            opacity: 0.8;
        }

        `;

        document.head.appendChild(navStyles);


        // --- H. LEFT NAV VISIBILITY (Slide + Fade) ---

        const leftNav = document.querySelector(".left-nav");

        function openRail() {
            gsap.to(leftNav, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
            });
            leftNav.style.pointerEvents = "auto";
        }

        function closeRail() {
            gsap.to(leftNav, {
                x: -40,
                opacity: 0,
                duration: 0.6,
                ease: "power3.in",
                overwrite: "auto"
            });
            leftNav.style.pointerEvents = "none";
        }

        if (leftNav && trackSections.length > 1) {
            const secondSection = trackSections[1];

            ScrollTrigger.create({
                trigger: secondSection,
                start: "top 60%",
                end: "bottom top",
                onEnter: openRail,
                onLeaveBack: closeRail
            });
        }


        // --- I. NAV DOT ANIMATION (Static Dots / Class Toggle) ---

        const navItems = gsap.utils.toArray(".nav-item");
        const navRail = document.querySelector(".nav-rail");

        if (navItems.length && navRail) {

            let currentActiveIndex = -1;
            let isClickScrolling = false;
            let failsafeTimer; // Backup timer for stuck scrolls

            function updateNav(index) {
                if (index === currentActiveIndex || index < 0 || index >= navItems.length) return;
                currentActiveIndex = index;

                navItems.forEach((item, i) => {
                    item.classList.toggle("is-active", i === index);
                });
            }

            if (navItems.length > 0) {
                updateNav(0);
            }


            // --- PROGRESS-BASED DETECTION ---

            function getActiveIndexFromProgress(progress) {
                const stops = window.cameraStops;
                if (!stops || stops.length < 2) return 0;

                for (let i = stops.length - 1; i >= 0; i--) {
                    if (progress >= stops[i] - 0.01) {
                        const navIndex = i - 1;
                        return Math.max(0, Math.min(navIndex, navItems.length - 1));
                    }
                }
                return 0;
            }

            ScrollTrigger.create({
                trigger: content,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    if (isClickScrolling) return; // Ignored during auto-scroll
                    const newIndex = getActiveIndexFromProgress(self.progress);
                    updateNav(newIndex);
                }
            });


            // --- USER INTERRUPTION DETECTION ---
            // If user scrolls manually while an auto-scroll is happening, unlock immediately.
            function unlockScroll() {
                if (isClickScrolling) {
                    isClickScrolling = false;
                    clearTimeout(failsafeTimer);

                    // Force an immediate progress check so the dot jumps to where they actually are
                    if (ScrollTrigger.getById("mainScroll")) {
                        // Optional: forces ST to update, though onUpdate usually catches it next frame
                    }
                }
            }
            window.addEventListener("wheel", unlockScroll, { passive: true });
            window.addEventListener("touchstart", unlockScroll, { passive: true });
            window.addEventListener("touchmove", unlockScroll, { passive: true });


            // --- J. LEFT NAV CLICK → LENIS SCROLL ---

            navItems.forEach((item, index) => {
                const dot = item.querySelector(".nav-dot");

                if (dot) {
                    dot.addEventListener("click", () => {
                        const targetId = item.getAttribute("data-target");
                        const section = document.getElementById(targetId);
                        if (!section) return;

                        // Lock normal detection and update UI instantly
                        isClickScrolling = true;
                        updateNav(index);

                        // FAILSAFE: Force unlock after 2.5 seconds if Lenis completely fails
                        clearTimeout(failsafeTimer);
                        failsafeTimer = setTimeout(() => {
                            isClickScrolling = false;
                        }, 2500);

                        const rect = section.getBoundingClientRect();
                        const sectionTop = rect.top + window.scrollY;
                        const sectionHeight = section.offsetHeight;
                        const viewportHeight = window.innerHeight;

                        const scrollToY = sectionTop + (sectionHeight / 1.6) - (viewportHeight / 1.6);

                        if (window.lenis) {
                            window.lenis.scrollTo(scrollToY, {
                                duration: 2,
                                easing: (t) => 1 - Math.pow(1 - t, 3),
                                onComplete: () => {
                                    setTimeout(() => {
                                        isClickScrolling = false;
                                        clearTimeout(failsafeTimer);
                                    }, 100); // Small buffer
                                }
                            });
                        } else {
                            window.scrollTo({
                                top: scrollToY,
                                behavior: "smooth"
                            });
                            setTimeout(() => {
                                isClickScrolling = false;
                                clearTimeout(failsafeTimer);
                            }, 1000);
                        }
                    });
                }
            });
        }



        // --- J. PREMIUM SCRAMBLE (CodePen Style, Replayable) ---

        class TextScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';
                this.update = this.update.bind(this);
            }

            setText(newText) {
                const oldText = this.el.innerText;
                const length = Math.max(oldText.length, newText.length);
                const promise = new Promise(resolve => this.resolve = resolve);
                this.queue = [];

                for (let i = 0; i < length; i++) {
                    const from = oldText[i] || '';
                    const to = newText[i] || '';
                    const start = Math.floor(Math.random() * 30);
                    const end = start + Math.floor(Math.random() * 40);
                    this.queue.push({ from, to, start, end });
                }

                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }

            update() {
                let output = '';
                let complete = 0;

                for (let i = 0; i < this.queue.length; i++) {
                    let { from, to, start, end, char } = this.queue[i];

                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += `<span class="dud">${char}</span>`;
                    } else {
                        output += from;
                    }
                }

                this.el.innerHTML = output;

                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }

            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }



        // --- BUTTON SCRAMBLE EFFECT ---
        class ButtonScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';

                // THE FIX: Use textContent instead of innerText!
                // textContent reads the text even if the button is hidden inside a mobile menu on page load.
                this.originalText = this.el.textContent.trim();

                this.update = this.update.bind(this);

                this.el.style.whiteSpace = 'nowrap';
                this.el.style.boxSizing = 'border-box';
                this.el.style.textAlign = 'center';

                const lockWidth = () => {
                    if (!this.isWidthLocked) {
                        const rect = this.el.getBoundingClientRect();
                        if (rect.width > 0) {
                            this.el.style.width = `${rect.width}px`;
                            this.isWidthLocked = true;
                        }
                    }
                };

                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(lockWidth);
                } else {
                    window.addEventListener('load', lockWidth);
                }

                this.el.addEventListener('mouseenter', () => {
                    lockWidth();
                    this.scramble();
                });

                // NEW: Mobile click failsafe. 
                // Instantly finishes the scramble animation when tapped so it doesn't get stuck.
                this.el.addEventListener('click', () => {
                    this.frame = 99999; // Fast-forward to the end
                    this.update();
                });
            }

            scramble() {
                const length = this.originalText.length;
                const promise = new Promise(resolve => this.resolve = resolve);
                this.queue = [];

                for (let i = 0; i < length; i++) {
                    const to = this.originalText[i];

                    if (to === ' ') {
                        this.queue.push({ from: ' ', to: ' ', start: 0, end: 0 });
                        continue;
                    }

                    const from = this.randomChar();
                    const start = Math.floor(Math.random() * 30);
                    const end = start + Math.floor(Math.random() * 50);

                    this.queue.push({ from, to, start, end });
                }

                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }

            update() {
                let output = '';
                let complete = 0;

                for (let i = 0; i < this.queue.length; i++) {
                    let { from, to, start, end, char } = this.queue[i];

                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += `<span class="dud">${char}</span>`;
                    } else {
                        output += `<span class="dud">${from}</span>`;
                    }
                }

                this.el.innerHTML = output;

                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }

            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }

        document.querySelectorAll('.btn-open-panel').forEach(btn => {
            new ButtonScramble(btn);
        });

        const headerBtns = document.querySelectorAll('._3dheader-btn, .\\33 dheader-btn, [class*="3dheader-btn"]');
        headerBtns.forEach(btn => {
            new ButtonScramble(btn);
        });

        // ─── DOM CONTENT LOADED ───────────────────────────
        document.addEventListener("DOMContentLoaded", () => {
            gsap.registerPlugin(Observer, InertiaPlugin);

            // ─── CAROUSEL WRAPPER & BUTTON ────────────────────────
            const viewport = document.querySelector('.carousel-3d');
            const openButton = document.getElementById('projectcard');

            if (viewport) {
                viewport.style.display = 'none';
            }

            let isCarouselInitialized = false;
            let hasDragged = false;
            let playCarouselIntro = null;

            // NEW: Fullscreen state variables
            let isFullscreen = false;
            let closeFullscreenRef = null;

            // ─── CLOSE CAROUSEL FUNCTION ───────────────────────────
            function closeCarousel() {
                gsap.to(viewport, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        viewport.style.display = 'none';
                        if (window.lenis) window.lenis.start();
                    }
                });
            }
        });


        // --- Scroll Controlled ---

        const scrambleSection = document.getElementById("scramble-container");
        const textEl = document.querySelector(".scramble-text");

        if (scrambleSection && textEl) {

            const phrases = [
                "GLOBAL DESIGN STUDIO",
                "HIGH-FIDELITY STANDARDS",
                "INQUIRIES & COLLABORATIONS",
                "[ studio@deepminded.com ]"
            ];

            const fx = new TextScramble(textEl);
            let counter = 0;
            let isRunning = false;

            function startScramble() {
                if (isRunning) return;
                isRunning = true;

                const run = () => {
                    fx.setText(phrases[counter]).then(() => {
                        counter++;
                        if (counter < phrases.length) {
                            setTimeout(run, 1200);
                        } else {
                            isRunning = false;
                        }
                    });
                };

                counter = 0;
                run();
            }

            ScrollTrigger.create({
                trigger: "#contactus",
                start: "top 60%",
                end: "bottom 40%",
                onEnter: startScramble,
                onEnterBack: startScramble,
                onLeave: () => {
                    textEl.innerHTML = "";
                    counter = 0;
                    isRunning = false;
                },
                onLeaveBack: () => {
                    textEl.innerHTML = "";
                    counter = 0;
                    isRunning = false;
                }
            });
        }




        // =================================================================
        // K. SCROLL INDICATOR ANIMATION
        // =================================================================
        window.addEventListener("DOMContentLoaded", () => {
            const scrollDot = document.querySelector('.scroll-indicator .dot');
            const topLine = document.querySelector('.scroll-indicator .top-line');
            const bottomLine = document.querySelector('.scroll-indicator .bottom-line');

            if (scrollDot && topLine && bottomLine) {
                const containerHeight = 48;
                const arrowHeight = 6;
                const dotHeight = 17;

                const minTop = arrowHeight;
                const maxTop = containerHeight - arrowHeight - dotHeight;
                const totalTravel = maxTop - minTop;

                gsap.set(scrollDot, { y: 0 });
                gsap.set(topLine, { height: 0 });
                gsap.set(bottomLine, { height: totalTravel });

                const indicatorTl = gsap.timeline({ repeat: -1, yoyo: true });

                indicatorTl.to(scrollDot, {
                    y: totalTravel,
                    duration: 1,
                    ease: "power1.inOut"
                }, 0)
                    .to(topLine, {
                        height: totalTravel,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0)
                    .to(bottomLine, {
                        height: 0,
                        duration: 1,
                        ease: "power1.inOut"
                    }, 0);
            }
        });




        // =================================================================
        // SIDE PANEL SYSTEM (Multi Panel - Lenis Safe)
        // =================================================================

        const mainSection = document.querySelector(".project-content-wrapper");
        const openButtons = document.querySelectorAll(".btn-open-panel");

        const ANIM_DURATION = 0.5;
        let activePanel = null;
        window.ANIM_DURATION = ANIM_DURATION;
        window.activePanel = activePanel;

        document.querySelectorAll('[class^="sidepanel-"]').forEach(panel => {
            panel.style.display = "none";
            gsap.set(panel, { opacity: 0 });
            gsap.set(panel.querySelector(".panel-wrapper"), { xPercent: 100 });
        });

        function openPanel(panelClass) {
            if (activePanel) return;

            const overlay = document.querySelector("." + panelClass);
            const panel = overlay.querySelector(".panel-wrapper");
            if (!overlay || !panel) return;

            activePanel = overlay;
            window.activePanel = activePanel;

            if (window.lenis) window.lenis.stop();

            overlay.style.display = "flex";

            if (mainSection) {
                gsap.to(mainSection, {
                    opacity: 0,
                    duration: 0.35,
                    ease: "power2.out"
                });
            }

            gsap.to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out"
            });

            gsap.to(panel, {
                xPercent: 0,
                duration: ANIM_DURATION,
                ease: "power3.out",
                delay: 0.1
            });
        }

        function closePanel() {
            if (!activePanel) return;

            const overlay = activePanel;
            const panel = overlay.querySelector(".panel-wrapper");

            gsap.to(panel, {
                xPercent: 100,
                duration: ANIM_DURATION,
                ease: "power3.in"
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: "power1.in",
                onComplete: () => {
                    overlay.style.display = "none";
                    activePanel = null;
                    window.activePanel = null;
                    if (window.lenis) window.lenis.start();
                }
            });

            if (mainSection) {
                gsap.to(mainSection, {
                    opacity: 1,
                    duration: 0.35,
                    ease: "power2.out",
                    delay: 0.1
                });
            }
        }

        // Expose closePanel globally so carousel.js can call it
        window.closePanel = closePanel;

        openButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const panelClass = btn.dataset.panel;
                openPanel(panelClass);
            });
        });

        document.addEventListener("click", e => {
            if (e.target.closest(".btn-close-panel")) {
                closePanel();
            }
        });

        document.addEventListener("click", e => {
            if (activePanel && !e.target.closest(".panel-wrapper") && !e.target.closest(".btn-open-panel")) {
                closePanel();
            }
        });

        document.addEventListener("keydown", e => {
            if (e.key === "Escape") closePanel();
        });




        // --- FINAL REFRESH & PLAYCANVAS SYNC ---

        ScrollTrigger.refresh();

        setTimeout(() => {
            ScrollTrigger.update(true);
        }, 100);



    }

    // =================================================================
    // 2. SCRIPT LOADER
    // =================================================================
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const script = document.createElement('script');
            script.src = src; script.onload = resolve; script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // =================================================================
    // 3. INITIALIZATION (DOM CONTENT LOADED)
    // =================================================================
    document.addEventListener('DOMContentLoaded', () => {
        runGsapAnimations();
        window.runGsapAnimations = runGsapAnimations;
    });

})();