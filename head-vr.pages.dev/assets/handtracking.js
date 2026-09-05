/**
 * HAND TRACKING SCRIPT
 */

(function () {
    // ===============================
    // HAND STATE VARIABLES
    // ===============================

    let handTrackingEnabled = false;
    let shouldProcessFrames = false;
    let camera = null;
    let handLostTimeout = null;

    // Use window.isPinching so the main script can read it
    window.isPinching = false;

    // Inference state
    let processingFace = false;
    let processingHands = false;
    let inferenceLoopId = null;
    let modelsReady = false;

    // Anchored pinch scroll state
    let pinchStartY = 0;
    let scrollStartY = 0;

    // Momentum tracking
    let velocityHistory = [];
    const VELOCITY_HISTORY_SIZE = 5;
    let lastFramePos = 0;
    let lastFrameTime = 0;

    // Hysteresis thresholds
    const PINCH_START = 0.04;
    const PINCH_END = 0.06;

    const SCROLL_MULTIPLIER = 4500;

    // Momentum settings
    const MOMENTUM_MULTIPLIER = 2000;
    const MOMENTUM_DURATION = 1.2;
    const MIN_VELOCITY_FOR_MOMENTUM = 0.0003;

    const videoElement = document.createElement('video');
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    console.log("🟢 Hand tracking script loaded");

    // ===============================
    // MOMENTUM HELPERS (HORIZONTAL X BASED)
    // ===============================

    function recordVelocity(currentX) {
        const now = performance.now();

        if (lastFrameTime > 0) {
            const dt = now - lastFrameTime;
            if (dt > 0) {
                const velocity = (currentX - lastFramePos) / dt;
                velocityHistory.push({ velocity, time: now });

                if (velocityHistory.length > VELOCITY_HISTORY_SIZE) {
                    velocityHistory.shift();
                }
            }
        }

        lastFramePos = currentX;
        lastFrameTime = now;
    }

    function getReleaseMomentum() {
        if (velocityHistory.length < 2) return 0;

        const now = performance.now();
        const recentCutoff = now - 100;

        const recentSamples = velocityHistory.filter(v => v.time >= recentCutoff);
        if (recentSamples.length === 0) return 0;

        let weightedSum = 0;
        let weightTotal = 0;

        recentSamples.forEach((sample, i) => {
            const weight = i + 1;
            weightedSum += sample.velocity * weight;
            weightTotal += weight;
        });

        return weightedSum / weightTotal;
    }

    function resetVelocityTracking() {
        velocityHistory = [];
        lastFramePos = 0;
        lastFrameTime = 0;
    }

    // ===============================
    // FACE RESULTS HANDLER
    // ===============================

    function handleFaceResults(results) {
        if (!results.multiFaceLandmarks || !results.multiFaceLandmarks.length) return;
        onFaceResults(results);
    }

    // ===============================
    // HAND RESULTS HANDLER
    // ===============================

    function handleHandResults(results) {

        const handLandmarks =
            (results.multiHandLandmarks && results.multiHandLandmarks.length > 0)
                ? results.multiHandLandmarks[0]
                : null;

        if (!handLandmarks) {

            if (window.isPinching && !handLostTimeout) {

                handLostTimeout = setTimeout(() => {
                    console.log("✋ Hand REALLY lost — applying momentum then snapping");
                    window.isPinching = false;
                    applyMomentumThenSnap();
                    handLostTimeout = null;
                }, 120);
            }

            return;
        }

        if (handLostTimeout) {
            clearTimeout(handLostTimeout);
            handLostTimeout = null;
        }

        const landmarks = handLandmarks;

        const indexTip = landmarks[8];
        const indexPip = landmarks[6];

        const middleTip = landmarks[12];
        const middlePip = landmarks[10];

        const ringTip = landmarks[16];
        const ringPip = landmarks[14];

        const pinkyTip = landmarks[20];
        const pinkyPip = landmarks[18];

        // ===============================
        // TWO-FINGER DETECTION
        // ===============================

        const indexExtended = indexTip.y < indexPip.y;
        const middleExtended = middleTip.y < middlePip.y;
        const ringFolded = ringTip.y > ringPip.y;
        const pinkyFolded = pinkyTip.y > pinkyPip.y;

        const twoFingerActive =
            indexExtended &&
            middleExtended &&
            ringFolded &&
            pinkyFolded;

        if (!window.isPinching && twoFingerActive) {

            console.log("✌️ Scroll Mode START");

            window.isPinching = true;

            gsap.killTweensOf(window);

            pinchStartY = indexTip.x;
            scrollStartY = window.scrollY;

            resetVelocityTracking();
            return;
        }

        if (window.isPinching && !twoFingerActive) {

            console.log("🖐 Scroll Mode END — applying momentum");

            window.isPinching = false;
            applyMomentumThenSnap();
            return;
        }

        if (window.isPinching) {

            recordVelocity(indexTip.x);

            const delta = indexTip.x - pinchStartY;
            const scrollAmount = delta * SCROLL_MULTIPLIER;

            window.scrollTo({
                top: scrollStartY + scrollAmount,
                behavior: "auto"
            });
        }
    }

    // ===============================
    // MOMENTUM THEN SNAP
    // ===============================

    function applyMomentumThenSnap() {
        const sections = gsap.utils.toArray(".track-section");
        const mainTrigger = ScrollTrigger.getById("mainScroll");

        if (!sections.length || !mainTrigger) return;

        const total = sections.length;

        const rawProgress = (window.scrollY - mainTrigger.start) / (mainTrigger.end - mainTrigger.start);
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        console.log("Current scrollY:", window.scrollY);
        console.log("Manual progress:", clampedProgress);

        const velocity = getReleaseMomentum();
        resetVelocityTracking();

        let currentIndex = Math.round(clampedProgress * (total - 1));

        if (Math.abs(velocity) > MIN_VELOCITY_FOR_MOMENTUM) {
            if (velocity > 0 && currentIndex < total - 1) {
                currentIndex++;
            } else if (velocity < 0 && currentIndex > 0) {
                currentIndex--;
            }
        }

        console.log("📌 Momentum snap to section index:", currentIndex);

        const targetProgress = currentIndex / (total - 1);
        const targetScroll = mainTrigger.start + (mainTrigger.end - mainTrigger.start) * targetProgress;

        gsap.to(window, {
            scrollTo: { y: targetScroll },
            duration: 1.6,
            ease: "power3.out",
            onComplete: () => {
                ScrollTrigger.refresh();
            }
        });
    }

    // ===============================
    // SEQUENTIAL MODEL INITIALIZATION
    // ===============================

    async function initModelsSequentially() {

        // ── STEP 1: FaceMesh ──

        if (!window._faceMeshInstance) {

            console.log("🧠 Creating FaceMesh...");

            window._faceMeshInstance = new FaceMesh({
                locateFile: (file) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`
            });

            window._faceMeshInstance.setOptions({
                maxNumFaces: 1,
                refineLandmarks: false,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.6
            });

            window._faceMeshInstance.onResults(handleFaceResults);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 64;
            tempCanvas.height = 64;

            try {
                await window._faceMeshInstance.send({ image: tempCanvas });
            } catch (e) {
                // Expected — first frame with blank canvas
            }

            console.log("✅ FaceMesh ready");

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // ── STEP 2: Hands (only after FaceMesh is done) ──

        if (!window._handsInstance) {

            console.log("🤚 Creating Hands...");

            window._handsInstance = new Hands({
                locateFile: (file) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
            });

            window._handsInstance.setOptions({
                maxNumHands: 1,
                modelComplexity: 0,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.6
            });

            window._handsInstance.onResults(handleHandResults);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 64;
            tempCanvas.height = 64;

            try {
                await window._handsInstance.send({ image: tempCanvas });
            } catch (e) {
                // Expected
            }

            console.log("✅ Hands ready");
        }

        modelsReady = true;
    }

    // ===============================
    // ALTERNATING INFERENCE LOOP
    // ===============================

    function startInferenceLoop(faceMesh, hands) {

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const INFERENCE_INTERVAL = isMobile ? 80 : 50;

        let turn = 'hands';

        function loop() {
            if (!shouldProcessFrames) {
                inferenceLoopId = null;
                return;
            }

            if (videoElement.readyState < 2 || !modelsReady) {
                inferenceLoopId = setTimeout(loop, INFERENCE_INTERVAL);
                return;
            }

            if (turn === 'hands' && !processingHands) {

                processingHands = true;
                turn = 'face';

                hands.send({ image: videoElement }).then(() => {
                    processingHands = false;
                }).catch(() => {
                    processingHands = false;
                });

            } else if (turn === 'face' && !processingFace) {

                processingFace = true;
                turn = 'hands';

                faceMesh.send({ image: videoElement }).then(() => {
                    processingFace = false;
                }).catch(() => {
                    processingFace = false;
                });
            }

            inferenceLoopId = setTimeout(loop, INFERENCE_INTERVAL);
        }

        loop();
    }

    // ===============================
    // WEBCAM PRE-CHECK
    // ===============================

    async function checkWebcamAccess() {
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (!isSecure) {
            throw new Error('HTTPS_REQUIRED');
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('API_UNAVAILABLE');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(d => d.kind === 'videoinput');
        if (!hasCamera) {
            throw new Error('NO_CAMERA');
        }

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: isMobile ? 320 : 640 },
                height: { ideal: isMobile ? 240 : 480 }
            }
        });

        stream.getTracks().forEach(track => track.stop());

        return true;
    }

    // ===============================
    // START HAND TRACKING
    // ===============================

    async function startHandTracking() {
        if (handTrackingEnabled) return;

        console.log("🚀 Starting Hand + Face Tracking (Split models)");

        try {
            await checkWebcamAccess();
        } catch (err) {
            let userMessage;

            switch (err.message) {
                case 'HTTPS_REQUIRED':
                    userMessage = 'Motion tracking requires a secure (HTTPS) connection.';
                    break;
                case 'API_UNAVAILABLE':
                    userMessage = 'Your browser does not support webcam access.';
                    break;
                case 'NO_CAMERA':
                    userMessage = 'No webcam device was found.';
                    break;
                default:
                    if (err.name === 'NotAllowedError') {
                        userMessage = 'Camera permission was denied. Please allow access and try again.';
                    } else if (err.name === 'NotFoundError') {
                        userMessage = 'No webcam device was found.';
                    } else if (err.name === 'NotReadableError') {
                        userMessage = 'Camera is already in use by another application.';
                    } else {
                        userMessage = 'Could not access the webcam. Please check your settings.';
                    }
                    break;
            }

            console.warn(`❌ Webcam check failed: ${err.name || err.message}`);

            showWebcamError(userMessage);

            throw err;
        }

        shouldProcessFrames = true;

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const camWidth = isMobile ? 320 : 640;
        const camHeight = isMobile ? 240 : 480;

        camera = new Camera(videoElement, {
            onFrame: async () => {
                // Empty — inference on its own loop
            },
            width: camWidth,
            height: camHeight
        });

        camera.start();
        handTrackingEnabled = true;

        try {
            await initModelsSequentially();
            console.log("✅ Both models ready — starting inference");
            startInferenceLoop(window._faceMeshInstance, window._handsInstance);
        } catch (err) {
            console.error("❌ Model init failed:", err);
            await stopHandTracking();
            throw err;
        }
    }

    // ===============================
    // ERROR DISPLAY
    // ===============================

    function showWebcamError(message) {
        const popup = document.querySelector('.popup-vr');
        if (popup) {
            let errorEl = popup.querySelector('.webcam-error-msg');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'webcam-error-msg';
                errorEl.style.cssText = 'color: #ff4444; font-size: 14px; text-align: center; padding: 12px;';
                popup.prepend(errorEl);
            }
            errorEl.textContent = message;

            popup.style.display = 'flex';
            gsap.fromTo(popup,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );

            setTimeout(() => {
                gsap.to(popup, {
                    opacity: 0, y: 40, duration: 0.5, ease: "power2.in",
                    onComplete: () => {
                        popup.style.display = 'none';
                        if (errorEl) errorEl.remove();
                    }
                });
            }, 4000);
        }
    }

    // ===============================
    // STOP HAND TRACKING
    // ===============================

    async function stopHandTracking() {

        if (!handTrackingEnabled) return;

        shouldProcessFrames = false;

        if (inferenceLoopId !== null) {
            clearTimeout(inferenceLoopId);
            inferenceLoopId = null;
        }

        while (processingFace || processingHands) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        if (camera) {
            camera.stop();
            camera = null;
        }

        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }

        if (window.isPinching) {
            window.isPinching = false;
            resetVelocityTracking();
            window.snapToNearestSection();
        }

        handTrackingEnabled = false;
    }

    // =========================================
    // CONNECT TO YOUR EXISTING HEAD BUTTON
    // =========================================

    const originalStart = window.startHeadTracking;
    const originalStop = window.stopHeadTracking;

    window.startHeadTracking = async function () {
        if (originalStart) await originalStart();
        startHandTracking();
    };

    window.stopHeadTracking = function () {
        if (originalStop) originalStop();
        stopHandTracking();
    };
})();