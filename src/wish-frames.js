/**
 * Build 8 framed wish textures (PNG blob URLs) for the particle app's gold frames.
 * Must load before assets/index-*.js so window.__birthdayWishFrames is ready.
 * Blob URLs (not SVG, not giant data URLs) load reliably via Three TextureLoader.
 * Text from gift-config.js wishes[0..7] → BIRTHDAY 01…08 slots.
 */
import { gift } from '../gift-config.js';

const PALETTE = [
  ['#0e1424', '#ffe3a0'],
  ['#101628', '#ffd86b'],
  ['#15101f', '#fff0d2'],
  ['#101628', '#e8b86d'],
  ['#0e1424', '#ffe3a0'],
  ['#101628', '#ffd86b'],
  ['#15101f', '#fff7e6'],
  ['#101628', '#e8b86d'],
];

const DEFAULTS = [
  'Happy birthday — make a wish.',
  'Another year of you. I’m so glad.',
  'May this year be gentle and bright.',
  'You make ordinary days feel golden.',
  'Here’s to more laughter together.',
  'Warm cake, warmer company.',
  'Cheers to you, today and always.',
  'I love you. Always.',
];

function wrapLines(text, maxChars = 16) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 5);
}

function canvasToBlobUrl(canvas) {
  const dataUrl = canvas.toDataURL('image/png');
  const b64 = dataUrl.split(',')[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
}

function frameTexture(label, bg, stroke, index) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = stroke;
  ctx.lineWidth = 16;
  ctx.strokeRect(24, 24, size - 48, size - 48);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.strokeRect(44, 44, size - 88, size - 88);
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 96, 0, Math.PI * 2);
  ctx.setLineDash([6, 8]);
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.35;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.fillStyle = stroke;
  ctx.globalAlpha = 0.6;
  ctx.font = '600 20px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`BIRTHDAY ${String(index + 1).padStart(2, '0')}`, size / 2, 68);
  ctx.globalAlpha = 1;

  const lines = wrapLines(label, 16);
  ctx.fillStyle = stroke;
  ctx.font = '700 38px Georgia, "Times New Roman", serif';
  const lineH = 48;
  const startY = size / 2 - ((lines.length - 1) * lineH) / 2 + 10;
  lines.forEach((line, i) => {
    ctx.fillText(line, size / 2, startY + i * lineH);
  });

  return canvasToBlobUrl(c);
}

function buildFrames() {
  const raw = Array.isArray(gift.wishes) ? gift.wishes : [];
  const wishes = Array.from({ length: 8 }, (_, i) => {
    const w = String(raw[i] || DEFAULTS[i] || DEFAULTS[0]).trim();
    return w || DEFAULTS[i];
  });
  return wishes.map((w, i) => {
    const [bg, stroke] = PALETTE[i % PALETTE.length];
    return frameTexture(w, bg, stroke, i);
  });
}

window.__birthdayWishFrames = buildFrames();
