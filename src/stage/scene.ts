import * as THREE from "three";

/**
 * The 3D stage: Rachel's portrait assembling from pixels, a retractable
 * lanyard from her collar, an ID badge pulled toward the camera that flips
 * and opens into the site index, then a camera walk past four abstract
 * data sculptures for the selected work.
 *
 * Plain three.js, loaded lazily by Stage.tsx only on capable devices.
 * All real content lives in the DOM; this file only moves DOM overlays.
 */

export type StageEls = {
  canvas: HTMLCanvasElement;
  heroCopy: HTMLElement;
  index: HTMLElement;
  skip: HTMLButtonElement;
  hint: HTMLElement;
  cards: HTMLElement[];
  veil: HTMLElement;
  choose: HTMLElement;
};

export type StageOpts = {
  portraitSrc: string;
  badgeSrc: string;
  introSeen: boolean;
  name: string;
  role: string;
  employer: string;
  location: string;
  orcid: string;
  domain: string;
  degree: string;
  research: string;
  doorLabels: string[];
  onIntroDone: () => void;
  onEnterDoor: (i: number) => void;
  // Called when the scene cannot draw; the page switches to the flat badge.
  onFail: () => void;
};

const C = {
  ivory: "#F2EBDD",
  paper: "#FAF6EE",
  band: "#E7DCC8",
  ink: "#1E0B12",
  ink2: "#3A2A2C",
  muted: "#5E5048",
  line: "#D8CCB6",
  line2: "#B8A88E",
  accent: "#2C4A6B",
  sky: "#CFDCE8",
  cherry: "#4A1024",
  wall: "#E4D8C3",
  brass: "#C8B48A",
};

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const bump = (v: number, c: number, w: number, f: number) => sstep(c - w - f, c - w, v) * (1 - sstep(c + w, c + w + f, v));
const easeOutBack = (t: number) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Projective transform from the unit square to a screen quad, as a CSS
// matrix3d (column-major). Lets real DOM links sit exactly on the badge.
function squareToQuad(p: number[]): number[] {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = p;
  const dx1 = x1 - x2,
    dy1 = y1 - y2,
    dx2 = x3 - x2,
    dy2 = y3 - y2,
    sx = x0 - x1 + x2 - x3,
    sy = y0 - y1 + y2 - y3;
  let g = 0,
    h = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (sx * dy2 - dx2 * sy) / den;
    h = (dx1 * sy - sx * dy1) / den;
  }
  const a = x1 - x0 + g * x1,
    b = x3 - x0 + h * x3,
    c = x0,
    d = y1 - y0 + g * y1,
    e = y3 - y0 + h * y3,
    f = y0;
  return [a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1];
}

function rr(x: CanvasRenderingContext2D, X: number, Y: number, W: number, H: number, r: number) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + W, Y, X + W, Y + H, r);
  x.arcTo(X + W, Y + H, X, Y + H, r);
  x.arcTo(X, Y + H, X, Y, r);
  x.arcTo(X, Y, X + W, Y, r);
  x.closePath();
}

export function createStage(els: StageEls, o: StageOpts): () => void {
  const { canvas } = els;
  const root = document.documentElement;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.debug.onShaderError = () => {
    throw new Error("Shader failed to compile");
  };

  const scene = new THREE.Scene();
  const IVORY = new THREE.Color(C.ivory);
  scene.background = IVORY;
  scene.fog = new THREE.Fog(IVORY, 16, 44);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 140);

  scene.add(new THREE.HemisphereLight(0xfffaf2, 0xe3d6bf, 1.15));
  const key = new THREE.DirectionalLight(0xfff6ea, 1.5);
  key.position.set(4, 7, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfe8f2, 0.6);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  const std = (c: THREE.ColorRepresentation, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0, ...extra });

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => {
    disposables.push(x);
    return x;
  };

  // ------------------------------------------------------------------
  // Floor: a dot matrix receding into the fog, plus two hairline rails.
  // ------------------------------------------------------------------
  const FLOOR_Y = -3.3;
  {
    const pts: number[] = [];
    for (let z = 12; z > -70; z -= 0.42) for (let x = -22; x <= 22; x += 0.42) pts.push(x, FLOOR_Y, z);
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const m = track(new THREE.PointsMaterial({ color: C.line2, size: 0.032, sizeAttenuation: true }));
    scene.add(new THREE.Points(g, m));
    const rails: number[] = [];
    for (const x of [-6.5, 6.5]) rails.push(x, FLOOR_Y + 0.001, 12, x, FLOOR_Y + 0.001, -70);
    for (let z = 0; z > -70; z -= 8) rails.push(-6.5, FLOOR_Y, z, 6.5, FLOOR_Y, z);
    const lg = track(new THREE.BufferGeometry());
    lg.setAttribute("position", new THREE.Float32BufferAttribute(rails, 3));
    scene.add(new THREE.LineSegments(lg, track(new THREE.LineBasicMaterial({ color: C.line }))));
  }

  // Soft blob shadow texture, reused under the badge and sculptures.
  const shadowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d")!;
    const g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, "rgba(30,11,18,0.34)");
    g.addColorStop(1, "rgba(30,11,18,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    return track(new THREE.CanvasTexture(c));
  })();
  const blob = (w: number, d: number) => {
    const m = new THREE.Mesh(
      track(new THREE.PlaneGeometry(w, d)),
      track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.y = FLOOR_Y + 0.01;
    scene.add(m);
    return m;
  };

  // ------------------------------------------------------------------
  // Portrait: assembles from random pixels, then resolves to the photo.
  // ------------------------------------------------------------------
  const PH = 6.3;
  let PW = PH * 0.497;
  const portraitUniforms = {
    uMap: { value: null as THREE.Texture | null },
    uProgress: { value: 0 },
    uCells: { value: new THREE.Vector2(44, 88) },
    uOpacity: { value: 1 },
  };
  const portraitMat = track(
    new THREE.ShaderMaterial({
      uniforms: portraitUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap; uniform float uProgress; uniform vec2 uCells; uniform float uOpacity;
        varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        void main(){
          vec2 cell = floor(vUv * uCells);
          vec2 center = (cell + 0.5) / uCells;
          float r = hash(cell);
          float appear = smoothstep(r * 0.62, r * 0.62 + 0.06, uProgress);
          float sharp = smoothstep(0.66, 0.98, uProgress);
          vec4 coarse = texture2D(uMap, center);
          vec4 fine = texture2D(uMap, vUv);
          vec4 col = mix(coarse, fine, sharp);
          // a tiny gap between cells while they are still pixels
          vec2 f = fract(vUv * uCells);
          float gap = (1.0 - sharp) * (step(f.x, 0.06) + step(f.y, 0.06));
          float a = col.a * appear * (1.0 - clamp(gap, 0.0, 1.0)) * uOpacity;
          // pixels pop in slightly brighter, then settle
          vec3 rgb = col.rgb + appear * (1.0 - sharp) * 0.04;
          if (a < 0.01) discard;
          gl_FragColor = vec4(rgb, a);
          #include <colorspace_fragment>
        }
      `,
    }),
  );
  const portrait = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), portraitMat);
  portrait.renderOrder = 1;
  scene.add(portrait);

  // A soft, blurred silhouette behind her for depth.
  const shadowPortraitMat = track(
    new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0, color: 0xffffff }),
  );
  const portraitShadow = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), shadowPortraitMat);
  scene.add(portraitShadow);

  const portraitImg = new Image();
  portraitImg.decoding = "async";
  portraitImg.src = o.portraitSrc;
  let portraitReady = false;
  portraitImg.onload = () => {
    PW = PH * (portraitImg.naturalWidth / portraitImg.naturalHeight);
    const tex = track(new THREE.Texture(portraitImg));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    portraitUniforms.uMap.value = tex;
    portraitUniforms.uCells.value.set(44, Math.round(44 * (PH / PW)));
    // blurred silhouette
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = Math.round(256 * (PH / PW));
    const x = c.getContext("2d")!;
    x.filter = "blur(10px) brightness(0)";
    x.drawImage(portraitImg, 12, 12, c.width - 24, c.height - 24);
    const st = track(new THREE.CanvasTexture(c));
    shadowPortraitMat.map = st;
    shadowPortraitMat.needsUpdate = true;
    portraitReady = true;
    layout();
  };

  // ------------------------------------------------------------------
  // Badge textures
  // ------------------------------------------------------------------
  const TW = 1024,
    TH = 1472;
  const mkCanvas = () => {
    const c = document.createElement("canvas");
    c.width = TW;
    c.height = TH;
    return c;
  };
  const coverC = mkCanvas(),
    insideLC = mkCanvas(),
    insideRC = mkCanvas(),
    backC = mkCanvas();
  const badgeImg = new Image();
  badgeImg.src = o.badgeSrc;
  let badgeReady = false;

  const serif = '"Instrument Serif", Georgia, serif';
  const sans = "Manrope, system-ui, sans-serif";
  const mono = '"IBM Plex Mono", ui-monospace, monospace';

  function paper(x: CanvasRenderingContext2D, color = C.paper) {
    x.clearRect(0, 0, TW, TH);
    rr(x, 0, 0, TW, TH, 64);
    x.fillStyle = color;
    x.fill();
  }
  function slot(x: CanvasRenderingContext2D, color: string) {
    rr(x, TW / 2 - 92, 46, 184, 30, 15);
    x.fillStyle = color;
    x.fill();
  }
  function photo(x: CanvasRenderingContext2D, X: number, Y: number, W: number, H: number, r: number) {
    x.save();
    rr(x, X, Y, W, H, r);
    x.clip();
    if (badgeReady) {
      const s = Math.max(W / badgeImg.naturalWidth, H / badgeImg.naturalHeight);
      const dw = badgeImg.naturalWidth * s,
        dh = badgeImg.naturalHeight * s;
      x.drawImage(badgeImg, X + (W - dw) / 2, Y + (H - dh) / 2, dw, dh);
    } else {
      x.fillStyle = C.band;
      x.fillRect(X, Y, W, H);
    }
    x.restore();
  }
  function dots(x: CanvasRenderingContext2D, X: number, Y: number, cols: number, rows: number, gap: number, on: string, off: string) {
    let s = 7;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        s = (s * 9301 + 49297) % 233280;
        x.fillStyle = s / 233280 > 0.68 ? on : off;
        x.beginPath();
        x.arc(X + i * gap, Y + j * gap, 5, 0, Math.PI * 2);
        x.fill();
      }
  }
  function label(x: CanvasRenderingContext2D, t: string, X: number, Y: number, color = C.muted, size = 30, align: CanvasTextAlign = "left") {
    x.font = `500 ${size}px ${mono}`;
    x.fillStyle = color;
    x.textAlign = align;
    x.fillText(t.toUpperCase(), X, Y);
  }

  function drawCover() {
    const x = coverC.getContext("2d")!;
    paper(x);
    slot(x, C.line);
    photo(x, 64, 120, TW - 128, 640, 36);
    x.textAlign = "left";
    x.fillStyle = C.ink;
    x.font = `132px ${serif}`;
    x.fillText(o.name, 58, 900);
    x.fillStyle = C.accent;
    x.font = `600 50px ${sans}`;
    x.fillText(o.role, 64, 980);
    x.fillStyle = C.muted;
    x.font = `500 38px ${sans}`;
    x.fillText(o.employer, 64, 1040);
    x.fillStyle = C.line;
    x.fillRect(64, 1092, TW - 128, 3);
    dots(x, 72, 1170, 18, 4, 30, C.ink, C.line);
    label(x, o.domain, TW - 64, 1396, C.ink, 32, "right");
    label(x, o.location, 64, 1396, C.muted, 30);
  }
  function drawInsideLeft() {
    const x = insideLC.getContext("2d")!;
    paper(x);
    slot(x, C.line);
    label(x, "Credential", 64, 150, C.accent, 30);
    label(x, "rachelcooray.com", TW - 64, 150, C.muted, 30, "right");
    photo(x, 64, 190, 360, 420, 28);
    x.textAlign = "left";
    x.fillStyle = C.ink;
    x.font = `96px ${serif}`;
    x.fillText(o.name.split(" ")[0], 460, 330);
    x.fillText(o.name.split(" ")[1] ?? "", 460, 420);
    x.fillStyle = C.accent;
    x.font = `600 38px ${sans}`;
    x.fillText(o.role, 462, 500);
    x.fillStyle = C.muted;
    x.font = `500 30px ${sans}`;
    x.fillText("OCTAVE", 462, 556);
    x.fillText("John Keells Holdings", 462, 596);
    const rows: [string, string][] = [
      ["Based", o.location],
      ["Degree", o.degree],
      ["Research", o.research],
      ["ORCID", o.orcid],
    ];
    rows.forEach(([k, v], i) => {
      const y = 730 + i * 124;
      x.fillStyle = C.line;
      x.fillRect(64, y - 54, TW - 128, 2);
      label(x, k, 64, y + 4, C.muted, 28);
      x.fillStyle = C.ink;
      x.font = k === "ORCID" ? `500 34px ${mono}` : `500 36px ${sans}`;
      x.textAlign = "right";
      x.fillText(v, TW - 64, y + 4);
    });
    // a quiet hairline chart, decorative
    x.strokeStyle = C.line2;
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(64, 1330);
    x.lineTo(TW - 64, 1330);
    x.stroke();
    x.strokeStyle = C.ink;
    x.lineWidth = 3;
    x.beginPath();
    const pts = [0.82, 0.8, 0.76, 0.78, 0.66, 0.6, 0.52, 0.5, 0.38, 0.3];
    pts.forEach((p, i) => {
      const X = 64 + (i / (pts.length - 1)) * (TW - 128);
      const Y = 1180 + p * 150;
      if (i) x.lineTo(X, Y);
      else x.moveTo(X, Y);
    });
    x.stroke();
  }
  function drawInsideRight() {
    const x = insideRC.getContext("2d")!;
    paper(x);
    slot(x, C.line);
    label(x, "Index", 64, 150, C.accent, 30);
    label(x, "Open any section", TW - 64, 150, C.muted, 26, "right");
    x.fillStyle = C.line;
    x.fillRect(64, 176, TW - 128, 3);
    label(x, "Drag to pull  .  Tap to flip  .  Press / to ask", TW / 2, TH - 64, C.muted, 24, "center");
  }
  function drawBack() {
    const x = backC.getContext("2d")!;
    paper(x, C.cherry);
    slot(x, "#36091A");
    dots(x, 92, 230, 15, 20, 56, C.sky, "#6A3044");
    x.fillStyle = C.ivory;
    x.textAlign = "left";
    x.font = `italic 120px ${serif}`;
    x.fillText("Tap to flip", 72, 1290);
    x.fillText("back.", 72, 1400);
    label(x, o.domain, TW - 64, 150, C.sky, 28, "right");
  }
  const texFrom = (c: HTMLCanvasElement) => {
    const t = track(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const coverT = texFrom(coverC),
    insideLT = texFrom(insideLC),
    insideRT = texFrom(insideRC),
    backT = texFrom(backC);
  const redraw = () => {
    drawCover();
    drawInsideLeft();
    drawInsideRight();
    drawBack();
    coverT.needsUpdate = insideLT.needsUpdate = insideRT.needsUpdate = backT.needsUpdate = true;
  };
  redraw();
  badgeImg.onload = () => {
    badgeReady = true;
    redraw();
  };
  if (document.fonts?.load) {
    Promise.all([
      document.fonts.load(`132px ${serif}`),
      document.fonts.load(`italic 120px ${serif}`),
      document.fonts.load(`600 50px ${sans}`),
      document.fonts.load(`500 30px ${mono}`),
    ])
      .then(redraw)
      .catch(() => {});
  }

  // ------------------------------------------------------------------
  // Badge: two leaves on a hinge. Closed, the right leaf folds over the
  // left and shows the ID cover. Open, the inside shows the credential
  // page and the index.
  // ------------------------------------------------------------------
  const W = 1.6,
    H = 2.3,
    T = 0.018,
    GAP = 0.1;
  const face = (map: THREE.Texture) =>
    track(
      new THREE.MeshPhysicalMaterial({
        map,
        emissive: 0xffffff,
        emissiveMap: map,
        emissiveIntensity: 0.62,
        roughness: 0.48,
        clearcoat: 0.55,
        clearcoatRoughness: 0.28,
        transparent: false,
        alphaTest: 0.5,
      }),
    );
  const edge = track(std(C.band, { roughness: 0.6 }));
  const leafGeo = track(new THREE.BoxGeometry(W, H, T));
  const leafL = new THREE.Mesh(leafGeo, [edge, edge, edge, edge, face(insideLT), face(backT)]);
  const leafR = new THREE.Mesh(leafGeo, [edge, edge, edge, edge, face(insideRT), face(coverT)]);
  const badgeRoot = new THREE.Group();
  const swingG = new THREE.Group();
  const flipG = new THREE.Group();
  const content = new THREE.Group();
  const hinge = new THREE.Group();
  leafL.position.set(-W / 2, -H / 2, 0);
  leafR.position.set(W / 2, -H / 2, -0.024);
  hinge.add(leafR);
  content.add(leafL, hinge);
  content.position.y = -GAP;
  flipG.add(content);
  swingG.add(flipG);
  badgeRoot.add(swingG);
  scene.add(badgeRoot);
  // metal clip + short loop
  const clip = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.13, 0.05)), track(std("#A9AFB6", { metalness: 0.85, roughness: 0.3 })));
  clip.position.y = -0.02;
  swingG.add(clip);
  const badgeShadow = blob(3.6, 1.6);

  // ------------------------------------------------------------------
  // Lanyard: a verlet rope from her collar to the clip, drawn as a flat
  // ribbon that splits around her neck. Its length grows as the badge is
  // pulled toward the camera, like a badge reel paying out.
  // ------------------------------------------------------------------
  const N = 18;
  const pts: THREE.Vector3[] = [],
    prev: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) {
    pts.push(new THREE.Vector3());
    prev.push(new THREE.Vector3());
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const anchor = new THREE.Vector3();
  let seg = 0.1;
  let segShort = 0.08;
  let segLong = 0.3;
  function ribbon(color: string) {
    const S = 60,
      pos = new Float32Array(S * 2 * 3),
      geo = track(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const idx: number[] = [];
    for (let i = 0; i < S - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    geo.setIndex(idx);
    const m = new THREE.Mesh(geo, track(std(color, { side: THREE.DoubleSide, roughness: 0.7 })));
    m.frustumCulled = false;
    scene.add(m);
    return { S, pos, geo };
  }
  const straps = [ribbon(C.accent), ribbon(C.cherry)];
  const _c = new THREE.Vector3(),
    _t = new THREE.Vector3(),
    _s = new THREE.Vector3(),
    Z = new THREE.Vector3(0, 0, 1);
  function updateStraps(spread: number) {
    straps.forEach((r, k) => {
      const sign = k ? 1 : -1;
      for (let i = 0; i < r.S; i++) {
        const t = i / (r.S - 1);
        curve.getPoint(t, _c);
        curve.getTangent(t, _t);
        _s.crossVectors(_t, Z).normalize().multiplyScalar(0.045);
        const fall = Math.pow(1 - Math.min(1, t * 3.2), 2);
        const ox = sign * spread * fall,
          oy = fall * 0.22,
          oz = sign * 0.006;
        r.pos[i * 6] = _c.x + ox + _s.x;
        r.pos[i * 6 + 1] = _c.y + oy + _s.y;
        r.pos[i * 6 + 2] = _c.z + oz;
        r.pos[i * 6 + 3] = _c.x + ox - _s.x;
        r.pos[i * 6 + 4] = _c.y + oy - _s.y;
        r.pos[i * 6 + 5] = _c.z + oz;
      }
      r.geo.attributes.position.needsUpdate = true;
      r.geo.computeVertexNormals();
    });
  }

  // ------------------------------------------------------------------
  // Selected work: four abstract data sculptures down the corridor.
  // ------------------------------------------------------------------
  type Sculpture = { g: THREE.Group; side: number; z: number; update: (a: number, t: number) => void };
  const inkM = track(std(C.ink, { roughness: 0.5 }));
  const accM = track(std(C.accent, { roughness: 0.45 }));
  const paperM = track(std(C.paper, { roughness: 0.65 }));
  const bandM = track(std(C.band, { roughness: 0.8 }));
  const skyM = track(std(C.sky, { roughness: 0.6 }));
  const lineM = track(new THREE.LineBasicMaterial({ color: C.line2 }));
  const accLineM = track(new THREE.LineBasicMaterial({ color: C.accent }));

  function networkSculpture(): { g: THREE.Group; update: Sculpture["update"] } {
    // Distributors on a disc, depots, and routes that draw in.
    const g = new THREE.Group();
    const base = new THREE.Mesh(track(new THREE.CylinderGeometry(1.9, 1.9, 0.05, 72)), bandM);
    g.add(base);
    const ring = new THREE.LineSegments(track(new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.92, 1.92, 0.05, 72), 30)), lineM);
    g.add(ring);
    const dotGeo = track(new THREE.SphereGeometry(0.035, 10, 8));
    const pos: THREE.Vector3[] = [];
    let s = 11;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 110; i++) {
      const r = 1.75 * Math.sqrt(rnd()),
        a = rnd() * Math.PI * 2;
      pos.push(new THREE.Vector3(Math.cos(a) * r, 0.06, Math.sin(a) * r));
    }
    const dots = new THREE.InstancedMesh(dotGeo, inkM, pos.length);
    const m4 = new THREE.Matrix4();
    pos.forEach((p, i) => dots.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)));
    g.add(dots);
    const depots = [new THREE.Vector3(-0.7, 0.12, -0.3), new THREE.Vector3(0.8, 0.12, 0.5), new THREE.Vector3(0.1, 0.12, 1.0)];
    depots.forEach((d) => {
      const c = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.16, 0.16)), accM);
      c.position.copy(d);
      g.add(c);
    });
    const routes: number[] = [];
    pos.forEach((p) => {
      let best = depots[0];
      for (const d of depots) if (d.distanceToSquared(p) < best.distanceToSquared(p)) best = d;
      routes.push(best.x, 0.07, best.z, p.x, 0.07, p.z);
    });
    const rg = track(new THREE.BufferGeometry());
    rg.setAttribute("position", new THREE.Float32BufferAttribute(routes, 3));
    const routeLines = new THREE.LineSegments(rg, accLineM);
    g.add(routeLines);
    // replenishment: thin vertical hairlines rising over some outlets
    const bars: number[] = [];
    pos.forEach((p, i) => {
      if (i % 4) return;
      bars.push(p.x, 0.07, p.z, p.x, 0.07 + 0.25 + (i % 7) * 0.06, p.z);
    });
    const bg = track(new THREE.BufferGeometry());
    bg.setAttribute("position", new THREE.Float32BufferAttribute(bars, 3));
    const barLines = new THREE.LineSegments(bg, track(new THREE.LineBasicMaterial({ color: C.ink })));
    g.add(barLines);
    g.rotation.x = 0.42;
    return {
      g,
      update: (a, t) => {
        rg.setDrawRange(0, Math.floor((routes.length / 3) * sstep(0.1, 0.9, a)));
        barLines.scale.y = 0.2 + 0.8 * sstep(0.3, 1, a);
        g.rotation.y = t * 0.12;
      },
    };
  }
  function boundarySculpture(): { g: THREE.Group; update: Sculpture["update"] } {
    // Two classes in 3D, a translucent decision plane tilting into place.
    const g = new THREE.Group();
    const frame = new THREE.LineSegments(track(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 2.6, 2.6))), lineM);
    g.add(frame);
    const dotGeo = track(new THREE.SphereGeometry(0.05, 12, 10));
    let s = 23;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const a: THREE.Vector3[] = [],
      b: THREE.Vector3[] = [];
    for (let i = 0; i < 70; i++) {
      const p = new THREE.Vector3(rnd() * 2.4 - 1.2, rnd() * 2.4 - 1.2, rnd() * 2.4 - 1.2);
      (p.x + p.y * 0.6 > 0.15 ? a : b).push(p);
    }
    const mA = new THREE.InstancedMesh(dotGeo, accM, a.length);
    const mB = new THREE.InstancedMesh(dotGeo, inkM, b.length);
    const m4 = new THREE.Matrix4();
    a.forEach((p, i) => mA.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)));
    b.forEach((p, i) => mB.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)));
    g.add(mA, mB);
    const plane = new THREE.Mesh(
      track(new THREE.PlaneGeometry(2.6, 2.9)),
      track(new THREE.MeshStandardMaterial({ color: C.sky, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false })),
    );
    const planeEdge = new THREE.LineSegments(track(new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.6, 2.9))), accLineM);
    plane.add(planeEdge);
    g.add(plane);
    return {
      g,
      update: (k: number, t: number) => {
        const target = Math.atan2(1, 0.6) - Math.PI / 2;
        plane.rotation.set(0, 0, -0.9 + (target + 0.9) * easeInOut(sstep(0.05, 0.85, k)));
        plane.rotation.y = Math.PI / 2;
        g.rotation.y = 0.5 + t * 0.15;
        g.rotation.x = 0.18;
      },
    };
  }
  function groundingSculpture(): { g: THREE.Group; update: Sculpture["update"] } {
    // Source documents fanned in space, threads from a query to the lines it cites.
    const g = new THREE.Group();
    const slabs: THREE.Group[] = [];
    const cites: THREE.Vector3[] = [];
    for (let k = 0; k < 6; k++) {
      const sg = new THREE.Group();
      sg.add(new THREE.Mesh(track(new THREE.BoxGeometry(1.8, 0.02, 1.25)), paperM));
      for (let l = 0; l < 6; l++) {
        const cited = (k === 1 && l === 2) || (k === 4 && l === 4) || (k === 2 && l === 0);
        const ln = new THREE.Mesh(track(new THREE.BoxGeometry(l === 5 ? 0.8 : 1.4, 0.012, 0.06)), cited ? accM : bandM);
        ln.position.set(l === 5 ? -0.3 : 0, 0.016, -0.45 + l * 0.18);
        sg.add(ln);
        if (cited) cites.push(ln.position.clone());
      }
      g.add(sg);
      slabs.push(sg);
    }
    const query = new THREE.Mesh(track(new THREE.SphereGeometry(0.14, 24, 16)), accM);
    g.add(query);
    const tg = track(new THREE.BufferGeometry());
    tg.setAttribute("position", new THREE.Float32BufferAttribute(new Array(cites.length * 6).fill(0), 3));
    const threads = new THREE.LineSegments(tg, accLineM);
    g.add(threads);
    const citedSlabs = [1, 2, 4].sort();
    return {
      g,
      update: (a: number, t: number) => {
        const gap = 0.16 + 0.32 * sstep(0, 0.7, a);
        slabs.forEach((s, k) => {
          s.position.y = (k - 2.5) * gap;
          s.rotation.y = Math.sin(t * 0.3 + k) * 0.04;
        });
        query.position.set(0, 3 * gap + 0.5, 0);
        const arr = tg.attributes.position.array as Float32Array;
        cites.forEach((c, i) => {
          const k = citedSlabs[i] ?? 0;
          arr[i * 6] = 0;
          arr[i * 6 + 1] = query.position.y;
          arr[i * 6 + 2] = 0;
          arr[i * 6 + 3] = c.x;
          arr[i * 6 + 4] = (k - 2.5) * gap + 0.03;
          arr[i * 6 + 5] = c.z;
        });
        tg.attributes.position.needsUpdate = true;
        threads.visible = a > 0.35;
        g.rotation.y = -0.5 + t * 0.12;
      },
    };
  }
  function blocksSculpture(): { g: THREE.Group; update: Sculpture["update"] } {
    // A baseplate and modular blocks assembling into a product.
    const g = new THREE.Group();
    const base = new THREE.Mesh(track(new THREE.BoxGeometry(2.4, 0.06, 2.4)), bandM);
    g.add(base);
    const grid = new THREE.GridHelper(2.4, 6, C.line2, C.line2);
    grid.position.y = 0.032;
    g.add(grid);
    const blocks: { m: THREE.Mesh; h: number; d: number }[] = [];
    const heights = [0.7, 0.32, 0.5, 0.18, 0.42, 1.0, 0.26, 0.58, 0.3, 0.66, 0.22, 0.46];
    let n = 0;
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 3; j++) {
        const h = heights[n];
        const mat = n === 5 ? accM : n === 0 || n === 10 ? inkM : n % 2 === 0 ? paperM : n % 3 === 0 ? skyM : bandM;
        const m = new THREE.Mesh(track(new THREE.BoxGeometry(0.36, 1, 0.5)), mat);
        m.position.set(-0.84 + i * 0.56, 0, -0.66 + j * 0.66);
        g.add(m);
        blocks.push({ m, h, d: n * 0.05 });
        n++;
      }
    g.rotation.x = 0.3;
    return {
      g,
      update: (a: number, t: number) => {
        blocks.forEach(({ m, h, d }) => {
          const k = easeOutBack(sstep(d, d + 0.5, a));
          const hh = Math.max(0.001, h * k);
          m.scale.y = hh;
          m.position.y = 0.03 + hh / 2;
        });
        g.rotation.y = 0.6 + t * 0.1;
      },
    };
  }
  // The painting hangs behind the hero; the hall of doors lies beyond it.
  const PAINT_Z = -5;
  const HALL_Z = -16;
  const DOOR_X = [-3.45, -1.15, 1.15, 3.45];
  const builders = [networkSculpture, boundarySculpture, groundingSculpture, blocksSculpture];
  const STOPS = [150, 230, 310, 390];

  // Each sculpture waits in the room behind its door.
  const sculptures: (Sculpture & { shadow: THREE.Mesh })[] = builders.map((b, i) => {
    const { g, update } = b();
    scene.add(g);
    const side = i % 2 === 0 ? -1 : 1;
    g.scale.setScalar(0.42);
    return { g, update, side, z: HALL_Z - 3.4, shadow: blob(2, 2) };
  });

  // ------------------------------------------------------------------
  // Rooms. Behind the hero hangs a framed opening, like a painting; the
  // camera walks into it. Each work room is closed by a wall with double
  // doors that swing open as the visitor arrives.
  // ------------------------------------------------------------------
  const wallM = track(std(C.wall, { roughness: 0.95, emissive: C.wall, emissiveIntensity: 0.4 }));
  const skirtM = track(std("#CDBFA5", { roughness: 0.9, emissive: "#CDBFA5", emissiveIntensity: 0.3 }));
  const cherryM = track(new THREE.MeshPhysicalMaterial({ color: C.cherry, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
  const brassM = track(std(C.brass, { metalness: 0.75, roughness: 0.32 }));

  const WALL_W = 44,
    WALL_H = 15,
    WALL_T = 0.3;
  function wallWithHole(hw: number, hBottom: number, hTop: number) {
    const sh = new THREE.Shape();
    sh.moveTo(-WALL_W / 2, FLOOR_Y);
    sh.lineTo(WALL_W / 2, FLOOR_Y);
    sh.lineTo(WALL_W / 2, FLOOR_Y + WALL_H);
    sh.lineTo(-WALL_W / 2, FLOOR_Y + WALL_H);
    sh.lineTo(-WALL_W / 2, FLOOR_Y);
    const hole = new THREE.Path();
    hole.moveTo(-hw, hBottom);
    hole.lineTo(-hw, hTop);
    hole.lineTo(hw, hTop);
    hole.lineTo(hw, hBottom);
    hole.lineTo(-hw, hBottom);
    sh.holes.push(hole);
    const geo = track(new THREE.ExtrudeGeometry(sh, { depth: WALL_T, bevelEnabled: false }));
    geo.translate(0, 0, -WALL_T);
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, wallM));
    // skirting and a thin cherry dado line on both faces, each side of the hole
    for (const zf of [0.02, -WALL_T - 0.02]) {
      for (const side of [-1, 1]) {
        const len = WALL_W / 2 - hw - 0.25;
        const cx = side * (hw + 0.25 + len / 2);
        const sk = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.2, 0.04)), skirtM);
        sk.position.set(cx, FLOOR_Y + 0.1, zf);
        const dado = new THREE.Mesh(track(new THREE.BoxGeometry(len, 0.03, 0.03)), cherryM);
        dado.position.set(cx, FLOOR_Y + 1.05, zf);
        g.add(sk, dado);
      }
    }
    return g;
  }
  const box = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), m);

  // The painting frame.
  const FRAME_W = 1.75,
    FRAME_B = -0.6,
    FRAME_T = 3.6;
  const paintingWall = wallWithHole(FRAME_W, FRAME_B, FRAME_T);
  {
    const fw = 0.34,
      fd = 0.26;
    const hgt = FRAME_T - FRAME_B;
    const parts: [number, number, number, number][] = [
      [-(FRAME_W + fw / 2), (FRAME_B + FRAME_T) / 2, fw, hgt + fw * 2],
      [FRAME_W + fw / 2, (FRAME_B + FRAME_T) / 2, fw, hgt + fw * 2],
      [0, FRAME_T + fw / 2, FRAME_W * 2 + fw * 2, fw],
      [0, FRAME_B - fw / 2, FRAME_W * 2 + fw * 2, fw],
    ];
    for (const [x, y, w, h] of parts) {
      const m = box(w, h, fd, cherryM);
      m.position.set(x, y, fd / 2 - 0.02);
      paintingWall.add(m);
    }
    // a thin brass lip just inside the frame
    const lip: [number, number, number, number][] = [
      [-FRAME_W - 0.02, (FRAME_B + FRAME_T) / 2, 0.04, hgt],
      [FRAME_W + 0.02, (FRAME_B + FRAME_T) / 2, 0.04, hgt],
      [0, FRAME_T + 0.02, FRAME_W * 2, 0.04],
      [0, FRAME_B - 0.02, FRAME_W * 2, 0.04],
    ];
    for (const [x, y, w, h] of lip) {
      const m = box(w, h, 0.05, brassM);
      m.position.set(x, y, fd - 0.01);
      paintingWall.add(m);
    }
  }
  // Varnish: a faint glaze over the opening that clears as you walk in.
  const glazeMat = track(
    new THREE.MeshBasicMaterial({ color: C.paper, transparent: true, opacity: 0.32, depthWrite: false }),
  );
  const glaze = new THREE.Mesh(track(new THREE.PlaneGeometry(FRAME_W * 2, FRAME_T - FRAME_B)), glazeMat);
  glaze.position.set(0, (FRAME_B + FRAME_T) / 2, 0.08);
  paintingWall.add(glaze);
  paintingWall.position.z = PAINT_Z;
  scene.add(paintingWall);

  // The hall: four tall arched doors in lacquered colours, each with a
  // brass nameplate, a lever handle and fine vertical grooves.
  const DOOR_W = 1.5,
    DOOR_RECT = 2.7;
  const DOOR_COLORS = [C.accent, C.cherry, "#A88B5E", "#1F2E45"];
  const frameM = track(new THREE.MeshPhysicalMaterial({ color: "#2A0A14", roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.25 }));
  const grooveM = track(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 }));
  const arch = (p: THREE.Path, x0: number, w: number, rectH: number, y0: number) => {
    p.moveTo(x0, y0);
    p.lineTo(x0 + w, y0);
    p.lineTo(x0 + w, y0 + rectH);
    p.absarc(x0 + w / 2, y0 + rectH, w / 2, 0, Math.PI, false);
    p.lineTo(x0, y0);
    return p;
  };
  const hall = new THREE.Group();
  {
    const sh = new THREE.Shape();
    sh.moveTo(-WALL_W / 2, FLOOR_Y);
    sh.lineTo(WALL_W / 2, FLOOR_Y);
    sh.lineTo(WALL_W / 2, FLOOR_Y + WALL_H);
    sh.lineTo(-WALL_W / 2, FLOOR_Y + WALL_H);
    sh.lineTo(-WALL_W / 2, FLOOR_Y);
    for (const x of DOOR_X) sh.holes.push(arch(new THREE.Path(), x - DOOR_W / 2 - 0.02, DOOR_W + 0.04, DOOR_RECT, FLOOR_Y));
    const geo = track(new THREE.ExtrudeGeometry(sh, { depth: WALL_T, bevelEnabled: false, curveSegments: 32 }));
    geo.translate(0, 0, -WALL_T);
    hall.add(new THREE.Mesh(geo, wallM));
    // skirting and dado, broken at every door
    const edges = [-WALL_W / 2, ...DOOR_X.flatMap((x) => [x - DOOR_W / 2 - 0.3, x + DOOR_W / 2 + 0.3]), WALL_W / 2];
    for (let k = 0; k < edges.length; k += 2) {
      const a = edges[k],
        b = edges[k + 1],
        len = b - a;
      for (const zf of [0.02, -WALL_T - 0.02]) {
        const sk = box(len, 0.2, 0.04, skirtM);
        sk.position.set(a + len / 2, FLOOR_Y + 0.1, zf);
        const dado = box(len, 0.03, 0.03, cherryM);
        dado.position.set(a + len / 2, FLOOR_Y + 1.05, zf);
        hall.add(sk, dado);
      }
    }
  }
  const plateTex = (text: string) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 140;
    const x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, 512, 140);
    g.addColorStop(0, "#E2C98F");
    g.addColorStop(0.5, "#C9A964");
    g.addColorStop(1, "#A8873F");
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 140);
    x.strokeStyle = "rgba(60,40,10,0.55)";
    x.lineWidth = 4;
    x.strokeRect(10, 10, 492, 120);
    x.fillStyle = "rgba(255,245,215,0.5)";
    x.font = '600 52px "IBM Plex Mono", ui-monospace, monospace';
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text.toUpperCase(), 257, 73);
    x.fillStyle = "#3A2608";
    x.fillText(text.toUpperCase(), 256, 71);
    const t = track(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  type Door = { pivot: THREE.Group; leaf: THREE.Mesh; x: number };
  const doors: Door[] = DOOR_X.map((dx, i) => {
    // architrave: an arched ring
    const ring = arch(new THREE.Shape(), dx - DOOR_W / 2 - 0.2, DOOR_W + 0.4, DOOR_RECT, FLOOR_Y) as THREE.Shape;
    ring.holes.push(arch(new THREE.Path(), dx - DOOR_W / 2 - 0.02, DOOR_W + 0.04, DOOR_RECT, FLOOR_Y));
    const rg = track(new THREE.ExtrudeGeometry(ring, { depth: 0.14, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 32 }));
    const frame = new THREE.Mesh(rg, frameM);
    frame.position.z = -0.04;
    hall.add(frame);

    const lacquer = track(
      new THREE.MeshPhysicalMaterial({ color: DOOR_COLORS[i], roughness: 0.36, clearcoat: 0.9, clearcoatRoughness: 0.16 }),
    );
    const lw = DOOR_W - 0.03;
    const leafShape = arch(new THREE.Shape(), 0, lw, DOOR_RECT, 0) as THREE.Shape;
    const lg = track(new THREE.ExtrudeGeometry(leafShape, { depth: 0.07, bevelEnabled: false, curveSegments: 32 }));
    lg.translate(0, 0, -0.035);
    const leaf = new THREE.Mesh(lg, lacquer);
    const pivot = new THREE.Group();
    pivot.position.set(dx - lw / 2, FLOOR_Y, -WALL_T / 2);
    pivot.add(leaf);
    for (const zf of [0.037, -0.037]) {
      for (let k = 1; k < 10; k++) {
        const gr = box(0.012, DOOR_RECT - 0.28, 0.004, grooveM);
        gr.position.set((lw * k) / 10, 0.14 + (DOOR_RECT - 0.28) / 2, zf);
        pivot.add(gr);
      }
      const side = zf > 0 ? 1 : -1;
      const backing = box(0.66, 0.2, 0.012, brassM);
      backing.position.set(lw / 2, DOOR_RECT * 0.86, zf + side * 0.006);
      pivot.add(backing);
      const plate = new THREE.Mesh(
        track(new THREE.PlaneGeometry(0.62, 0.17)),
        track(new THREE.MeshStandardMaterial({ map: plateTex(o.doorLabels[i] ?? ""), metalness: 0.55, roughness: 0.35 })),
      );
      plate.position.set(lw / 2, DOOR_RECT * 0.86, zf + side * 0.0135);
      if (side < 0) plate.rotation.y = Math.PI;
      pivot.add(plate);
      const rose = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 20)), brassM);
      rose.rotation.x = Math.PI / 2;
      rose.position.set(lw - 0.17, 1.3, zf + side * 0.01);
      const lever = box(0.24, 0.035, 0.035, brassM);
      lever.position.set(lw - 0.27, 1.3, zf + side * 0.045);
      pivot.add(rose, lever);
    }
    hall.add(pivot);
    // a warm light inside each room
    const lamp = new THREE.PointLight(0xffe2c4, 2.2, 7, 1.6);
    lamp.position.set(dx, FLOOR_Y + 2.2, -3);
    hall.add(lamp);
    return { pivot, leaf, x: dx };
  });
  hall.position.z = HALL_Z;
  scene.add(hall);
  const doorLeaves = doors.map((d) => d.leaf);

  // ------------------------------------------------------------------
  // Layout: everything is placed by screen fraction, so it holds up on
  // any aspect ratio the 3D mode runs on.
  // ------------------------------------------------------------------
  const CAM0 = new THREE.Vector3(0, 0.25, 10);
  const LOOK0 = new THREE.Vector3(0, 0.25, 0);
  const PZ = -2.4;
  const BZ = 1.6;
  const halfW = (z: number) => {
    const dist = CAM0.z - z;
    return Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist * camera.aspect;
  };
  const halfH = (z: number) => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (CAM0.z - z);

  const portraitBase = new THREE.Vector3();
  let badgeScale = 1;
  const rest = new THREE.Vector3();
  const collar = new THREE.Vector3();
  const chest = new THREE.Vector3();
  let indexW = 360,
    indexH = 420;

  type Key = [number, THREE.Vector3, THREE.Vector3];
  let keys: Key[] = [];

  function layout() {
    const w = window.innerWidth || 1,
      h = window.innerHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Pixel layout: text column on the left, the portrait just right of
    // it, the badge against the right gutter overlapping her slightly.
    const gutter = Math.max(16, w * 0.06);
    const textRight = gutter + Math.min(w * 0.26, 400);
    const pxToX = (px: number, z: number) => (px / w) * 2 * halfW(z) - halfW(z);

    const ph = Math.min(PH, halfH(PZ) * 2 * 0.9);
    const pw = ph * (PW / PH);
    portrait.scale.set(pw, ph, 1);
    portraitShadow.scale.set(pw * 1.04, ph * 1.02, 1);
    const pwPx = (pw / (halfW(PZ) * 2)) * w;
    const bottom = LOOK0.y - halfH(PZ) - 0.12;
    portraitBase.set(pxToX(textRight + 8 + pwPx / 2, PZ), bottom + ph / 2, PZ);
    // Collar point in the cutout image (fraction from top-left).
    collar.set(portraitBase.x + (0.488 - 0.5) * pw, portraitBase.y + (0.5 - 0.3) * ph, PZ + 0.06);
    chest.set(collar.x + 0.05, collar.y - ph * 0.17, PZ + 0.2);

    // Badge: open width up to 40% of the screen and whatever is left of
    // the right half, height up to 58%.
    const portraitCenterPx = textRight + 8 + pwPx / 2;
    const bwPx = Math.min(w * 0.4, w - gutter - portraitCenterPx + pwPx * 0.1);
    const maxW = (bwPx / w) * 2 * halfW(BZ);
    const maxH = halfH(BZ) * 2 * 0.58;
    badgeScale = Math.min(maxW / (2 * W), maxH / (H + GAP));
    badgeRoot.scale.setScalar(badgeScale);
    const realBwPx = ((2 * W * badgeScale) / (2 * halfW(BZ))) * w;
    rest.set(pxToX(w - gutter - realBwPx / 2, BZ), LOOK0.y + (H * badgeScale) / 2 + 0.05, BZ);

    const dist = rest.distanceTo(collar);
    segLong = (dist * 1.08) / (N - 1);
    segShort = (chest.distanceTo(collar) * 1.02) / (N - 1);

    // DOM index size: match the projected size of the leaf area at rest so
    // the text renders close to 1:1.
    const pxPerUnit = (h / (halfH(BZ) * 2)) * badgeScale;
    indexW = Math.round(W * 0.84 * pxPerUnit);
    indexH = Math.round(H * 0.74 * pxPerUnit);
    els.index.style.width = `${indexW}px`;
    els.index.style.height = `${indexH}px`;
    els.index.style.setProperty("--fs", `${clamp(Math.round((indexH / 13) * 0.5), 9, 15)}px`);

    // Sculptures
    sculptures.forEach((s, i) => {
      s.g.position.set(DOOR_X[i], FLOOR_Y + 1.5, s.z);
      s.shadow.position.set(DOOR_X[i], FLOOR_Y + 0.01, s.z);
    });

    // Camera path, keyed in viewport-height percent of scroll.
    const K: Key[] = [];
    K.push([0, CAM0.clone(), LOOK0.clone()]);
    K.push([26, new THREE.Vector3(0.2, 1.3, 7.2), new THREE.Vector3(0.1, 1.2, -5)]);
    K.push([62, new THREE.Vector3(0, 3.0, -0.6), new THREE.Vector3(0, 1.4, -12)]);
    K.push([100, new THREE.Vector3(0, 1.0, -4.6), new THREE.Vector3(0, -0.6, -16)]);
    const overviewCam = new THREE.Vector3(0, -0.1, HALL_Z + 11.2);
    const overviewLook = new THREE.Vector3(0, -1.3, HALL_Z);
    K.push([122, overviewCam.clone(), overviewLook.clone()]);
    STOPS.forEach((c, i) => {
      const side = i % 2 === 0 ? 1 : -1; // card on the right: stand right of the door
      const cam = new THREE.Vector3(DOOR_X[i] + side * 1.1, -0.45, HALL_Z + 5.7);
      const look = new THREE.Vector3(DOOR_X[i] + side * 0.35, -1.45, HALL_Z);
      K.push([c - 22, cam, look]);
      K.push([c + 22, cam.clone(), look.clone()]);
    });
    K.push([438, overviewCam.clone(), overviewLook.clone()]);
    K.push([900, overviewCam.clone(), overviewLook.clone()]);
    keys = K;
  }
  function camAt(v: number, pos: THREE.Vector3, look: THREE.Vector3) {
    let a = keys[0],
      b = keys[keys.length - 1];
    if (v <= a[0]) {
      pos.copy(a[1]);
      look.copy(a[2]);
      return;
    }
    for (let i = 0; i < keys.length - 1; i++)
      if (v <= keys[i + 1][0]) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    const t = easeInOut(clamp((v - a[0]) / (b[0] - a[0]), 0, 1));
    pos.lerpVectors(a[1], b[1], t);
    look.lerpVectors(a[2], b[2], t);
  }
  layout();

  // ------------------------------------------------------------------
  // Physics
  // ------------------------------------------------------------------
  const hold = new THREE.Vector3();
  const vel = new THREE.Vector3(),
    lastVel = new THREE.Vector3(),
    acc = new THREE.Vector3();
  let dragging = false;
  const dragTarget = new THREE.Vector3();
  function resetRope(to: THREE.Vector3) {
    for (let i = 0; i < N; i++) {
      pts[i].lerpVectors(collar, to, i / (N - 1));
      prev[i].copy(pts[i]);
    }
  }
  const GRAV = 9.8;
  const K_SPRING = 70;
  function step(dt: number) {
    const L = N - 1;
    for (let i = 1; i < N; i++) {
      const p = pts[i],
        q = prev[i];
      const damp = i === L ? 0.982 : 0.975;
      let vx = (p.x - q.x) * damp,
        vy = (p.y - q.y) * damp,
        vz = (p.z - q.z) * damp;
      const sp = Math.hypot(vx, vy, vz);
      if (sp > 0.6) {
        vx *= 0.6 / sp;
        vy *= 0.6 / sp;
        vz *= 0.6 / sp;
      }
      q.copy(p);
      let ax = 0,
        ay = -GRAV * (i === L ? 0.25 : 1),
        az = 0;
      if (i === L) {
        const tgt = dragging ? dragTarget : hold;
        const k = dragging ? K_SPRING * 3 : K_SPRING;
        ax += (tgt.x - p.x) * k;
        ay += (tgt.y - p.y) * k;
        az += (tgt.z - p.z) * k;
      }
      p.x += vx + ax * dt * dt;
      p.y += vy + ay * dt * dt;
      p.z += vz + az * dt * dt;
    }
    pts[0].copy(anchor);
    for (let it = 0; it < 22; it++) {
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i],
          b = pts[i + 1];
        _c.subVectors(b, a);
        const len = _c.length() || 1e-6;
        if (len <= seg) continue; // rope can go slack but not stretch
        const diff = (len - seg) / len;
        if (i === 0) b.addScaledVector(_c, -diff);
        else {
          a.addScaledVector(_c, diff * 0.5);
          b.addScaledVector(_c, -diff * 0.5);
        }
      }
    }
  }

  // Badge pendulum, driven by the clip's acceleration.
  let thZ = 0,
    wZ = 0,
    thX = 0,
    wX = 0;
  const PEND = 1.25;
  function pendulum(dt: number) {
    const g = GRAV;
    const aZ = -(g / PEND) * Math.sin(thZ) - (acc.x / PEND) * Math.cos(thZ) - wZ * 2.2;
    const aX = -(g / PEND) * Math.sin(thX) + (acc.z / PEND) * Math.cos(thX) - wX * 2.6;
    wZ += aZ * dt;
    wX += aX * dt;
    thZ = clamp(thZ + wZ * dt, -0.9, 0.9);
    thX = clamp(thX + wX * dt, -0.7, 0.7);
  }

  // ------------------------------------------------------------------
  // Pointer: drag the badge from anywhere on it, tap to flip.
  // ------------------------------------------------------------------
  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    hit = new THREE.Vector3(),
    grabOff = new THREE.Vector3();
  let downAt: { x: number; y: number; t: number; moved: boolean } | null = null;
  let mx = 0,
    my = 0;
  let interactive = false;
  const setNdc = (e: PointerEvent) => {
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const hitsBadge = () => {
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects([leafL, leafR], false).length > 0;
  };
  let hoverDoor = -1;
  type Entering = { i: number; start: number; t: number; from: THREE.Vector3; fired: boolean };
  let entering: Entering | null = null;
  const hallActive = () => {
    const v = (window.scrollY / (window.innerHeight || 1)) * 100;
    return introDone && v > 100 && v < 480;
  };
  const doorAt = () => {
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(doorLeaves, false);
    return hits.length ? doorLeaves.indexOf(hits[0].object as THREE.Mesh) : -1;
  };
  const enterDoor = (i: number) => {
    if (entering || i < 0) return;
    entering = { i, start: performance.now(), t: 0, from: camera.position.clone(), fired: false };
    root.classList.add("entering");
    document.documentElement.style.overflow = "hidden";
  };
  const resetEntering = () => {
    entering = null;
    root.classList.remove("entering");
    document.documentElement.style.overflow = "";
    els.veil.style.transition = "opacity 0.7s";
    els.veil.style.opacity = "0";
    window.setTimeout(() => (els.veil.style.transition = ""), 800);
  };
  const onEnterEvent = (e: Event) => enterDoor((e as CustomEvent<{ i: number }>).detail.i);
  const onDoneEvent = () => resetEntering();
  const onPageShow = () => resetEntering();
  window.addEventListener("rc:enter-door", onEnterEvent);
  window.addEventListener("rc:door-done", onDoneEvent);
  window.addEventListener("pageshow", onPageShow);
  const onClick = (e: MouseEvent) => {
    if (!hallActive() || entering) return;
    if ((e.target as HTMLElement).closest("a, button, input, [role=dialog]")) return;
    ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    enterDoor(doorAt());
  };
  window.addEventListener("click", onClick);
  const onDown = (e: PointerEvent) => {
    if (!interactive || e.button > 0) return;
    const t = e.target as HTMLElement;
    if (t.closest("a, button, input, [role=dialog]")) return;
    setNdc(e);
    if (!hitsBadge()) return;
    e.preventDefault();
    downAt = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
    const L = pts[N - 1];
    dragPlane.constant = -L.z;
    ray.ray.intersectPlane(dragPlane, hit);
    grabOff.subVectors(L, hit);
    dragTarget.copy(L);
    dragging = true;
    canvas.style.cursor = "grabbing";
    root.classList.add("dragging");
  };
  const onMove = (e: PointerEvent) => {
    mx = (e.clientX / window.innerWidth) * 2 - 1;
    my = (e.clientY / window.innerHeight) * 2 - 1;
    setNdc(e);
    if (!interactive) {
      if (hallActive() && !entering && !(e.target as HTMLElement).closest?.("a, button")) {
        hoverDoor = doorAt();
        canvas.style.cursor = hoverDoor >= 0 ? "pointer" : "";
      } else hoverDoor = -1;
      return;
    }
    if (dragging) {
      if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) downAt.moved = true;
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(dragPlane, hit)) {
        dragTarget.addVectors(hit, grabOff);
        // keep it on a leash: the reel only pays out so far
        _c.subVectors(dragTarget, collar);
        const max = seg * (N - 1) * 1.25;
        if (_c.length() > max) dragTarget.copy(collar).addScaledVector(_c.normalize(), max);
        if (dragTarget.y < FLOOR_Y + H * badgeScale + 0.2) dragTarget.y = FLOOR_Y + H * badgeScale + 0.2;
      }
    } else if (!(e.target as HTMLElement).closest?.("a, button")) {
      canvas.style.cursor = hitsBadge() ? "grab" : "";
    }
    if (hallActive() && !entering && !(e.target as HTMLElement).closest?.("a, button")) {
      hoverDoor = doorAt();
      canvas.style.cursor = hoverDoor >= 0 ? "pointer" : "";
    } else hoverDoor = -1;
  };
  let flipTarget = 0;
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    canvas.style.cursor = "grab";
    root.classList.remove("dragging");
    if (downAt && !downAt.moved && performance.now() - downAt.t < 350) flipTarget += Math.PI;
    downAt = null;
  };
  window.addEventListener("pointerdown", onDown, { passive: false });
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);

  // ------------------------------------------------------------------
  // Intro timeline
  // ------------------------------------------------------------------
  const INTRO_END = 7.2;
  let introT = o.introSeen ? INTRO_END : 0;
  const introStart = performance.now() + 250;
  let introDone = o.introSeen;
  const finishIntro = () => {
    if (introDone) return;
    introDone = true;
    introT = INTRO_END;
    seg = segLong;
    hold.copy(rest);
    resetRope(rest);
    root.classList.remove("intro-run");
    root.classList.add("intro-done");
    o.onIntroDone();
  };
  const onSkip = () => finishIntro();
  els.skip.addEventListener("click", onSkip);
  const onIndexFocus = () => finishIntro();
  els.index.addEventListener("focusin", onIndexFocus);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && !introDone) finishIntro();
  };
  window.addEventListener("keydown", onKey);

  if (introDone) {
    seg = segLong;
    hold.copy(rest);
    resetRope(rest);
  } else {
    anchor.copy(collar);
    hold.copy(chest);
    seg = segShort;
    resetRope(chest);
  }

  // A bezier for the pull: from her chest, out and up toward the camera,
  // then settling at rest.
  const pullMid = new THREE.Vector3();
  function pullPoint(t: number, out: THREE.Vector3) {
    pullMid.set((chest.x + rest.x) / 2 + 0.4, Math.max(chest.y, rest.y) + 1.4, (chest.z + rest.z) / 2 + 1.6);
    const u = 1 - t;
    out.set(
      u * u * chest.x + 2 * u * t * pullMid.x + t * t * rest.x,
      u * u * chest.y + 2 * u * t * pullMid.y + t * t * rest.y,
      u * u * chest.z + 2 * u * t * pullMid.z + t * t * rest.z,
    );
  }

  // ------------------------------------------------------------------
  // Loop
  // ------------------------------------------------------------------
  const camPos = new THREE.Vector3(),
    camLook = new THREE.Vector3(),
    tPos = new THREE.Vector3(),
    tLook = new THREE.Vector3();
  camAt(0, camPos, camLook);
  const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const nrm = new THREE.Vector3(),
    toCam = new THREE.Vector3(),
    wp = new THREE.Vector3();
  let flip = 0,
    yaw = 0;
  let last = performance.now(),
    time = 0,
    raf = 0,
    lastW = 0,
    lastH = 0;
  const show = (el: HTMLElement, a: number) => {
    el.style.opacity = a.toFixed(3);
    el.style.pointerEvents = a > 0.5 ? "" : "none";
  };

  function tick(now: number) {
    const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30);
    last = now;
    time += dt;
    const vh = window.innerHeight || 1;
    if (window.innerWidth !== lastW || vh !== lastH) {
      lastW = window.innerWidth;
      lastH = vh;
      layout();
      if (introDone) {
        hold.copy(rest);
        resetRope(rest);
      }
    }
    const v = (window.scrollY / vh) * 100;
    if (v > 560) return; // the archive covers everything now

    if (!introDone) {
      introT = Math.max(0, (now - introStart) / 1000);
      if (introT >= INTRO_END) finishIntro();
    }
    const it = introT;

    // Portrait
    const reveal = introDone ? 1 : sstep(0.25, 2.3, it);
    portraitUniforms.uProgress.value = portraitReady ? reveal : 0;
    const slide = introDone ? 1 : easeInOut(sstep(0.2, 1.8, it));
    const scrollFade = 1 - sstep(14, 46, v);
    portraitUniforms.uOpacity.value = scrollFade;
    shadowPortraitMat.opacity = 0;
    portrait.position.set(portraitBase.x - (1 - slide) * 0.9 + mx * 0.06, portraitBase.y - my * 0.03, portraitBase.z);
    portraitShadow.position.set(portrait.position.x + 0.18, portrait.position.y - 0.05, PZ - 0.35);
    portrait.visible = scrollFade > 0.01;
    portraitShadow.visible = false;
    anchor.set(collar.x + (portrait.position.x - portraitBase.x), collar.y + (portrait.position.y - portraitBase.y), collar.z);

    // Badge reel and pull
    const pull = introDone ? 1 : easeInOut(sstep(2.0, 4.3, it));
    if (!introDone) {
      pullPoint(pull, hold);
      seg = segShort + (segLong - segShort) * sstep(0, 0.85, pull);
    } else {
      // On scroll the reel takes the badge back to her before she fades.
      const reel = easeInOut(sstep(6, 34, v));
      pullPoint(1 - reel, hold);
      seg = segLong + (segShort - segLong) * reel;
      hold.y += Math.sin(time * 0.9) * 0.025 * (1 - reel); // breathing
    }
    const badgeVisible = (introDone || it > 1.7) && v < 44;
    badgeRoot.visible = badgeVisible;
    straps.forEach((s) => (s.geo.drawRange.count = badgeVisible ? Infinity : 0));

    step(dt / 2);
    step(dt / 2);
    const L = pts[N - 1];
    lastVel.copy(vel);
    vel.subVectors(L, prev[N - 1]).divideScalar(Math.max(dt / 2, 1e-4));
    acc.subVectors(vel, lastVel).divideScalar(Math.max(dt, 1e-4)).clampLength(0, 60);
    pendulum(dt);

    // Flip and open
    const spin = introDone ? 0 : easeInOut(sstep(4.4, 5.5, it)) * Math.PI * 2;
    const open = introDone ? 1 : easeOutBack(sstep(5.5, 6.7, it));
    yaw += (clamp(vel.x * 0.18, -0.6, 0.6) - yaw) * 0.1;
    flip += (flipTarget - flip) * 0.1;
    badgeRoot.position.copy(L);
    const sc = badgeScale * (introDone ? 1 : 0.55 + 0.45 * sstep(1.7, 3.6, it));
    badgeRoot.scale.setScalar(sc);
    swingG.rotation.set(thX, 0, thZ);
    flipG.rotation.y = flip + spin + yaw;
    hinge.rotation.y = -Math.PI * (1 - clamp(open, 0, 1.08));
    content.position.x = (W / 2) * (1 - clamp(open, 0, 1));
    badgeShadow.position.set(L.x, FLOOR_Y + 0.01, L.z);
    const lift = clamp((L.y - FLOOR_Y) / 6, 0, 1);
    (badgeShadow.material as THREE.MeshBasicMaterial).opacity = 0.9 - lift * 0.5;
    badgeShadow.scale.setScalar(sc * (0.8 + lift * 0.6) * (0.55 + 0.45 * open));

    updateStraps(0.26);

    // Camera
    camAt(v, tPos, tLook);
    if (entering) {
      entering.t = (now - entering.start) / 1000 / 1.5;
      const d = doors[entering.i];
      const a = easeInOut(clamp(entering.t / 0.55, 0, 1));
      const b = easeInOut(sstep(0.45, 1, entering.t));
      tPos.lerpVectors(entering.from, new THREE.Vector3(d.x, -1.1, HALL_Z + 2.4), a);
      tPos.lerp(new THREE.Vector3(d.x + 0.2, -1.2, HALL_Z - 2.2), b);
      tLook.set(d.x, -1.3, HALL_Z - 6);
      els.veil.style.opacity = sstep(0.62, 1, entering.t).toFixed(3);
      if (entering.t >= 1 && !entering.fired) {
        entering.fired = true;
        o.onEnterDoor(entering.i);
      }
    }
    const k = 1 - Math.exp(-dt * 6);
    camPos.lerp(tPos, k);
    camLook.lerp(tLook, k);
    const par = 1 - sstep(10, 40, v);
    camera.position.set(camPos.x + mx * 0.22 * par, camPos.y - my * 0.14 * par, camPos.z);
    camera.lookAt(camLook);

    // Sculptures
    sculptures.forEach((s, i) => {
      const a = bump(v, STOPS[i], 12, 50);
      s.update(a, time);
      s.g.visible = v > 40;
    });

    // Walking into the painting.
    glazeMat.opacity = 0.32 * (1 - sstep(30, 70, v));
    glaze.visible = glazeMat.opacity > 0.01;

    // Each featured door eases open to show what is behind it. A door the
    // visitor chose swings wide while the camera flies through.
    doors.forEach((d, i) => {
      let open = bump(v, STOPS[i], 14, 18) * 0.62;
      if (entering && entering.i === i) open = Math.max(open, easeInOut(sstep(0.15, 0.95, entering.t)));
      const hover = hoverDoor === i && !entering ? 0.06 : 0;
      d.pivot.rotation.y += ((open + hover) * THREE.MathUtils.degToRad(100) - d.pivot.rotation.y) * 0.14;
    });
    show(els.choose, bump(v, 452, 14, 12) * (entering ? 0 : 1));

    // DOM overlays
    interactive = introDone && v < 30;
    const heroA = 1 - sstep(8, 38, v);
    show(els.heroCopy, heroA);
    show(els.hint, introDone ? 1 - sstep(2, 14, v) : 0);
    els.cards.forEach((el, i) => {
      const a = bump(v, STOPS[i], 18, 22);
      if (!el.matches(":focus-within")) show(el, a);
    });

    // Index overlay, mapped onto the right leaf with a projective transform.
    badgeRoot.updateMatrixWorld(true);
    const mxL = W * 0.08,
      top = H * 0.13;
    corners[0].set(-W / 2 + mxL, H / 2 - top, T / 2 + 0.002);
    corners[1].set(W / 2 - mxL, H / 2 - top, T / 2 + 0.002);
    corners[2].set(W / 2 - mxL, H / 2 - top - H * 0.74, T / 2 + 0.002);
    corners[3].set(-W / 2 + mxL, H / 2 - top - H * 0.74, T / 2 + 0.002);
    const q: number[] = [];
    const sw = window.innerWidth,
      shh = window.innerHeight;
    for (const c of corners) {
      wp.copy(c).applyMatrix4(leafR.matrixWorld).project(camera);
      q.push((wp.x * 0.5 + 0.5) * sw, (-wp.y * 0.5 + 0.5) * shh);
    }
    nrm.set(0, 0, 1).transformDirection(leafR.matrixWorld);
    leafR.getWorldPosition(wp);
    toCam.subVectors(camera.position, wp).normalize();
    const facing = nrm.dot(toCam);
    const idxA = sstep(0.82, 1, clamp(open, 0, 1)) * sstep(0.25, 0.6, facing) * (1 - sstep(8, 30, v)) * (badgeVisible ? 1 : 0);
    if (idxA > 0.01) {
      const m = squareToQuad(q);
      els.index.style.transform = `matrix3d(${m.map((n) => n.toFixed(6)).join(",")}) scale(${1 / indexW}, ${1 / indexH})`;
    }
    if (!els.index.matches(":focus-within") || !introDone) show(els.index, idxA);
    else els.index.style.opacity = "1";

    renderer.render(scene, camera);

    if (!visible) {
      if (!portraitReady && now - introStart > 6000) throw new Error("The portrait did not load");
      if (portraitReady && (introDone || it > 2.6)) {
        if (v < 5 && portraitLooksBlank()) throw new Error("The scene rendered nothing");
        visible = true;
      }
    }
  }

  // Some browsers run the scene but draw nothing. Once her portrait should
  // be on screen, sample a column through it: a canvas that is still bare
  // background means the drawing failed.
  let visible = false;
  const px = new Uint8Array(4);
  const sp = new THREE.Vector3();
  function portraitLooksBlank() {
    const gl = renderer.getContext();
    const w = gl.drawingBufferWidth,
      h = gl.drawingBufferHeight;
    sp.copy(portrait.position).project(camera);
    const x = Math.round((sp.x * 0.5 + 0.5) * w);
    for (let k = 0; k < 7; k++) {
      gl.readPixels(x, Math.round(h * (0.15 + k * 0.1)), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      if (Math.abs(px[0] - 242) > 24 || Math.abs(px[1] - 235) > 24 || Math.abs(px[2] - 221) > 24) return false;
    }
    return true;
  }

  let failed = false;
  function frame(now: number) {
    try {
      tick(now);
    } catch (err) {
      if (!failed) {
        failed = true;
        console.error(err);
        o.onFail();
      }
      return;
    }
    raf = requestAnimationFrame(frame);
  }
  root.classList.add("stage-ready");
  raf = requestAnimationFrame(frame);

  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    o.onFail();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("click", onClick);
    window.removeEventListener("rc:enter-door", onEnterEvent);
    window.removeEventListener("rc:door-done", onDoneEvent);
    window.removeEventListener("pageshow", onPageShow);
    els.skip.removeEventListener("click", onSkip);
    els.index.removeEventListener("focusin", onIndexFocus);
    canvas.removeEventListener("webglcontextlost", onLost);
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    root.classList.remove("stage-ready");
  };
}
