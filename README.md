# Radiant Birthday Cake · Happy Birthday

A browser-based 3D interactive birthday cake page with gesture control, photo slideshow, music, celebration particles, and a layered wish / blow-out note. Sibling of [christmas-tree](https://github.com/cchantelhu/christmas-tree) (that repo is unchanged).

## Try it online

- Desktop (full experience): https://cchantelhu.github.io/birthday-cake/
- Mobile lite: https://cchantelhu.github.io/birthday-cake/?lite=1

**You must enable GitHub Pages yourself** (this app cannot): repo **Settings → Pages → Deploy from a branch → `main` / root (`/`)**.

On phones, Safari or Chrome is recommended. If the WeChat in-app browser cannot access the camera, choose “Open in Safari.”

## How to use

1. Open the page and click once to enter.
2. Add photos in the **Cake Photos** panel (local browser storage; pinch advances photos).
3. Click the camera / gesture button at the top right and allow camera access.
4. Use these gestures in front of the camera:
   - Open palm: birthday cake particles light up / bloom.
   - Closed fist: particles return to the cake shape and stay clustered.
   - Pinch thumb and index finger, then release: switch to the next photo; after the last photo, it loops to the first.
5. After the cake blooms (or after a short settle), **make a wish** and **blow out the candle** (mic or the Blow button) to open the personalized note from `gift-config.js`.
6. Drag with the mouse or use touch to adjust the view.
7. Modes: **Birthday Cake** (layered particle cake) or **Confetti Drift**.

## Personalize (one file)

Edit **`gift-config.js`** at the repo root:

| Field | Use |
|--------|-----|
| `name` | Blank → “Happy birthday!” |
| `message` | Wish-note text after blow-out |
| `photo` | Path under the site (`''` hides) |
| `photoCaption` | Back of the photo card |

Placeholder photo: `media/placeholder-photo.png`.

## What this build prioritizes

- **Restored** particle cake / confetti drift / MediaPipe gesture camera / Cake Photos gallery (pre–gift-flow experience).
- **Added** layered wish + candle blow-out + note on top of gestures (does not replace open-palm enter).
- Matchbook-only mesh redesign is **demoted** (no longer the main path).
- Visual: stepped birthday-cake silhouette with a **candle tip** (not a Christmas star).

## Music (license-safe)

Default track: **Happy Birthday (Acoustic Guitar)** — CC0 / public domain recording by [Tom Kincaid / VOLE.wtf](https://vole.wtf/happy-birthday/).  
Melody of “Happy Birthday to You” is public domain in the US; this recording is released as CC0. Attribution is appreciated though not required by CC0.

File: `audio/happy-birthday-acoustic-guitar.mp3`

## Privacy

- Uploaded photos are stored in this site’s local database on the current device and browser; they are not written into this GitHub repository.
- This version has no feature that uploads photos to a server or sends them to the site owner; photos are shown via local browser object URLs.
- The camera feed is processed by MediaPipe hand tracking in the browser; the current code does not send the camera feed to a server.
- Mic blow-out (optional) uses the browser microphone locally and is never uploaded.
- Photos persist when you reopen the page on the same device and browser profile; anyone sharing that browser profile may see them.
- Clearing this site’s data in the browser deletes locally saved photos. Photos do not sync automatically across devices or browser profiles.

## Repository contents

Static build files ready for GitHub Pages:

- `index.html` — page entry (particle app + wish layer)
- `assets/` — built particle JavaScript and CSS
- `mediapipe/` — gesture recognition runtime
- `audio/` — birthday music (CC0)
- `gift-config.js` — personalization
- `src/wish-layer.js` / `src/mic-blow.js` — layered wish + blow
- `wish-layer.css` — note / prompt overlay styles

Gesture camera fixes from christmas-tree PR #2 are included here only (MediaPipe base URL + offscreen preview).

## Source

Adapted from [cchantelhu/christmas-tree](https://github.com/cchantelhu/christmas-tree) / upstream [nobody-r/christmas-tree](https://github.com/nobody-r/christmas-tree). Birthday retheme, cake silhouette, wish layer, and audio are unique to this repository.
