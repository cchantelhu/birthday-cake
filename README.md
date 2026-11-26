# Birthday cake gift

A phone-friendly 3D birthday cake: light the candle, blow it out, open a personal note, then (optionally) browse **Cake Photos** with gestures. Sibling of [christmas-tree](https://github.com/cchantelhu/christmas-tree) — that repo is **not** modified.

## Try it

- Full: https://cchantelhu.github.io/birthday-cake/
- Mobile lite: https://cchantelhu.github.io/birthday-cake/?lite=1

Enable GitHub Pages yourself if needed: **Settings → Pages → Deploy from branch → `main` / root (`/`)**.

## Personalize (one file)

Edit **`gift-config.js`** at the repo root:

| Field | Meaning |
|--------|---------|
| `name` | His name. Leave blank → greeting is **Happy birthday!** |
| `message` | Text inside the folded note |
| `photo` | Path to a photo in the note (use `''` to hide) |
| `photoCaption` | Shown when he taps the photo (card back) |

Ship a photo under the site (already includes a placeholder):

- Default path: **`media/placeholder-photo.png`**
- Replace that file (or point `photo` at another path under this repo) so it works on his phone without extra hosting.

Then commit + push. No build step.

```js
export const gift = {
  name: 'Alex',
  message: 'Your note here…',
  photo: 'media/placeholder-photo.png',
  photoCaption: 'A line on the back of the photo.',
};
```

## How the gift plays

1. Tap to enter → **Happy birthday, [name]** / **I made you a cake 😊**
2. Tap the matchbook (**Light the candle.**) → strike → wick lights → acoustic birthday song
3. **Blow it out when you’re ready** — mic blow **or** tap the flame (candle stays lit until he chooses)
4. Smoke curls → note under the plate: **Okay, my turn.** → tap to read your message; tap photo for caption
5. **Cake Photos** gallery unlocks after the note (add local photos; optional camera gestures)

If camera or mic is denied, tap fallbacks still reach the note and gallery.

## Music (license-safe)

**Happy Birthday (Acoustic Guitar)** — CC0 recording by [Tom Kincaid / VOLE.wtf](https://vole.wtf/happy-birthday/).  
File: `audio/happy-birthday-acoustic-guitar.mp3`

## Privacy

- Gallery photos stay in this site’s IndexedDB on the device (`birthday-cake` / `gallery`).
- Camera/mic stay in-browser; nothing is uploaded by this app.

## Repo layout

- `gift-config.js` — **edit this to personalize**
- `media/placeholder-photo.png` — swap for a real photo
- `index.html`, `styles.css`, `src/` — gift flow + Three.js cake
- `vendor/` — Three.js
- `mediapipe/` — optional hand tracking
- `audio/` — birthday song

Cake geometry is generated in-engine (plate, frosted cake, striped candle, matchbook, sparkles) — no external cake asset required.
