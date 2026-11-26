const DB_NAME = 'birthday-cake';
const STORE = 'gallery';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function listImages() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function addImage(blob) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add({
      blob,
      createdAt: Date.now(),
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function removeImage(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/**
 * Cake Photos gallery + optional MediaPipe gestures.
 * Camera denial still leaves file upload + tap navigation working.
 */
export function createGallery({ lite = false, onStatus } = {}) {
  const shell = document.getElementById('gallery-shell');
  const thumbs = document.getElementById('thumbs');
  const fileInput = document.getElementById('photo-input');
  const slide = document.getElementById('slide-photo');
  const slideImg = slide.querySelector('img');
  const statusEl = document.getElementById('gesture-status');
  const preview = document.getElementById('hand-preview');
  const btnCam = document.getElementById('btn-camera');
  const btnAdd = document.getElementById('btn-add-photo');
  const btnNext = document.getElementById('btn-next-photo');
  const btnPrev = document.getElementById('btn-prev-photo');

  let items = [];
  let urls = [];
  let index = 0;
  let hands = null;
  let camera = null;
  let tracking = false;
  let pinchLatch = false;
  let palmLit = false;

  function setStatus(msg) {
    statusEl.textContent = msg;
    onStatus?.(msg);
  }

  function revokeUrls() {
    urls.forEach((u) => URL.revokeObjectURL(u));
    urls = [];
  }

  async function refresh() {
    revokeUrls();
    items = await listImages();
    urls = items.map((it) => URL.createObjectURL(it.blob));
    renderThumbs();
    showCurrent();
  }

  function renderThumbs() {
    thumbs.innerHTML = '';
    urls.forEach((url, i) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Photo ${i + 1}`;
      if (i === index) img.classList.add('active');
      img.addEventListener('click', () => {
        index = i;
        showCurrent();
        renderThumbs();
      });
      thumbs.appendChild(img);
    });
  }

  function showCurrent() {
    if (!urls.length) {
      slide.classList.remove('show');
      slideImg.removeAttribute('src');
      return;
    }
    index = ((index % urls.length) + urls.length) % urls.length;
    slideImg.src = urls[index];
    slide.classList.add('show');
    [...thumbs.children].forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });
  }

  function next() {
    if (!urls.length) return;
    index = (index + 1) % urls.length;
    showCurrent();
    renderThumbs();
  }

  function prev() {
    if (!urls.length) return;
    index = (index - 1 + urls.length) % urls.length;
    showCurrent();
    renderThumbs();
  }

  btnAdd.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const files = [...(fileInput.files || [])];
    for (const f of files) {
      if (f.type.startsWith('image/')) await addImage(f);
    }
    fileInput.value = '';
    await refresh();
  });
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  function fingerDist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = (a.z || 0) - (b.z || 0);
    return Math.hypot(dx, dy, dz);
  }

  function onResults(results) {
    const hand = results.multiHandLandmarks?.[0];
    if (!hand) {
      pinchLatch = false;
      return;
    }
    const thumb = hand[4];
    const indexTip = hand[8];
    const dist = fingerDist(thumb, indexTip);
    const pinching = dist < 0.06;
    if (pinching && !pinchLatch) {
      pinchLatch = true;
      next();
    } else if (!pinching && pinchLatch) {
      pinchLatch = false;
    }

    // open palm heuristic: tips above MCP joints
    const tips = [8, 12, 16, 20];
    const mcps = [5, 9, 13, 17];
    let open = 0;
    for (let i = 0; i < tips.length; i++) {
      if (hand[tips[i]].y < hand[mcps[i]].y) open++;
    }
    palmLit = open >= 3;
    document.documentElement.style.setProperty(
      '--palm-glow',
      palmLit ? '1' : '0',
    );
  }

  async function startCamera() {
    if (tracking) return;
    if (lite) {
      setStatus('Lite mode: use buttons for photos.');
      return;
    }
    try {
      setStatus('Loading hand tracking…');
      await loadScript('./mediapipe/hands/hands.js');
      await loadScript('./mediapipe/camera_utils/camera_utils.js');
      // eslint-disable-next-line no-undef
      hands = new Hands({
        locateFile: (file) => `./mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);

      // eslint-disable-next-line no-undef
      camera = new Camera(preview, {
        onFrame: async () => {
          if (hands) await hands.send({ image: preview });
        },
        width: 320,
        height: 240,
      });
      await camera.start();
      tracking = true;
      setStatus('Open palm · Pinch for next photo');
    } catch (err) {
      console.warn(err);
      tracking = false;
      setStatus('Camera denied — tap buttons to browse photos.');
    }
  }

  function stopCamera() {
    try {
      camera?.stop?.();
    } catch {
      /* ignore */
    }
    tracking = false;
  }

  btnCam.addEventListener('click', () => {
    if (tracking) {
      stopCamera();
      setStatus('Camera off — buttons still work.');
    } else {
      startCamera();
    }
  });

  return {
    async show() {
      shell.classList.add('show');
      await refresh();
      setStatus(
        lite
          ? 'Lite mode: add photos with the button.'
          : 'Optional: enable camera for gestures.',
      );
    },
    hide() {
      shell.classList.remove('show');
      stopCamera();
    },
    refresh,
    next,
    prev,
  };
}
