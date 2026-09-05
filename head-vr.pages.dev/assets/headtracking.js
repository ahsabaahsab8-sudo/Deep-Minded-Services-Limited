console.log('Head tracking script loaded');

// ----------------------------
// Global bridge object
// ----------------------------

window.HeadTracking = {
  yaw: 0,
  pitch: 0,
  roll: 0,
  enabled: false,
  video: null
};

let mediaStream = null;

// ----------------------------
// Internal lifecycle flags
// ----------------------------

let faceTrackingInitialized = false;
let rafRunning = false;

// ----------------------------
// Calibration state
// ----------------------------

let calibrating = false;
let calibrationFrames = 0;
const CALIBRATION_FRAME_COUNT = 20;

let yawOffset = 0;
let pitchOffset = 0;

// smooth ramp-in after calibration
let influence = 0;

// skip frames after calibration to prevent jump
let skipFramesAfterCalibration = 0;

// ----------------------------
// Smoothing state
// ----------------------------

let smoothYaw = 0;
let smoothPitch = 0;

const SMOOTHING = 0.35;
const DEAD_ZONE = 0;

// cache PlayCanvas iframe
let playcanvasFrame = null;

window.addEventListener('load', () => {
  playcanvasFrame = document.querySelector('iframe[src*="playcanv"]');
});

// ----------------------------
// Webcam
// ----------------------------

async function initWebcam() {

  // Look for the video element created by the hand tracking script
  const trackingVideo = document.querySelector('video');

  if (!trackingVideo) {
    console.warn('Video element not found — hand tracking may not have started yet');
    return;
  }

  window.HeadTracking.video = trackingVideo;
  window.HeadTracking.enabled = true;

  console.log('Using shared camera feed for head tracking');
}

// ----------------------------
// Send data to PlayCanvas
// ----------------------------

function sendToPlayCanvas(yaw, pitch) {
  if (playcanvasFrame && playcanvasFrame.contentWindow) {
    playcanvasFrame.contentWindow.postMessage(
      {
        type: 'HEAD_TRACKING',
        yaw,
        pitch
      },
      '*'
    );
  }
}

function sendResetToPlayCanvas() {
  if (playcanvasFrame && playcanvasFrame.contentWindow) {
    playcanvasFrame.contentWindow.postMessage(
      {
        type: 'HEAD_TRACKING_RESET'
      },
      '*'
    );
  }
}

function sendStopToPlayCanvas() {
  if (playcanvasFrame && playcanvasFrame.contentWindow) {
    playcanvasFrame.contentWindow.postMessage(
      {
        type: 'HEAD_TRACKING_STOP'
      },
      '*'
    );
  }
}

// ----------------------------
// Face processing
// Called by handleFaceResults in the main script
// ----------------------------

function onFaceResults(results) {
  // ✅ Pause head tracking camera movement during snap
  if (window.isSnapping) return;

  if (!window.HeadTracking.enabled) {
    return;
  }

  if (!results.multiFaceLandmarks?.length) return;

  const lm = results.multiFaceLandmarks[0];

  const leftEye = lm[33];
  const rightEye = lm[263];
  const nose = lm[1];

  const eyeCenterX = (leftEye.x + rightEye.x) * 0.5;
  const yawRaw = nose.x - eyeCenterX;
  const pitchRaw = nose.y - 0.5;

  // ----------------------------
  // Calibration phase
  // ----------------------------

  if (calibrating) {
    yawOffset += yawRaw;
    pitchOffset += pitchRaw;
    calibrationFrames++;

    sendToPlayCanvas(0, 0);

    if (calibrationFrames >= CALIBRATION_FRAME_COUNT) {
      yawOffset /= calibrationFrames;
      pitchOffset /= calibrationFrames;

      smoothYaw = 0;
      smoothPitch = 0;
      influence = 0;
      skipFramesAfterCalibration = 3;

      calibrating = false;
      console.log('Head tracking calibrated');
    }
    return;
  }

  // ----------------------------
  // Skip frames after calibration
  // ----------------------------

  if (skipFramesAfterCalibration > 0) {
    skipFramesAfterCalibration--;
    sendToPlayCanvas(0, 0);
    return;
  }

  // ----------------------------
  // Apply offset + smoothing
  // ----------------------------

  const yaw = yawRaw - yawOffset;
  const pitch = pitchRaw - pitchOffset;

  smoothYaw += (yaw - smoothYaw) * SMOOTHING;
  smoothPitch += (pitch - smoothPitch) * SMOOTHING;

  influence = Math.min(1, influence + 0.05);

  const DEAD_ZONE_SOFT = 0;

  function softDeadZone(value, threshold) {
    const absVal = Math.abs(value);
    if (absVal < threshold) {
      return value * (absVal / threshold);
    }
    return value;
  }

  const outYaw = softDeadZone(smoothYaw, DEAD_ZONE_SOFT) * influence;
  const outPitch = softDeadZone(smoothPitch, DEAD_ZONE_SOFT) * influence;

  window.HeadTracking.yaw = outYaw;
  window.HeadTracking.pitch = outPitch;

  sendToPlayCanvas(outYaw, outPitch);
}

// ----------------------------
// Stop
// ----------------------------

window.stopHeadTracking = function () {
  if (!window.HeadTracking.enabled) return;

  window.HeadTracking.enabled = false;
  rafRunning = false;

  sendStopToPlayCanvas();

  // Do NOT stop camera here — hand tracking script owns it
  window.HeadTracking.video = null;

  smoothYaw = 0;
  smoothPitch = 0;
  yawOffset = 0;
  pitchOffset = 0;
  calibrating = false;
  calibrationFrames = 0;
  influence = 0;
  skipFramesAfterCalibration = 0;

  console.log('Webcam stopped');
};

// ----------------------------
// Utilities
// ----------------------------

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

// ----------------------------
// Public trigger
// ----------------------------

window.startHeadTracking = async function () {
  if (window.HeadTracking.enabled) return;

  console.log('Starting head tracking…');

  // Reset all state
  calibrating = true;
  calibrationFrames = 0;
  yawOffset = 0;
  pitchOffset = 0;
  influence = 0;
  skipFramesAfterCalibration = 0;
  smoothYaw = 0;
  smoothPitch = 0;

  sendResetToPlayCanvas();

  await initWebcam();

  sendToPlayCanvas(0, 0);

  console.log('Head tracking started');
};