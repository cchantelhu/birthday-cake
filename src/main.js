import { gift } from '../gift-config.js';
import { createCakeScene } from './cake-scene.js';
import { createBlowDetector } from './mic-blow.js';
import { createGallery } from './gallery.js';

const lite = new URLSearchParams(location.search).has('lite');

function greetingText(name) {
  const n = (name || '').trim();
  return n ? `Happy birthday, ${n}` : 'Happy birthday!';
}

const audio = new Audio('./audio/happy-birthday-acoustic-guitar.mp3');
audio.loop = true;
audio.preload = 'auto';

const state = {
  phase: 'gate', // gate | intro | match | lit | smoke | noteFolded | noteOpen | gallery
};

const els = {
  gate: document.getElementById('enter-gate'),
  greeting: document.getElementById('greeting'),
  subline: document.getElementById('subline'),
  prompt: document.getElementById('prompt'),
  promptHint: document.getElementById('prompt-hint'),
  noteLayer: document.getElementById('note-layer'),
  noteCard: document.getElementById('note-card'),
  noteFolded: document.getElementById('note-folded'),
  noteFront: document.getElementById('note-front'),
  noteMessage: document.getElementById('note-message'),
  notePhotoWrap: document.getElementById('note-photo-wrap'),
  notePhoto: document.getElementById('note-photo'),
  noteCaption: document.getElementById('note-caption'),
  btnContinueGallery: document.getElementById('btn-continue-gallery'),
  btnCloseNote: document.getElementById('btn-close-note'),
};

document.title = greetingText(gift.name);
els.greeting.textContent = greetingText(gift.name);
els.subline.textContent = 'I made you a cake 😊';
els.noteMessage.textContent = gift.message || '';
els.noteCaption.textContent = gift.photoCaption || '';

if (gift.photo) {
  els.notePhoto.src = gift.photo;
  els.notePhoto.alt = gift.photoCaption || 'A photo for you';
  els.notePhotoWrap.hidden = false;
} else {
  els.notePhotoWrap.hidden = true;
}

const canvas = document.getElementById('scene-canvas');
const scene = createCakeScene(canvas, { lite });
const gallery = createGallery({ lite });

function setPrompt(text, hint = '') {
  els.prompt.textContent = text || '';
  els.prompt.classList.toggle('show', Boolean(text));
  els.promptHint.textContent = hint || '';
  els.promptHint.classList.toggle('show', Boolean(hint));
}

function playSong() {
  audio.currentTime = 0;
  const p = audio.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {
      /* autoplay may still need a gesture — match tap already provided one */
      audio.play().catch(() => {});
    });
  }
}

const blow = createBlowDetector({
  threshold: lite ? 0.05 : 0.042,
  onBlow: () => {
    if (state.phase === 'lit') blowOut();
  },
});

function goIntro() {
  state.phase = 'intro';
  els.gate.classList.add('hidden');
  els.greeting.classList.add('show');
  els.subline.classList.add('show');
  // Keep orbit off until after the candle so matchbook taps register cleanly
  scene.enableOrbit(false);

  // After greeting settles, invite matchbook
  setTimeout(() => {
    if (state.phase !== 'intro') return;
    state.phase = 'match';
    setPrompt('Light the candle.', 'Tap the matchbook beside the plate.');
  }, 2200);
}

function onMatchLit() {
  state.phase = 'lit';
  scene.enableOrbit(true);
  playSong();
  setPrompt(
    'Blow it out when you’re ready.',
    'Blow into the mic — or tap the flame.',
  );
  blow.start().then((res) => {
    if (res.denied) {
      setPrompt(
        'Blow it out when you’re ready.',
        'Mic unavailable — tap the flame anytime.',
      );
    }
  });
}

function blowOut() {
  if (state.phase !== 'lit') return;
  if (!scene.extinguishCandle()) return;
  state.phase = 'smoke';
  blow.stop();
  setPrompt('');
  // Wait for smoke curl, then reveal note
  setTimeout(() => {
    scene.revealNotePeek();
    state.phase = 'noteFolded';
    // Label lives on the 3D note — keep HUD to a short tap hint only
    setPrompt('', 'Tap the note under the plate.');
  }, 1600);
}

function openNote() {
  if (state.phase !== 'noteFolded' && state.phase !== 'noteOpen') return;
  state.phase = 'noteOpen';
  setPrompt('');
  els.noteLayer.classList.add('show');
  els.noteFolded.hidden = true;
  els.noteFront.hidden = false;
  els.noteCard.classList.remove('flipped');
}

function enterGallery() {
  state.phase = 'gallery';
  els.noteLayer.classList.remove('show');
  setPrompt('');
  els.greeting.classList.remove('show');
  els.subline.classList.remove('show');
  gallery.show();
  scene.enableOrbit(true);
}

els.gate.addEventListener('click', goIntro);
els.gate.addEventListener(
  'keydown',
  (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goIntro();
    }
  },
  true,
);

canvas.addEventListener('pointerdown', (e) => {
  if (state.phase === 'match') {
    if (scene.pickMatchbook(e)) {
      setPrompt('Striking…');
      scene.strikeMatch(onMatchLit);
    }
    return;
  }
  if (state.phase === 'lit') {
    if (scene.pickFlame(e)) blowOut();
    return;
  }
  if (state.phase === 'noteFolded') {
    if (scene.pickNotePeek(e)) openNote();
  }
});

els.noteCard.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;
  if (!gift.photo) return;
  // Tap photo / card to flip caption
  if (
    e.target === els.notePhoto ||
    e.target.closest('#note-photo-wrap') ||
    els.noteCard.classList.contains('flipped')
  ) {
    els.noteCard.classList.toggle('flipped');
  }
});

els.btnContinueGallery.addEventListener('click', enterGallery);
els.btnCloseNote.addEventListener('click', () => {
  els.noteLayer.classList.remove('show');
  // Allow reopening note from peek until gallery
  if (state.phase === 'noteOpen') {
    state.phase = 'noteFolded';
    setPrompt('', 'Tap the note again — or open Cake Photos from the note.');
  }
});

// Prompt strip fallbacks (mic/camera denied, hard-to-hit 3D targets)
const promptStrip = els.prompt.parentElement;
promptStrip?.classList.add('hit');
promptStrip?.addEventListener('click', () => {
  if (state.phase === 'match') {
    setPrompt('Striking…');
    scene.strikeMatch(onMatchLit);
  } else if (state.phase === 'lit') {
    blowOut();
  } else if (state.phase === 'noteFolded') {
    openNote();
  }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  scene.update(dt, t);
  scene.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Soften orbit during early phases so match taps register
scene.enableOrbit(false);
