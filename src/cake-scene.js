import * as THREE from 'three';
import { OrbitControls } from '../vendor/controls/OrbitControls.js';

const PLUM = 0x160e1a;

function stripeCandleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const g = c.getContext('2d');
  const stripes = 8;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 === 0 ? '#f2d28a' : '#f7f1e4';
    g.fillRect(0, (i / stripes) * c.height, c.width, c.height / stripes + 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSparkles(count) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.2 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const y = -0.4 + Math.random() * 4.2;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(theta) * r;
    phase[i] = Math.random() * Math.PI * 2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  const mat = new THREE.PointsMaterial({
    color: 0xffd7a8,
    size: 0.035,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

export function createCakeScene(canvas, { lite = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lite,
    alpha: false,
    powerPreference: lite ? 'low-power' : 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !lite;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PLUM);
  scene.fog = new THREE.FogExp2(PLUM, 0.045);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    60,
  );

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.enabled = false;

  function framingForViewport({ resetPosition = true } = {}) {
    const portrait = window.innerHeight > window.innerWidth;
    const narrow = window.innerWidth < 700;
    if (portrait || narrow) {
      camera.fov = 50;
      controls.minDistance = 3.4;
      controls.maxDistance = 8.5;
      if (resetPosition) {
        camera.position.set(0.1, 2.7, 5.8);
        controls.target.set(0.1, 0.35, 0.15);
      }
    } else {
      camera.fov = 40;
      controls.minDistance = 2.6;
      controls.maxDistance = 7.5;
      if (resetPosition) {
        camera.position.set(0.25, 2.35, 4.6);
        controls.target.set(0, 0.45, 0.15);
      }
    }
    camera.updateProjectionMatrix();
    controls.update();
  }
  framingForViewport();

  const hemi = new THREE.HemisphereLight(0xffe3c8, 0x1a0c18, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffd8b0, 1.15);
  key.position.set(3.2, 5.5, 2.4);
  key.castShadow = !lite;
  if (!lite) {
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 16;
  }
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb07090, 0.35);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const root = new THREE.Group();
  root.position.y = -0.15;
  scene.add(root);

  // Plate
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.35, 1.4, 0.08, 64),
    new THREE.MeshStandardMaterial({
      color: 0xf4ebe0,
      roughness: 0.35,
      metalness: 0.08,
    }),
  );
  plate.position.y = 0.04;
  plate.receiveShadow = true;
  root.add(plate);

  const plateRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.32, 0.035, 12, 64),
    new THREE.MeshStandardMaterial({ color: 0xe8ddd0, roughness: 0.4 }),
  );
  plateRim.rotation.x = Math.PI / 2;
  plateRim.position.y = 0.08;
  root.add(plateRim);

  // Low round cake
  const cakeGroup = new THREE.Group();
  cakeGroup.position.y = 0.08;
  root.add(cakeGroup);

  const sponge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.0, 0.55, 48),
    new THREE.MeshStandardMaterial({
      color: 0xd4a07a,
      roughness: 0.85,
    }),
  );
  sponge.position.y = 0.28;
  sponge.castShadow = true;
  sponge.receiveShadow = true;
  cakeGroup.add(sponge);

  const frosting = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 0.96, 0.12, 48),
    new THREE.MeshStandardMaterial({
      color: 0xfff4ea,
      roughness: 0.55,
    }),
  );
  frosting.position.y = 0.58;
  frosting.castShadow = true;
  cakeGroup.add(frosting);

  // Piped frosting peaks
  const pipeMat = new THREE.MeshStandardMaterial({
    color: 0xfff8f1,
    roughness: 0.45,
  });
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const peak = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), pipeMat);
    peak.position.set(Math.cos(a) * 0.92, 0.62, Math.sin(a) * 0.92);
    peak.scale.set(1, 1.35, 1);
    cakeGroup.add(peak);
  }
  // center swirl
  const swirl = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.045, 10, 28),
    pipeMat,
  );
  swirl.rotation.x = Math.PI / 2;
  swirl.position.y = 0.66;
  cakeGroup.add(swirl);

  // Striped candle
  const candleGroup = new THREE.Group();
  candleGroup.position.set(0, 0.66, 0);
  cakeGroup.add(candleGroup);

  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.05, 0.55, 20),
    new THREE.MeshStandardMaterial({
      map: stripeCandleTexture(),
      roughness: 0.55,
    }),
  );
  candle.position.y = 0.28;
  candle.castShadow = true;
  candleGroup.add(candle);

  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a2218 }),
  );
  wick.position.y = 0.58;
  candleGroup.add(wick);

  // Flame
  const flameGroup = new THREE.Group();
  flameGroup.position.y = 0.64;
  flameGroup.visible = false;
  candleGroup.add(flameGroup);

  const flameCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff2c4 }),
  );
  flameCore.scale.set(0.7, 1.3, 0.7);
  flameGroup.add(flameCore);

  const flameOuter = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    new THREE.MeshBasicMaterial({
      color: 0xff8a3a,
      transparent: true,
      opacity: 0.75,
    }),
  );
  flameOuter.scale.set(0.75, 1.55, 0.75);
  flameGroup.add(flameOuter);

  const flameLight = new THREE.PointLight(0xffa45a, 0, 5, 2);
  flameLight.position.y = 0.1;
  flameGroup.add(flameLight);

  // Smoke particles (after blow)
  const smokeCount = lite ? 24 : 48;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePos = new Float32Array(smokeCount * 3);
  const smokeVel = [];
  for (let i = 0; i < smokeCount; i++) {
    smokePos[i * 3] = 0;
    smokePos[i * 3 + 1] = 0;
    smokePos[i * 3 + 2] = 0;
    smokeVel.push({
      x: (Math.random() - 0.5) * 0.15,
      y: 0.2 + Math.random() * 0.35,
      z: (Math.random() - 0.5) * 0.15,
      life: 0,
    });
  }
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
  const smoke = new THREE.Points(
    smokeGeo,
    new THREE.PointsMaterial({
      color: 0xc8b8b0,
      size: 0.06,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  smoke.position.copy(flameGroup.position);
  smoke.visible = false;
  candleGroup.add(smoke);

  // Matchbook beside plate (inward for phone)
  const matchbook = new THREE.Group();
  matchbook.position.set(1.05, 0.12, 0.95);
  matchbook.rotation.y = -0.75;
  root.add(matchbook);

  const coverCanvas = document.createElement('canvas');
  coverCanvas.width = 256;
  coverCanvas.height = 160;
  const cg = coverCanvas.getContext('2d');
  cg.fillStyle = '#3a1c28';
  cg.fillRect(0, 0, 256, 160);
  cg.fillStyle = '#5a2a38';
  cg.fillRect(8, 8, 240, 144);
  cg.fillStyle = '#f6e7d4';
  cg.font = '600 28px serif';
  cg.textAlign = 'center';
  cg.fillText('Light the', 128, 70);
  cg.fillText('candle.', 128, 106);
  const coverTex = new THREE.CanvasTexture(coverCanvas);
  coverTex.colorSpace = THREE.SRGBColorSpace;

  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.08, 0.38),
    [
      new THREE.MeshStandardMaterial({ color: 0x4a2430 }),
      new THREE.MeshStandardMaterial({ color: 0x4a2430 }),
      new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0x2a1218 }),
      new THREE.MeshStandardMaterial({ color: 0x4a2430 }),
      new THREE.MeshStandardMaterial({ color: 0x4a2430 }),
    ],
  );
  book.castShadow = true;
  matchbook.add(book);

  // Larger invisible tap target (phones)
  const matchHit = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.45, 0.7),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  matchHit.position.y = 0.1;
  matchbook.add(matchHit);

  const matchStick = new THREE.Group();
  matchStick.visible = false;
  matchbook.add(matchStick);
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6),
    new THREE.MeshStandardMaterial({ color: 0xd8c09a }),
  );
  stick.rotation.z = Math.PI / 2;
  matchStick.add(stick);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xb84a2a, emissive: 0x000000 }),
  );
  tip.position.x = 0.22;
  matchStick.add(tip);
  const matchFlame = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff9a40 }),
  );
  matchFlame.position.x = 0.26;
  matchFlame.scale.set(0.7, 1.2, 0.7);
  matchFlame.visible = false;
  matchStick.add(matchFlame);

  // Folded note peeking from under the front of the plate
  const notePeek = new THREE.Group();
  notePeek.visible = false;
  notePeek.position.set(0, 0.1, 1.42);
  root.add(notePeek);

  const notePaperMat = new THREE.MeshStandardMaterial({
    color: 0xf7ebdc,
    roughness: 0.75,
  });
  const noteBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.025, 0.5),
    notePaperMat,
  );
  noteBase.castShadow = true;
  notePeek.add(noteBase);

  // Folded flap
  const noteFlap = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.02, 0.28),
    new THREE.MeshStandardMaterial({ color: 0xefe0cc, roughness: 0.7 }),
  );
  noteFlap.position.set(0, 0.03, 0.08);
  noteFlap.rotation.x = -0.55;
  notePeek.add(noteFlap);

  // Tiny label texture
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 96;
  const lg = labelCanvas.getContext('2d');
  lg.fillStyle = '#f7ebdc';
  lg.fillRect(0, 0, 256, 96);
  lg.fillStyle = '#5a3a44';
  lg.font = '600 28px serif';
  lg.textAlign = 'center';
  lg.fillText('Okay, my turn.', 128, 58);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  const noteLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.2),
    new THREE.MeshBasicMaterial({ map: labelTex }),
  );
  noteLabel.position.set(0, 0.05, 0.2);
  noteLabel.rotation.x = -0.35;
  notePeek.add(noteLabel);

  const noteHit = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.4, 0.9),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  noteHit.position.set(0, 0.14, 1.42);
  noteHit.visible = false;
  root.add(noteHit);

  const sparkles = makeSparkles(lite ? 80 : 180);
  scene.add(sparkles);

  // Intro: cake rises in
  root.scale.setScalar(0.01);
  root.rotation.y = -0.4;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let flameLit = false;
  let smoking = false;
  let smokeAge = 0;
  let matchAnim = null;
  let introT = 0;
  let introDone = false;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    framingForViewport({ resetPosition: false });
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', resize);

  function setPointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    pointer.x = (x / rect.width) * 2 - 1;
    pointer.y = -(y / rect.height) * 2 + 1;
  }

  function hitObjects(list) {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(list, true);
  }

  function lightCandle() {
    flameLit = true;
    flameGroup.visible = true;
    flameLight.intensity = 1.6;
  }

  function extinguishCandle() {
    if (!flameLit) return false;
    flameLit = false;
    flameGroup.visible = false;
    flameLight.intensity = 0;
    smoking = true;
    smokeAge = 0;
    smoke.visible = true;
    smoke.material.opacity = 0.7;
    const attr = smoke.geometry.attributes.position;
    for (let i = 0; i < smokeCount; i++) {
      attr.setXYZ(i, (Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.05);
      smokeVel[i].x = (Math.random() - 0.5) * 0.12;
      smokeVel[i].y = 0.15 + Math.random() * 0.4;
      smokeVel[i].z = (Math.random() - 0.5) * 0.12;
      smokeVel[i].life = 0.6 + Math.random() * 0.8;
    }
    attr.needsUpdate = true;
    return true;
  }

  function strikeMatch(onLit) {
    if (matchAnim) return;
    matchStick.visible = true;
    matchStick.position.set(0, 0.12, 0.1);
    matchFlame.visible = false;
    tip.material.emissive.setHex(0x000000);
    const start = performance.now();
    matchAnim = {
      start,
      onLit,
      phase: 'strike',
    };
  }

  function revealNotePeek() {
    notePeek.visible = true;
    noteHit.visible = true;
    notePeek.scale.setScalar(0.01);
    notePeek.userData.revealT = 0;
  }

  function update(dt, t) {
    controls.update();

    if (!introDone) {
      introT = Math.min(1, introT + dt * 0.55);
      const e = 1 - Math.pow(1 - introT, 3);
      root.scale.setScalar(0.01 + e * 0.99);
      root.rotation.y = -0.4 + e * 0.4;
      root.position.y = -0.15 + (1 - e) * 0.4;
      if (introT >= 1) {
        introDone = true;
        root.scale.setScalar(1);
        root.rotation.y = 0;
        root.position.y = -0.15;
      }
    }

    // sparkle twinkle
    const phases = sparkles.geometry.attributes.aPhase;
    const mat = sparkles.material;
    mat.opacity = 0.55 + 0.35 * Math.sin(t * 1.2);
    sparkles.rotation.y = t * 0.03;
    for (let i = 0; i < phases.count; i++) {
      // keep attribute alive for GPU drivers that read it
      phases.array[i] = phases.array[i];
    }

    if (flameLit) {
      const flicker = 0.85 + Math.sin(t * 22) * 0.08 + Math.sin(t * 37) * 0.06;
      flameGroup.scale.setScalar(flicker);
      flameLight.intensity = 1.3 + Math.sin(t * 18) * 0.35;
      flameOuter.material.opacity = 0.65 + Math.sin(t * 14) * 0.12;
    }

    if (matchAnim) {
      const elapsed = (performance.now() - matchAnim.start) / 1000;
      if (matchAnim.phase === 'strike') {
        const p = Math.min(1, elapsed / 0.55);
        matchStick.position.set(
          -0.2 + p * 1.4,
          0.15 + Math.sin(p * Math.PI) * 0.35,
          0.1 - p * 0.4,
        );
        matchStick.rotation.z = -0.4 + p * 0.8;
        if (p >= 0.55) {
          matchFlame.visible = true;
          tip.material.emissive.setHex(0xff6020);
        }
        if (p >= 1) {
          matchAnim.phase = 'carry';
          matchAnim.start = performance.now();
        }
      } else if (matchAnim.phase === 'carry') {
        const p = Math.min(1, elapsed / 0.7);
        // move toward candle tip in local cake space approx
        const from = new THREE.Vector3(-0.2 + 1.4, 0.15, 0.1 - 0.4);
        // candle world-ish relative to matchbook parent: rough path into cake
        matchStick.position.lerpVectors(
          from,
          new THREE.Vector3(-1.05, 1.2, -0.95),
          p,
        );
        if (p >= 1) {
          lightCandle();
          matchAnim.onLit?.();
          matchAnim.phase = 'done';
          matchAnim.start = performance.now();
        }
      } else if (matchAnim.phase === 'done') {
        if (elapsed > 0.25) {
          matchStick.visible = false;
          matchFlame.visible = false;
          matchAnim = null;
        }
      }
    }

    if (notePeek.visible && notePeek.userData.revealT != null) {
      notePeek.userData.revealT = Math.min(1, notePeek.userData.revealT + dt * 2.2);
      const e = 1 - Math.pow(1 - notePeek.userData.revealT, 3);
      notePeek.scale.setScalar(0.01 + e * 0.99);
      notePeek.position.y = 0.06 + Math.sin(e * Math.PI) * 0.12;
      if (notePeek.userData.revealT >= 1) {
        notePeek.userData.revealT = null;
        notePeek.position.y = 0.06;
      }
    } else if (notePeek.visible) {
      notePeek.position.y = 0.06 + Math.sin(t * 2.2) * 0.015;
    }

    if (smoking) {
      smokeAge += dt;
      const attr = smoke.geometry.attributes.position;
      let alive = 0;
      for (let i = 0; i < smokeCount; i++) {
        const v = smokeVel[i];
        if (v.life <= 0) continue;
        v.life -= dt;
        attr.array[i * 3] += v.x * dt;
        attr.array[i * 3 + 1] += v.y * dt;
        attr.array[i * 3 + 2] += v.z * dt;
        v.x *= 0.98;
        alive++;
      }
      attr.needsUpdate = true;
      smoke.material.opacity = Math.max(0, 0.7 - smokeAge * 0.45);
      if (smokeAge > 1.8 || alive === 0) {
        smoking = false;
        smoke.visible = false;
        smoke.material.opacity = 0;
      }
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function pickMatchbook(e) {
    setPointerFromEvent(e);
    return hitObjects([matchbook]).length > 0;
  }

  function pickFlame(e) {
    if (!flameLit) return false;
    setPointerFromEvent(e);
    return hitObjects([flameGroup, candle]).length > 0;
  }

  function pickNotePeek(e) {
    if (!notePeek.visible) return false;
    setPointerFromEvent(e);
    return hitObjects([notePeek, noteHit]).length > 0;
  }

  return {
    camera,
    controls,
    root,
    matchbook,
    notePeek,
    flameGroup,
    resize,
    update,
    render,
    strikeMatch,
    lightCandle,
    extinguishCandle,
    revealNotePeek,
    pickMatchbook,
    pickFlame,
    pickNotePeek,
    isFlameLit: () => flameLit,
    isSmoking: () => smoking,
    isIntroDone: () => introDone,
    enableOrbit(on = true) {
      controls.enabled = on;
    },
  };
}
