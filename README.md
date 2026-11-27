# Birthday Cake · Happy Birthday

A browser-based 3D interactive birthday cake page with gesture control, photo slideshow, music, and celebration particles. Sibling of [christmas-tree](https://github.com/cchantelhu/christmas-tree) (that repo is unchanged).

## Try it online

- Desktop (full experience): https://cchantelhu.github.io/birthday-cake/
- Mobile lite: https://cchantelhu.github.io/birthday-cake/?lite=1

**You must enable GitHub Pages yourself** (this app cannot): repo **Settings → Pages → Deploy from a branch → `main` / root (`/`)**.

On phones, Safari or Chrome is recommended. If the WeChat in-app browser cannot access the camera, choose “Open in Safari.”

## How to use

1. Open the page and click once to enter.
2. Click the camera / gesture button at the top right and allow camera access (optional).
3. Use these gestures in front of the camera:
   - Open palm: birthday cake particles light up / bloom.
   - Closed fist: particles return to the cake shape and stay clustered.
   - Pinch: bring the next gold **wish frame** forward (eight lines from `gift-config.js`).
4. Drag with the mouse or use touch to adjust the view.
5. Modes: **Birthday Cake** (layered particle cake) or **Confetti Drift**.

## Personalize (one file)

Edit **`gift-config.js`** at the repo root:

| Field | Use |
|--------|-----|
| `name` | Blank → “Happy birthday” |
| `line` | Short loving line under the greeting |
| `wishes` | Nine short lines for the gold wish frames |

## What this build prioritizes

- Particle cake / confetti drift / MediaPipe gesture camera.
- Prior birthday-cake particle silhouette with candle tip.
- Warm **gold** sparkles with clearer (less blurry) bloom.
- Pinch cycles nine gold **wish frames** (same presentation as the old photo frames; text from `gift-config.js`).
- Ambient sky: small ribbons, confetti, and balloons (not snow).
- Cake toppers: fruit pieces instead of gift confetti cubes.
- Soft Polynesian corner florals; no countdown; no wish-note overlay; photo upload demoted.
- christmas-tree repo **untouched**.

## Music (license-safe)

Default track: **Happy Birthday (Acoustic Guitar)** — CC0 / public domain recording by [Tom Kincaid / VOLE.wtf](https://vole.wtf/happy-birthday/).  
Melody of “Happy Birthday to You” is public domain in the US; this recording is released as CC0. Attribution is appreciated though not required by CC0.

File: `audio/happy-birthday-acoustic-guitar.mp3`

## Privacy

- Uploaded photos are stored in this site’s local database on the current device and browser; they are not written into this GitHub repository.
- This version has no feature that uploads photos to a server or sends them to the site owner; photos are shown via local browser object URLs.
- The camera feed is processed by MediaPipe hand tracking in the browser; the current code does not send the camera feed to a server.
- Photos persist when you reopen the page on the same device and browser profile; anyone sharing that browser profile may see them.
- Clearing this site’s data in the browser deletes locally saved photos. Photos do not sync automatically across devices or browser profiles.

## Repository contents

Static build files ready for GitHub Pages:

- `index.html` — page entry (particle app + gift-config HUD sync)
- `assets/` — built particle JavaScript and CSS
- `mediapipe/` — gesture recognition runtime
- `audio/` — birthday music (CC0)
- `gift-config.js` — personalization (name, line, nine wishes)
- `src/wish-frames.js` — builds PNG textures for the eight gold frames
- `src/wish-layer.js` — HUD greeting sync; demotes photo-upload chrome
- Press **G** to cycle wish frames without the camera (same as pinch)

Gesture camera fixes from christmas-tree PR #2 are included here only (MediaPipe base URL + offscreen preview).

## Source

Adapted from [cchantelhu/christmas-tree](https://github.com/cchantelhu/christmas-tree) / upstream [nobody-r/christmas-tree](https://github.com/nobody-r/christmas-tree). Birthday retheme, cake silhouette, and audio are unique to this repository.
