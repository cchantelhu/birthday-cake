/**
 * Sync particle HUD greeting with gift-config.
 * Gestures (palm / fist / pinch) stay in the particle app — no note overlay.
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

document.title = greetingText(gift.name);

let hudTries = 0;
(function syncHud() {
  if (applyParticleHud() || hudTries++ > 80) return;
  requestAnimationFrame(syncHud);
})();
setInterval(applyParticleHud, 1500);
