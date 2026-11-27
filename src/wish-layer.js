/**
 * Sync HUD from gift-config; demote photo-upload chrome only.
 * Wish frames come from wish-frames.js → particle XP slots (gold frames).
 * Pinch (or press G) cycles framed wishes in the 3D scene.
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

function demotePhotoGallery() {
  document.body.classList.add('hide-photo-gallery');
  const root = document.getElementById('root');
  if (!root) return;

  root.querySelectorAll('button').forEach((btn) => {
    const t = (btn.textContent || '').trim();
    if (/^(cake photos|birthday wishes|wish frames)$/i.test(t) || /add photos|upload/i.test(t)) {
      btn.dataset.giftHide = '1';
    }
  });

  root.querySelectorAll('.absolute').forEach((panel) => {
    const t = (panel.textContent || '').replace(/\s+/g, ' ').trim();
    if (
      /wish frames|cake photos/i.test(t) &&
      /Supports JPG|Add |photos stay|hover to delete|\d+\s+photos?/i.test(t) &&
      panel.clientWidth > 0 &&
      panel.clientWidth < 420
    ) {
      panel.dataset.giftHide = '1';
    }
  });
}

/** Press G to cycle the next gold wish frame (same as pinch). */
function wireWishFrameHotkey() {
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'g' || e.key === 'G') {
      window.__forceWishPinch = true;
      window.__holdWishPinch = true;
      setTimeout(() => {
        window.__holdWishPinch = false;
      }, 900);
    }
  });
}

document.title = greetingText(gift.name);
wireWishFrameHotkey();

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
