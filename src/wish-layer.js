/**
 * Sync HUD from gift-config + cycle birthday wishes on pinch / tap.
 * No note overlay. Photo gallery demoted.
 */
import { gift } from '../gift-config.js';

function greetingText(name) {
  const n = (name || '').trim();
  return n ? `Happy birthday, ${n}` : 'Happy birthday';
}

function lovingLine() {
  const line = (gift.line || '').trim();
  return line || 'I made this little cake for you.';
}

function wishList() {
  const list = Array.isArray(gift.wishes)
    ? gift.wishes.map((w) => String(w || '').trim()).filter(Boolean)
    : [];
  return list.length
    ? list
    : ['Happy birthday — make a wish.', 'I love you. Always.'];
}

/** Keep the particle HUD in sync with gift-config (name + loving line). */
function applyParticleHud() {
  const root = document.getElementById('root');
  if (!root) return false;
  const h1 = root.querySelector('h1');
  if (!h1) return false;
  h1.textContent = greetingText(gift.name);

  const sub = h1.parentElement?.querySelector('p');
  if (sub) sub.textContent = lovingLine();

  const eyebrow = h1.parentElement?.querySelector('span');
  if (eyebrow) eyebrow.textContent = 'For you';
  return true;
}

/** Hide photo-upload / gallery chrome; retitle leftover wish buttons. */
function demotePhotoGallery() {
  document.body.classList.add('hide-photo-gallery');
  const root = document.getElementById('root');
  if (!root) return;

  root.querySelectorAll('button').forEach((btn) => {
    const t = (btn.textContent || '').trim();
    if (/cake photos|birthday wishes|add photos|upload/i.test(t)) {
      btn.dataset.giftHide = '1';
    }
  });

  // Hide floating panels that advertise photo counts
  root.querySelectorAll('div').forEach((el) => {
    const t = (el.textContent || '').trim();
    if (
      el.children.length < 12 &&
      (/^\d+\s+photos?/i.test(t) || /local only|indexeddb|add photos/i.test(t))
    ) {
      const panel = el.closest('.absolute') || el;
      panel.dataset.giftHide = '1';
    }
  });
}

document.title = greetingText(gift.name);

let hudTries = 0;
(function syncHud() {
  applyParticleHud();
  demotePhotoGallery();
  if (hudTries++ > 80) return;
  requestAnimationFrame(syncHud);
})();
setInterval(() => {
  applyParticleHud();
  demotePhotoGallery();
}, 1500);

// --- Gift wish UI ---
const wishes = wishList();
let wishIndex = -1;
let pinchLatch = false;
let closeTimer = null;

const els = {
  box: document.getElementById('gift-box'),
  card: document.getElementById('gift-wish-card'),
  btn: document.getElementById('gift-open-btn'),
  hint: document.getElementById('gift-wish-hint'),
};

function showWish(next = true) {
  if (next) wishIndex = (wishIndex + 1) % wishes.length;
  if (wishIndex < 0) wishIndex = 0;
  els.card.hidden = false;
  els.card.textContent = wishes[wishIndex];
  els.card.classList.remove('show');
  els.box.classList.remove('open');
  void els.box.offsetWidth;
  requestAnimationFrame(() => {
    els.box.classList.add('open');
    els.card.classList.add('show');
  });
  els.hint.textContent = `Wish ${wishIndex + 1} of ${wishes.length} · pinch or tap for another`;
  if (closeTimer) clearTimeout(closeTimer);
}

els.btn?.addEventListener('click', (e) => {
  e.stopPropagation();
  showWish(true);
});

function onHandTick() {
  const hand = window.__birthdayHand;
  const pinching = hand?.isPresent && hand.gesture === 'PINCH';
  if (pinching && !pinchLatch) {
    pinchLatch = true;
    showWish(true);
  } else if (!pinching && pinchLatch) {
    pinchLatch = false;
  }
  requestAnimationFrame(onHandTick);
}
requestAnimationFrame(onHandTick);

// After enter, softly introduce the first closed gift
window.addEventListener(
  'pointerdown',
  () => {
    setTimeout(() => {
      if (wishIndex < 0) {
        els.hint.textContent =
          'Pinch to open a gift · or tap the button';
      }
    }, 1800);
  },
  { once: true, capture: true },
);
