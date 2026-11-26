/**
 * Mic blow detector with graceful denial — callers must keep tap-to-blow fallback.
 */
export function createBlowDetector({ threshold = 0.045, onBlow } = {}) {
  let ctx = null;
  let analyser = null;
  let data = null;
  let stream = null;
  let raf = 0;
  let active = false;
  let coolUntil = 0;
  let denied = false;

  async function start() {
    if (active || denied) return { ok: !denied, denied };
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      data = new Uint8Array(analyser.fftSize);
      active = true;
      loop();
      return { ok: true, denied: false };
    } catch {
      denied = true;
      active = false;
      return { ok: false, denied: true };
    }
  }

  function loop() {
    if (!active || !analyser) return;
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const now = performance.now();
    if (rms > threshold && now > coolUntil) {
      coolUntil = now + 1200;
      onBlow?.(rms);
    }
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    active = false;
    cancelAnimationFrame(raf);
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    ctx?.close?.().catch?.(() => {});
    ctx = null;
  }

  return {
    start,
    stop,
    get denied() {
      return denied;
    },
    get active() {
      return active;
    },
  };
}
