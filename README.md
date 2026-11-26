# Radiant Birthday Cake · Happy Birthday

A browser-based 3D interactive birthday cake page with gesture control, photo slideshow, music, and celebration particles. Sibling of [christmas-tree](https://github.com/cchantelhu/christmas-tree) (that repo is unchanged).

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
   - Open palm: birthday cake particles light up.
   - Closed fist: particles return to the cake shape and stay clustered.
   - Pinch thumb and index finger, then release: switch to the next photo; after the last photo, it loops to the first.
5. Drag with the mouse or use touch to adjust the view.
6. Modes: **Birthday Cake** (layered particle cake) or **Confetti Drift**.

## v1 feature choice (gallery)

Kept and reframed the existing photo gallery as **Cake Photos** (pinch still cycles; open palm still lights the scene). Candle mic blow-out and guest-book wishes are strong birthday ideas but deferred so gestures + photos stay intact. See the project ideas memo for alternatives.

## Visual notes

- Particle silhouette is reshaped into **stepped cake layers** with a candle-like top ring (3D scene + intro canvas).
- Colors, HUD, and prop labels are birthday-themed (gifts & balloons).
- Remaining gap: this is still a particle cake (not a full frosted mesh with individual flame geometry). A true candle blow-out mode would need source-level work later.

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

- `index.html` — page entry
- `assets/` — built JavaScript and CSS
- `mediapipe/` — gesture recognition runtime
- `audio/` — birthday music (CC0)

No React/TypeScript source is included; interaction logic lives in the built JavaScript. Gesture camera fixes from christmas-tree PR #2 are included here only (MediaPipe base URL + offscreen preview).

## Source

Adapted from [cchantelhu/christmas-tree](https://github.com/cchantelhu/christmas-tree) / upstream [nobody-r/christmas-tree](https://github.com/nobody-r/christmas-tree). Birthday retheme, cake silhouette, and audio are unique to this repository.
