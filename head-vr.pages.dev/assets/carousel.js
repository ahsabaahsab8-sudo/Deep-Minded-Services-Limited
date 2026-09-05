document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Observer, InertiaPlugin);

    // ─── SINGLE GSAP TICKER TO DRIVE LENIS ────────────────
    gsap.ticker.add((time) => {
        if (window.lenis) {
            window.lenis.raf(time * 1000);
        }
    });
    gsap.ticker.lagSmoothing(0);

    // ─── CAROUSEL WRAPPER ─────────────────────────────────
    const viewport = document.querySelector('.carousel-3d');

    if (viewport) {
        viewport.style.display = 'none';
        viewport.style.touchAction = 'none';
    }

    let isCarouselInitialized = false;
    let hasDragged = false;
    let playCarouselIntro = null;

    // Fullscreen state variables
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

    // ─── OPEN CAROUSEL FUNCTION ────────────────────────────
    function openCarousel() {
        if (!viewport) return;

        viewport.style.opacity = '0';
        viewport.style.display = 'block';

        if (!isCarouselInitialized) {
            initCarousel();
            isCarouselInitialized = true;
        } else {
            if (playCarouselIntro) playCarouselIntro();
        }

        gsap.fromTo(viewport,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: 'power2.inOut' }
        );

        if (window.lenis) window.lenis.stop();
    }

    // ─── CAROUSEL OPEN VIA EVENT DELEGATION ────────────────
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.carousel-open-btn');
        if (!trigger) return;

        e.preventDefault();
        e.stopPropagation(); // Prevent panel's "click outside" listener from interfering

        // If a side panel is currently open, close it first then open carousel
        if (window.activePanel) {
            // Force close the panel via the globally exposed function
            window.closePanel();

            // Wait for panel close animation to complete before opening carousel
            const panelDuration = (window.ANIM_DURATION || 0.5);
            setTimeout(() => {
                openCarousel();
            }, panelDuration * 1000 + 150);
        } else {
            openCarousel();
        }
    }, true); // <-- CAPTURE PHASE: fires before the panel's bubble-phase listeners

    // ─── ENCAPSULATED CAROUSEL LOGIC ───────────────────────
    function initCarousel() {
        const track = document.querySelector('.carousel-3d-track');
        const items = [...document.querySelectorAll('.carousel-3d-item')];
        if (!viewport || !track || items.length === 0) return;

        const numItems = items.length;

        // Fullscreen Elements
        const overlay = document.querySelector('.fullscreen-overlay');
        const iframe = document.querySelector('.fullscreen-iframe');
        const closeOverlayBtn = document.querySelector('.fullscreen-close');
        const header = document.querySelector('.fullscreen-header');

        // ─── TUNING CONSTANTS ──────────────────────────────────
        const DRAG_SPEED = -0.25;
        const WHEEL_SPEED = 0.06;
        const LERP_FACTOR = 0.08;
        const INERTIA_RESIST = 300;

        const DEPTH_SCALE_MIN = 0.8;
        const DEPTH_OPACITY_MIN = 0.4;
        const DEPTH_BLUR_MAX = 3;
        const PARALLAX_MULT = 0.3;

        // ─── STATE ─────────────────────────────────────────────
        const state = { progress: 50 };
        let displayProgress = 50;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let wheelTimer = null;

        // ─── STATE INIT ────────
        items.forEach(item => {
            item.physics = {
                isHovered: false,
                currentTiltX: 0, velocityTiltX: 0, targetTiltX: 0,
                currentTiltY: 0, velocityTiltY: 0, targetTiltY: 0,
                currentGradX: 50, velocityGradX: 0, targetGradX: 50,
                currentGradY: 50, velocityGradY: 0, targetGradY: 50,
                currentOpc: 0, velocityOpc: 0, targetOpc: 0,
            };
        });

        function springStep(current, velocity, target, stiffness, damping) {
            const force = (target - current) * stiffness;
            const newVelocity = (velocity + force) * damping;
            const newCurrent = current + newVelocity;
            return { value: newCurrent, velocity: newVelocity };
        }

        function progressForCard(i) {
            return (i / Math.max(1, numItems - 1)) * 100;
        }

        function snapToNearestCard(value) {
            let best = 0, bestDist = Infinity;
            for (let i = 0; i < numItems; i++) {
                const p = progressForCard(i);
                const d = Math.abs(value - p);
                if (d < bestDist) { bestDist = d; best = p; }
            }
            return best;
        }

        function getZIndices(activeIndex) {
            return items.map((_, i) => {
                if (i === activeIndex) return numItems;
                return numItems - Math.abs(activeIndex - i);
            });
        }

        // ─── PER-CARD RENDER ───────────────────────────────────
        function renderCards() {
            const activeExact = displayProgress / 100 * (numItems - 1);
            const active = Math.round(activeExact);
            const zIndices = getZIndices(active);

            items.forEach((item, i) => {
                const offset = i - activeExact;
                const zIndex = zIndices[i];

                item.style.setProperty('--zIndex', zIndex);
                item.style.setProperty('--active', offset);
                item.style.zIndex = zIndex;

                const box = item.querySelector('.carousel-3d-box');
                const p = item.physics;

                const stiffness = p.isHovered ? 0.066 : 0.01;
                const damping = p.isHovered ? 0.75 : 0.94;

                let s;
                s = springStep(p.currentTiltX, p.velocityTiltX, p.targetTiltX, stiffness, damping);
                p.currentTiltX = s.value; p.velocityTiltX = s.velocity;

                s = springStep(p.currentTiltY, p.velocityTiltY, p.targetTiltY, stiffness, damping);
                p.currentTiltY = s.value; p.velocityTiltY = s.velocity;

                s = springStep(p.currentGradX, p.velocityGradX, p.targetGradX, stiffness, damping);
                p.currentGradX = s.value; p.velocityGradX = s.velocity;

                s = springStep(p.currentGradY, p.velocityGradY, p.targetGradY, stiffness, damping);
                p.currentGradY = s.value; p.velocityGradY = s.velocity;

                s = springStep(p.currentOpc, p.velocityOpc, p.targetOpc, stiffness, damping);
                p.currentOpc = s.value; p.velocityOpc = s.velocity;

                if (box) {
                    const absDist = Math.abs(offset);
                    const t = Math.min(absDist / 3, 1);

                    const opacity = 1 - t * (1 - DEPTH_OPACITY_MIN);
                    const blur = t * DEPTH_BLUR_MAX;
                    const scale = 1 - t * (1 - DEPTH_SCALE_MIN);

                    box.style.opacity = opacity.toFixed(3);
                    box.style.filter = `blur(${blur.toFixed(2)}px)`;
                    box.style.transformOrigin = "center center";

                    box.style.transform = `
                    perspective(600px)
                    scale(${scale.toFixed(3)})
                    rotateX(${p.currentTiltX.toFixed(2)}deg)
                    rotateY(${p.currentTiltY.toFixed(2)}deg)
                `;

                    const gx = p.currentGradX;
                    const gy = p.currentGradY;
                    const pointerFromCenter = Math.min(Math.sqrt((gy - 50) * (gy - 50) + (gx - 50) * (gx - 50)) / 50, 1);
                    const pointerFromTop = gy / 100;
                    const pointerFromLeft = gx / 100;
                    const bgX = 37 + (gx / 100) * 26;
                    const bgY = 33 + (gy / 100) * 34;

                    box.style.setProperty('--grad-pos', `${gx.toFixed(2)}% ${gy.toFixed(2)}%`);
                    box.style.setProperty('--pointer-x', `${gx.toFixed(2)}%`);
                    box.style.setProperty('--pointer-y', `${gy.toFixed(2)}%`);
                    box.style.setProperty('--pointer-from-center', pointerFromCenter.toFixed(3));
                    box.style.setProperty('--pointer-from-top', pointerFromTop.toFixed(3));
                    box.style.setProperty('--pointer-from-left', pointerFromLeft.toFixed(3));
                    box.style.setProperty('--background-x', `${bgX.toFixed(2)}%`);
                    box.style.setProperty('--background-y', `${bgY.toFixed(2)}%`);
                    box.style.setProperty('--opc', p.currentOpc.toFixed(3));
                }
            });
        }

        // ─── INERTIA THROW ────────────────────────────────────
        function throwInertia() {
            gsap.to(state, {
                inertia: {
                    progress: { end: snapToNearestCard, resistance: INERTIA_RESIST },
                },
                onUpdate: () => { state.progress = Math.max(0, Math.min(100, state.progress)); },
            });
        }
        InertiaPlugin.track(state, 'progress');

        // ─── MOUSE TRACKING ────────
        window.addEventListener('mousemove', (e) => {
            if (isFullscreen) return;

            const activeExact = displayProgress / 100 * (numItems - 1);
            const active = Math.round(activeExact);
            const hoveredItem = e.target.closest('.carousel-3d-item');

            items.forEach((item, i) => {
                const p = item.physics;
                if (item === hoveredItem && i === active) {
                    const rect = item.getBoundingClientRect();
                    const percentX = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
                    const percentY = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100));
                    const centerX = percentX - 50;
                    const centerY = percentY - 50;

                    p.targetTiltX = (centerY / 3.5) * PARALLAX_MULT;
                    p.targetTiltY = -(centerX / 3.5) * PARALLAX_MULT;
                    p.targetGradX = percentX;
                    p.targetGradY = percentY;
                    p.targetOpc = 1;
                    p.isHovered = true;
                } else {
                    p.targetTiltX = 0; p.targetTiltY = 0; p.targetOpc = 0;
                    p.targetGradX = 50; p.targetGradY = 50; p.isHovered = false;
                }
            });
        });

        document.addEventListener('mouseleave', () => {
            items.forEach(item => {
                item.physics.targetTiltX = 0; item.physics.targetTiltY = 0;
                item.physics.targetOpc = 0; item.physics.isHovered = false;
            });
        });

        // ─── FULLSCREEN FUNCTIONS ─────────────────────────
        // Dynamic style tag to forcefully kill the main-page scrollbar
        let iframeScrollbarStyle = null;

        function hideMainScrollbar() {
            if (iframeScrollbarStyle) return; // already injected
            iframeScrollbarStyle = document.createElement('style');
            iframeScrollbarStyle.id = 'iframe-scrollbar-kill';
            iframeScrollbarStyle.textContent = `
                /* Hide ALL scrollbars on the main page when iframe is open */
                html::-webkit-scrollbar,
                body::-webkit-scrollbar,
                .page-wrapper::-webkit-scrollbar,
                .main-wrapper::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                }
                html, body, .page-wrapper, .main-wrapper {
                    overflow: hidden !important;
                    scrollbar-width: none !important;
                }
            `;
            document.head.appendChild(iframeScrollbarStyle);
        }

        function showMainScrollbar() {
            if (iframeScrollbarStyle) {
                iframeScrollbarStyle.remove();
                iframeScrollbarStyle = null;
            }
        }

        function expandCard(card) {
            if (!overlay) return;

            isFullscreen = true;

            const box = card.querySelector('.carousel-3d-box');
            const rect = box.getBoundingClientRect();
            const computedRadius = window.getComputedStyle(box).borderRadius;
            const url = card.getAttribute('data-iframe-url') || '';

            document.body.classList.add("iframe-open");
            hideMainScrollbar();

            overlay.style.display = 'block';

            if (iframe) gsap.set(iframe, { opacity: 0 });
            if (closeOverlayBtn) gsap.set(closeOverlayBtn, { opacity: 0 });

            if (header) {
                header.style.display = "flex";
                gsap.set(header, { opacity: 0 });
            }

            const bgClone = box.cloneNode(true);
            bgClone.classList.add("fullscreen-bg-clone");

            Object.assign(bgClone.style, {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                transform: "scale(1)",
                pointerEvents: "none",
                zIndex: 1
            });

            const oldClone = overlay.querySelector('.fullscreen-bg-clone');
            if (oldClone) oldClone.remove();

            overlay.prepend(bgClone);

            gsap.set(overlay, {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                borderRadius: computedRadius
            });

            if (url && iframe) iframe.src = url;

            const tl = gsap.timeline();

            tl.to(overlay, {
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: "0px",
                duration: 0.7,
                ease: "power4.inOut"
            });

            tl.to(bgClone, {
                scale: 1.2,
                filter: "blur(30px)",
                duration: 0.8,
                ease: "power3.out"
            }, 0);

            if (iframe) {
                iframe.onload = () => {
                    gsap.to([iframe, closeOverlayBtn, header], {
                        opacity: 1,
                        duration: 0.35,
                        ease: "power2.out"
                    });

                    gsap.to(bgClone, {
                        opacity: 0,
                        duration: 0.4,
                        delay: 0.2,
                        onComplete: () => bgClone.remove()
                    });
                };
            }
        }

        function closeFullscreen() {
            if (!overlay) return;

            gsap.to([iframe, closeOverlayBtn, header], {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {

                    if (header) header.style.display = "none";
                    if (iframe) iframe.src = "";

                    const activeExact = displayProgress / 100 * (numItems - 1);
                    const active = Math.round(activeExact);
                    const activeCard = items[active];

                    const box = activeCard.querySelector('.carousel-3d-box');
                    const rect = box.getBoundingClientRect();
                    const computedRadius = window.getComputedStyle(box).borderRadius;

                    gsap.to(overlay, {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        borderRadius: computedRadius,
                        duration: 0.65,
                        ease: "power3.inOut",
                        onComplete: () => {

                            overlay.style.display = "none";

                            gsap.set(activeCard, { visibility: "visible" });

                            isFullscreen = false;
                            document.body.classList.remove("iframe-open");
                            showMainScrollbar();
                        }
                    });
                }
            });
        }

        closeFullscreenRef = closeFullscreen;

        if (closeOverlayBtn) {
            closeOverlayBtn.addEventListener('click', closeFullscreen);
        }

        // ─── INPUT: Observer for drag + wheel + touch ──────────
        Observer.create({
            target: viewport,
            type: 'wheel,touch,pointer',
            dragMinimum: 3,
            preventDefault: true,

            onPress: (self) => {
                if (isFullscreen) return;
                isDragging = true;
                hasDragged = false;
                gsap.killTweensOf(state);
                startX = self.x;
                startY = self.y;
                gsap.to(viewport, { cursor: 'grabbing', duration: 0.15 });
            },

            onRelease: () => {
                if (isFullscreen) return;
                isDragging = false;
                gsap.to(viewport, { cursor: 'grab', duration: 0.15 });
                throwInertia();
            },

            onDrag: (self) => {
                if (isFullscreen) return;
                const dist = Math.hypot(self.x - startX, self.y - startY);
                if (dist > 5) hasDragged = true;

                const delta = self.deltaX !== 0 ? self.deltaX : self.deltaY;
                state.progress += delta * DRAG_SPEED;
                state.progress = Math.max(0, Math.min(100, state.progress));
            },

            onWheel: (self) => {
                if (isFullscreen) return;
                gsap.killTweensOf(state);
                state.progress += self.deltaY * WHEEL_SPEED;
                state.progress = Math.max(0, Math.min(100, state.progress));

                clearTimeout(wheelTimer);
                wheelTimer = setTimeout(() => throwInertia(), 150);
            },

            onClick: (self) => {
                if (isFullscreen || hasDragged) return;

                const elementUnderPointer = document.elementFromPoint(self.x, self.y);
                const clickedCard = elementUnderPointer?.closest('.carousel-3d-item');

                if (clickedCard) {
                    const cardIndex = items.indexOf(clickedCard);
                    const activeExact = displayProgress / 100 * (numItems - 1);
                    const activeIndex = Math.round(activeExact);

                    if (cardIndex === activeIndex) {
                        expandCard(clickedCard);
                    } else if (cardIndex > -1) {
                        gsap.killTweensOf(state);
                        gsap.to(state, {
                            progress: progressForCard(cardIndex),
                            duration: 0.8,
                            ease: 'power3.out',
                            onUpdate: () => {
                                state.progress = Math.max(0, Math.min(100, state.progress));
                            },
                        });
                    }
                } else {
                    closeCarousel();
                }
            }
        });

        // ─── MAIN RENDER LOOP ──────────────────────────────────
        gsap.ticker.add(() => {
            displayProgress += (state.progress - displayProgress) * LERP_FACTOR;
            renderCards();
        });

        // ─── BOOTSTRAP + INTRO ANIMATION ────────────────────────
        function introAnimation() {
            gsap.killTweensOf(state);
            items.forEach(item => item.style.transition = 'none');
            state.progress = -75;
            displayProgress = state.progress;

            gsap.set(items, { opacity: 0 });
            renderCards();
            viewport.offsetHeight;
            items.forEach(item => item.style.transition = '');

            items.forEach((item, i) => {
                gsap.to(item, { opacity: 1, duration: 0.6, delay: 0.1 + (i * 0.05), ease: 'power2.out' });
            });

            gsap.to(state, {
                progress: progressForCard(0),
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.1,
                onUpdate: () => state.progress = Math.max(-100, Math.min(100, state.progress))
            });
        }

        playCarouselIntro = introAnimation;
        gsap.set(viewport, { cursor: 'grab' });
        introAnimation();
        window.addEventListener('resize', renderCards);
    }

    // ─── ESCAPE KEY TO CLOSE ───────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isFullscreen && closeFullscreenRef) {
                closeFullscreenRef();
            } else if (viewport && viewport.style.display === 'block') {
                closeCarousel();
            }
        }
    });
});