/**
 * Layered wish + blow experience on top of the particle/gesture cake.
 * Does not replace open-palm bloom, pinch gallery, or confetti drift.
 */
import { gift } from '../gift-config.js';
import { createBlowDetector } from './mic-blow.js';

const lite = new URLSearchParams(location.search).has('lite');

function greetingText(name) {
  const n = (name || '').trim();
  return n ? `Happy birthday, ${n}` : 'Happy birthday!';
}

const state = {
  phase: 'watching', // watching | lit | blown | note
  entered: false,
  openMs: 0,
  lastTs: performance.now(),
};

const els = {
  banner: document.getElementById('wish-banner'),
  greeting: document.getElementById('wish-greeting'),
  prompt: document.getElementById('wish-prompt'),
  hint: document.getElementById('wish-hint'),
  blowBtn: document.getElementById('wish-blow-btn'),
  noteLayer: document.getElementById('wish-note-layer'),
  noteMessage: document.getElementById('wish-note-message'),
  notePhotoWrap: document.getElementById('wish-note-photo-wrap'),
  notePhoto: document.getElementById('wish-note-photo'),
  noteCaption: document.getElementById('wish-note-caption'),
  noteCard: document.getElementById('wish-note-card'),
  btnClose: document.getElementById('wish-note-close'),
  btnGallery: document.getElementById('wish-note-gallery'),
};

document.title = `${greetingText(gift.name)} · Radiant Birthday Cake`;
els.greeting.textContent = greetingText(gift.name);
els.noteMessage.textContent = gift.message || '';
els.noteCaption.textContent = gift.photoCaption || '';

if (gift.photo) {
  els.notePhoto.src = gift.photo;
  els.notePhoto.alt = gift.photoCaption || 'A photo for you';
  els.notePhotoWrap.hidden = false;
} else {
  els.notePhotoWrap.hidden = true;
}

function setPrompt(text, hint = '', showBlow = false) {
  els.prompt.textContent = text || '';
  els.hint.textContent = hint || '';
  els.banner.classList.toggle('show', Boolean(text) || showBlow);
  els.blowBtn.hidden = !showBlow;
}

const blow = createBlowDetector({
  threshold: lite ? 0.05 : 0.042,
  onBlow: () => {
    if (state.phase === 'lit') blowOut();
  },
});

function enterLit() {
  if (state.phase !== 'watching') return;
  state.phase = 'lit';
  setPrompt(
    'Make a wish — then blow out the candle.',
    'Blow into the mic, or tap Blow.',
    true,
  );
  blow.start().then((res) => {
    if (state.phase !== 'lit') return;
    if (res.denied) {
      setPrompt(
        'Make a wish — then blow out the candle.',
        'Mic unavailable — tap Blow anytime.',
        true,
      );
    }
  });
}

function blowOut() {
  if (state.phase !== 'lit') return;
  state.phase = 'blown';
  blow.stop();
  setPrompt('Wish sealed.', '');
  setTimeout(() => {
    state.phase = 'note';
    setPrompt('');
    els.noteLayer.classList.add('show');
  }, 700);
}

function markEntered() {
  if (state.entered) return;
  state.entered = true;
  // Soft fallback if gestures stay off: invite wish after the cake settles
  setTimeout(() => {
    if (state.phase === 'watching') enterLit();
  }, lite ? 5000 : 8000);
}

// First interaction is also the particle enter gate
window.addEventListener(
  'pointerdown',
  () => {
    markEntered();
  },
  { once: true, capture: true },
);

els.blowBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  blowOut();
});

els.noteCard.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  if (!gift.photo) return;
  if (
    e.target === els.notePhoto ||
    e.target.closest('#wish-note-photo-wrap') ||
    els.noteCard.classList.contains('flipped')
  ) {
    els.noteCard.classList.toggle('flipped');
  }
});

els.btnClose.addEventListener('click', () => {
  els.noteLayer.classList.remove('show');
  setPrompt('', 'Open palm still blooms the cake · pinch cycles Cake Photos.');
  els.banner.classList.add('show');
});

els.btnGallery.addEventListener('click', () => {
  els.noteLayer.classList.remove('show');
  setPrompt(
    'Cake Photos is in the panel.',
    'Use the gallery button · pinch for next photo.',
  );
  els.banner.classList.add('show');
  // Nudge the existing Cake Photos control if present
  const buttons = [...document.querySelectorAll('button')];
  const galleryBtn = buttons.find((b) => /cake photos/i.test(b.textContent || ''));
  galleryBtn?.click();
});

function tick(now) {
  const dt = Math.min(0.05, (now - state.lastTs) / 1000);
  state.lastTs = now;

  if (state.phase === 'watching' && state.entered) {
    const hand = window.__birthdayHand;
    if (hand?.isPresent && hand.gesture === 'OPEN') {
      state.openMs += dt * 1000;
      if (state.openMs > 1400) enterLit();
    } else {
      state.openMs = Math.max(0, state.openMs - dt * 600);
    }
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
