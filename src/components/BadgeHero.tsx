"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import * as THREE from "three";
import { intro, caseStudies } from "@/content/content";
import { scrollToTarget } from "@/lib/lenis";

// Part 1 of the badge design (15 Oct 2026, ported from Rachel's "Meet
// Rachel" HTML prototype): a three.js ID badge on a lanyard that drops
// in, can be dragged/flipped, and whose scroll position drives a camera
// walk-through past four "selected work" cards before handing off to
// Part 2 (Archive.tsx, the plain-HTML content section below). The badge
// front is a canvas texture with Rachel's real photo drawn into it
// (the prototype shipped a placeholder "Your photo here" box here).

const octaveMargin = caseStudies.find((c) => c.slug === "octave")?.metrics[0]?.value ?? "+68%";
const pcosRecall = caseStudies.find((c) => c.slug === "pcos-care")?.metrics[0]?.value ?? "93.75%";

const NAV_ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

const MENU_ITEMS = [
  { href: "#work", label: "Selected work" },
  { href: "#research", label: "Research" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#projects-list", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#teaching", label: "Teaching" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "#ideas", label: "Perspective" },
  { href: "#achievements", label: "Achievements" },
  { href: "#news", label: "In the news" },
  { href: "#ask", label: "Ask about Rachel" },
  { href: "#contact", label: "Contact" },
];

export default function BadgeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hdrRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const projLRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (href: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(href);
    history.pushState(null, "", href);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const hdr = hdrRef.current;
    const heroL = heroRef.current;
    const projL = projLRef.current;
    if (!canvas || !hdr || !heroL || !projL) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      renderer = null;
    }
    if (!renderer) {
      root.classList.add("no-gl");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
    const IVORY = new THREE.Color("#F4EFE5");
    const WINE = new THREE.Color("#3B1727");
    scene.background = IVORY.clone();
    scene.fog = new THREE.Fog(IVORY.clone(), 12, 34);

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const sun = new THREE.DirectionalLight(0xfff0e0, 0.85);
    sun.position.set(5, 8, 7);
    scene.add(sun);
    const roomLight = new THREE.PointLight(0xf3c9d1, 1.1, 40);
    roomLight.position.set(0, 3, -34);
    scene.add(roomLight);

    const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
    const sstep = (a: number, b: number, x: number) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const bump = (v: number, c: number, w: number, f: number) =>
      sstep(c - w - f, c - w, v) * (1 - sstep(c + w, c + w + f, v));
    const std = (c: THREE.ColorRepresentation, o?: Partial<THREE.MeshStandardMaterialParameters>) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, ...o });

    function archWall(color: THREE.ColorRepresentation) {
      const s = new THREE.Shape();
      s.moveTo(-18, -3);
      s.lineTo(18, -3);
      s.lineTo(18, 16);
      s.lineTo(-18, 16);
      s.lineTo(-18, -3);
      const h = new THREE.Path();
      h.moveTo(-1.6, -2.4);
      h.lineTo(-1.6, 0.6);
      h.absarc(0, 0.6, 1.6, Math.PI, 0, true);
      h.lineTo(1.6, -2.4);
      h.lineTo(-1.6, -2.4);
      s.holes.push(h);
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false, curveSegments: 40 });
      return new THREE.Mesh(g, std(color, { roughness: 0.95 }));
    }
    const walls = (
      [
        ["#EFE8DB", -4],
        ["#D9B8BE", -7],
        ["#8C3A52", -10],
        ["#641F35", -13],
      ] as [string, number][]
    ).map(([c, z]) => {
      const m = archWall(c);
      m.position.z = z;
      scene.add(m);
      return m;
    });
    const floorMat = std("#E4DBCC", { roughness: 1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 140), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.4, -45);
    scene.add(floor);
    const FLOOR_A = new THREE.Color("#E4DBCC");
    const FLOOR_B = new THREE.Color("#2A0F1A");

    // ---------- badge textures ----------
    const CW = 1024;
    const CH = 1502;
    function rr(x: CanvasRenderingContext2D, X: number, Y: number, W: number, H: number, r: number) {
      x.beginPath();
      x.moveTo(X + r, Y);
      x.lineTo(X + W - r, Y);
      x.quadraticCurveTo(X + W, Y, X + W, Y + r);
      x.lineTo(X + W, Y + H - r);
      x.quadraticCurveTo(X + W, Y + H, X + W - r, Y + H);
      x.lineTo(X + r, Y + H);
      x.quadraticCurveTo(X, Y + H, X, Y + H - r);
      x.lineTo(X, Y + r);
      x.quadraticCurveTo(X, Y, X + r, Y);
      x.closePath();
    }
    const fc = document.createElement("canvas");
    fc.width = CW;
    fc.height = CH;
    const bc = document.createElement("canvas");
    bc.width = CW;
    bc.height = CH;

    const photoImg = new Image();
    let photoReady = false;
    photoImg.src = intro.photo;

    function drawFront() {
      const x = fc.getContext("2d");
      if (!x) return;
      x.clearRect(0, 0, CW, CH);
      rr(x, 0, 0, CW, CH, 72);
      x.fillStyle = "#FBF8F2";
      x.fill();
      rr(x, CW / 2 - 90, 54, 180, 30, 15);
      x.fillStyle = "#C9C0B3";
      x.fill();

      const px = 64,
        py = 130,
        pw = CW - 128,
        ph = 600,
        pr = 40;
      x.save();
      rr(x, px, py, pw, ph, pr);
      x.clip();
      if (photoReady) {
        const iw = photoImg.naturalWidth,
          ih = photoImg.naturalHeight;
        const scale = Math.max(pw / iw, ph / ih);
        const dw = iw * scale,
          dh = ih * scale;
        const dx = px + (pw - dw) / 2,
          dy = py + (ph - dh) / 2 - dh * 0.06; // bias up slightly toward the face
        x.drawImage(photoImg, dx, dy, dw, dh);
      } else {
        x.fillStyle = "#D8D0C4";
        x.fillRect(px, py, pw, ph);
      }
      x.restore();

      x.textAlign = "left";
      x.fillStyle = "#262322";
      x.font = '128px "Instrument Serif", Georgia, serif';
      x.fillText(intro.name, 60, 890);
      x.fillStyle = "#641F35";
      x.font = "600 50px Manrope, sans-serif";
      x.fillText("Analyst, Data and AI", 64, 968);
      x.fillStyle = "#5E524C";
      x.font = "500 36px Manrope, sans-serif";
      x.fillText("OCTAVE, John Keells Holdings", 64, 1030);
      x.fillStyle = "#C9C0B3";
      x.fillRect(64, 1086, CW - 128, 3);
      x.fillStyle = "#5E524C";
      x.font = "500 30px Manrope, sans-serif";
      x.fillText("ORCID", 64, 1156);
      x.textAlign = "right";
      x.fillText("Colombo", CW - 64, 1156);
      x.fillStyle = "#262322";
      x.font = '500 34px "IBM Plex Mono", monospace';
      x.textAlign = "left";
      x.fillText("0009-0009-3192-2669", 64, 1206);
      x.textAlign = "right";
      x.font = "500 34px Manrope, sans-serif";
      x.fillText("rachelcooray.com", CW - 64, 1206);
      const bars = [3, 7, 3, 10, 4, 3, 8, 3, 5];
      x.fillStyle = "#262322";
      for (let i = 0, bx = 64; bx < CW - 80; i++) {
        const w = bars[i % bars.length];
        x.fillRect(bx, 1286, w, 130);
        bx += w + 9;
      }
    }
    function drawBack() {
      const x = bc.getContext("2d");
      if (!x) return;
      x.clearRect(0, 0, CW, CH);
      rr(x, 0, 0, CW, CH, 72);
      x.fillStyle = "#3B1727";
      x.fill();
      rr(x, CW / 2 - 90, 54, 180, 30, 15);
      x.fillStyle = "#5A2A3D";
      x.fill();
      x.fillStyle = "#F4EFE5";
      x.textAlign = "left";
      x.font = 'italic 190px "Instrument Serif", Georgia, serif';
      x.fillText("Scroll", 72, 640);
      x.fillText("to walk", 72, 820);
      x.fillText("through.", 72, 1000);
      x.fillStyle = "#EBD3D7";
      x.font = "500 36px Manrope, sans-serif";
      x.fillText("Tap again to flip back", 76, 1380);
    }
    drawFront();
    drawBack();
    const frontTex = new THREE.CanvasTexture(fc);
    const backTex = new THREE.CanvasTexture(bc);
    [frontTex, backTex].forEach((t) => {
      t.anisotropy = renderer!.capabilities.getMaxAnisotropy();
    });
    const redrawAll = () => {
      drawFront();
      drawBack();
      frontTex.needsUpdate = true;
      backTex.needsUpdate = true;
    };
    photoImg.onload = () => {
      photoReady = true;
      redrawAll();
    };
    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('128px "Instrument Serif"'),
        document.fonts.load('italic 190px "Instrument Serif"'),
        document.fonts.load("600 50px Manrope"),
        document.fonts.load('500 34px "IBM Plex Mono"'),
      ])
        .then(redrawAll)
        .catch(() => {});
    }

    // ---------- badge + lanyard ----------
    const CARD_W = 1.5,
      CARD_H = 2.2;
    const card = new THREE.Group();
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W, CARD_H),
      new THREE.MeshBasicMaterial({ map: frontTex, alphaTest: 0.5 }),
    );
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(CARD_W, CARD_H),
      new THREE.MeshBasicMaterial({ map: backTex, alphaTest: 0.5 }),
    );
    front.position.z = 0.006;
    back.position.z = -0.006;
    back.rotation.y = Math.PI;
    card.add(front, back);
    scene.add(card);
    const clip = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.24, 0.07),
      std("#B9B2A8", { metalness: 0.7, roughness: 0.35 }),
    );
    scene.add(clip);

    const N = 14,
      SEG = 0.27,
      ROPE = N * SEG;
    const pts: THREE.Vector3[] = [],
      prev: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      pts.push(new THREE.Vector3());
      prev.push(new THREE.Vector3());
    }
    const anchor = new THREE.Vector3();
    const curve = new THREE.CatmullRomCurve3(pts);
    function ribbon(color: THREE.ColorRepresentation) {
      const S = 44,
        pos = new Float32Array(S * 2 * 3),
        geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const idx: number[] = [];
      for (let i = 0; i < S - 1; i++) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
      geo.setIndex(idx);
      const m = new THREE.Mesh(geo, std(color, { side: THREE.DoubleSide, roughness: 0.8 }));
      m.frustumCulled = false;
      scene.add(m);
      return { S, pos, geo };
    }
    const straps = [ribbon("#7A2540"), ribbon("#5C1A2F")];
    const _c = new THREE.Vector3(),
      _t = new THREE.Vector3(),
      _s = new THREE.Vector3(),
      Z = new THREE.Vector3(0, 0, 1);
    function updateStraps() {
      straps.forEach((r, k) => {
        const sign = k ? 1 : -1;
        for (let i = 0; i < r.S; i++) {
          const t = i / (r.S - 1);
          curve.getPoint(t, _c);
          curve.getTangent(t, _t);
          _s.crossVectors(_t, Z).normalize().multiplyScalar(0.07 * cardScale);
          const ox = sign * 0.34 * cardScale * (1 - t) * (1 - t),
            oz = sign * 0.012;
          r.pos[i * 6] = _c.x + ox + _s.x;
          r.pos[i * 6 + 1] = _c.y + _s.y;
          r.pos[i * 6 + 2] = _c.z + oz;
          r.pos[i * 6 + 3] = _c.x + ox - _s.x;
          r.pos[i * 6 + 4] = _c.y - _s.y;
          r.pos[i * 6 + 5] = _c.z + oz;
        }
        r.geo.attributes.position.needsUpdate = true;
        r.geo.computeVertexNormals();
      });
    }

    // ---------- project objects ----------
    function papers() {
      const g = new THREE.Group(),
        sheets: THREE.Mesh[] = [];
      for (let k = 0; k < 6; k++) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.75, 0.014), std(k === 5 ? "#FBF8F2" : "#EDE4D6"));
        g.add(m);
        sheets.push(m);
      }
      const fig = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.52), std("#B8878F"));
      fig.position.set(0, 0.42, 0.009);
      sheets[5].add(fig);
      for (let l = 0; l < 5; l++) {
        const ln = new THREE.Mesh(new THREE.PlaneGeometry(l === 4 ? 0.6 : 0.95, 0.035), std("#8E827A"));
        ln.position.set(l === 4 ? -0.17 : 0, -0.06 - l * 0.13, 0.009);
        sheets[5].add(ln);
      }
      g.userData.update = (a: number, t: number) => {
        sheets.forEach((s, k) => {
          const f = k - 2.5;
          s.rotation.z = f * (0.04 + 0.12 * a);
          s.position.set(f * 0.05 * (1 + 3 * a), 0, f * 0.05);
        });
        g.rotation.y = -0.3 + Math.sin(t * 0.4) * 0.25;
        g.position.y = Math.sin(t * 0.9) * 0.08;
      };
      return g;
    }
    function pipeline() {
      const g = new THREE.Group(),
        slabs: THREE.Group[] = [];
      const s0 = new THREE.Group();
      s0.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.07, 1.4), std("#C9C0B3")));
      const grid = new THREE.GridHelper(1.8, 10, 0x641f35, 0x8c6a72);
      grid.position.y = 0.04;
      s0.add(grid);
      const s1 = new THREE.Group();
      s1.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.07, 1.4), std("#D9B8BE")));
      [0.5, 0.32, 0.22, 0.15, 0.1, 0.06].forEach((h, i) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.16), std("#641F35"));
        b.position.set(-0.7 + i * 0.28, 0.035 + h / 2, 0);
        s1.add(b);
      });
      const s2 = new THREE.Group();
      s2.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.07, 1.4), std("#8C3A52")));
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), std("#F4EFE5"));
      cube.position.y = 0.25;
      s2.add(cube);
      const s3 = new THREE.Group();
      s3.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.07, 1.4), std("#F4EFE5")));
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), std("#641F35"));
      dot.position.y = 0.16;
      s3.add(dot);
      [s0, s1, s2, s3].forEach((s) => {
        g.add(s);
        slabs.push(s);
      });
      const rods = [0, 1, 2].map(() => {
        const r = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1, 8), std("#EBD3D7"));
        g.add(r);
        return r;
      });
      g.userData.update = (a: number, t: number) => {
        const gap = 0.22 + 0.75 * a;
        slabs.forEach((s, k) => (s.position.y = (k - 1.5) * gap));
        rods.forEach((r, k) => {
          r.position.y = (k - 1) * gap;
          r.scale.y = gap;
        });
        g.rotation.y = t * 0.25;
        cube.rotation.y = t * 0.8;
      };
      return g;
    }
    function hockey() {
      const g = new THREE.Group();
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.4, -0.72, 0),
        new THREE.Vector3(-0.6, -0.64, 0),
        new THREE.Vector3(0.1, -0.52, 0),
        new THREE.Vector3(0.62, -0.12, 0),
        new THREE.Vector3(1.0, 0.6, 0),
        new THREE.Vector3(1.28, 1.45, 0),
      ]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 80, 0.045, 10, false), std("#EBD3D7", { roughness: 0.5 })));
      const ax = new THREE.Mesh(new THREE.BoxGeometry(3, 0.025, 0.025), std("#8C6A72"));
      ax.position.set(0, -0.95, 0);
      g.add(ax);
      const ay = new THREE.Mesh(new THREE.BoxGeometry(0.025, 2.6, 0.025), std("#8C6A72"));
      ay.position.set(-1.5, 0.33, 0);
      g.add(ay);
      const balls: THREE.Mesh[] = [];
      for (let k = 0; k < 7; k++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 14), std(k % 2 ? "#641F35" : "#F4EFE5"));
        g.add(b);
        balls.push(b);
      }
      const p = new THREE.Vector3();
      g.userData.update = (a: number, t: number) => {
        balls.forEach((b, k) => {
          let u = (t * 0.06 * (1 + a) + k / 7) % 1;
          u = 0.5 + 0.5 * Math.sin((u - 0.5) * Math.PI);
          c.getPoint(u, p);
          b.position.set(p.x, p.y + 0.14, p.z);
        });
        g.rotation.y = Math.sin(t * 0.35) * 0.45;
      };
      return g;
    }
    function layer1Cubes() {
      const g = new THREE.Group(),
        top: THREE.Mesh[] = [];
      const cols = ["#F4EFE5", "#B8878F", "#641F35", "#85866A"];
      let n = 0;
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), std(cols[n++ % 4]));
          m.position.set((i - 1) * 0.48, -0.45, (j - 1) * 0.48);
          g.add(m);
        }
      for (let i = 0; i < 2; i++)
        for (let j = 0; j < 2; j++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), std(cols[n++ % 4]));
          m.userData.bx = (i - 0.5) * 0.48;
          m.userData.bz = (j - 0.5) * 0.48;
          g.add(m);
          top.push(m);
        }
      g.rotation.x = 0.35;
      g.userData.update = (a: number, t: number) => {
        top.forEach((m) => {
          m.position.set(m.userData.bx * (1 + a * 0.6), 0.03 + a * 0.45, m.userData.bz * (1 + a * 0.6));
        });
        g.rotation.y = t * 0.3;
      };
      return g;
    }
    const projects = [
      { g: pipeline(), side: -1, z: -22 },
      { g: hockey(), side: 1, z: -31 },
      { g: papers(), side: -1, z: -40 },
      { g: layer1Cubes(), side: 1, z: -49 },
    ];
    projects.forEach((p) => scene.add(p.g));

    // ---------- layout ----------
    let mobile = false,
      X = 0,
      LX = 0,
      anchorBase = 4.6,
      cardScale = 1;
    type Key = [number, [number, number, number], [number, number, number]];
    let keys: Key[] = [];
    function layout() {
      const w = window.innerWidth || 1,
        h = window.innerHeight || 1;
      renderer!.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      mobile = w < 760;
      X = mobile ? 0 : 1.6;
      LX = mobile ? 0.3 : 1.6;
      anchorBase = mobile ? 3.1 : 4.6;
      cardScale = mobile ? 0.7 : 1;
      card.scale.setScalar(cardScale);
      walls.forEach((m) => (m.position.x = X));
      projects.forEach((p) => {
        p.g.position.x = X + p.side * (mobile ? 1.3 : 2.3);
        p.g.position.z = p.z;
        p.g.scale.setScalar(mobile ? 0.9 : 1.15);
      });
      const K: Key[] = [];
      K.push([0, [0, mobile ? 0.2 : 0, mobile ? 8.5 : 8], [0, mobile ? 0.2 : 0, 0]]);
      K.push([70, [X * 0.6, 0.3, 5.5], [X * 0.8, 0.3, -4]]);
      K.push([130, [X, 0.3, -1.5], [X, 0.3, -12]]);
      K.push([205, [X, 0.3, -12], [X, 0.2, -22]]);
      projects.forEach((p, i) => {
        const c = 250 + 100 * i,
          cx = X + p.side * (mobile ? 1.3 : 0.9);
        const cam: [number, number, number] = [cx, 0.6, p.z + (mobile ? 8.5 : 6.5)];
        const look: [number, number, number] = [cx, mobile ? -1.2 : 0, p.z];
        K.push([c - 22, cam, look]);
        K.push([c + 22, cam, look]);
      });
      K.push([640, [X, 9, -30], [X, 9.5, -60]]);
      K.push([800, [X, 9, -30], [X, 9.5, -60]]);
      keys = K;
    }
    function camAt(v: number, pos: THREE.Vector3, look: THREE.Vector3) {
      let a = keys[0],
        b = keys[keys.length - 1];
      if (v <= a[0]) {
        pos.fromArray(a[1]);
        look.fromArray(a[2]);
        return;
      }
      for (let i = 0; i < keys.length - 1; i++) {
        if (v <= keys[i + 1][0]) {
          a = keys[i];
          b = keys[i + 1];
          break;
        }
      }
      if (v >= b[0]) {
        pos.fromArray(b[1]);
        look.fromArray(b[2]);
        return;
      }
      const t = sstep(0, 1, (v - a[0]) / (b[0] - a[0]));
      pos.set(
        a[1][0] + (b[1][0] - a[1][0]) * t,
        a[1][1] + (b[1][1] - a[1][1]) * t,
        a[1][2] + (b[1][2] - a[1][2]) * t,
      );
      look.set(
        a[2][0] + (b[2][0] - a[2][0]) * t,
        a[2][1] + (b[2][1] - a[2][1]) * t,
        a[2][2] + (b[2][2] - a[2][2]) * t,
      );
    }
    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    // ---------- rope physics ----------
    const DOWN = new THREE.Vector3(0, -1, 0),
      UP = new THREE.Vector3(0, 1, 0);
    const d = new THREE.Vector3(),
      dir = new THREE.Vector3(),
      qA = new THREE.Quaternion(),
      qY = new THREE.Quaternion();
    let dragging = false;
    const dragTarget = new THREE.Vector3();
    function resetRope(lift: number) {
      anchor.set(LX, anchorBase + lift, 0);
      for (let i = 0; i < N; i++) {
        pts[i].set(anchor.x, anchor.y - i * SEG, 0);
        prev[i].copy(pts[i]);
      }
    }
    const DROP = reduce ? 0 : 7.5;
    resetRope(DROP);
    const dropStart = performance.now() + 350;
    let kicked = false;
    function easeOutBack(t: number) {
      const c1 = 1.3,
        c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    function step(dt: number) {
      const g = -15 * dt * dt;
      const L = N - 1;
      if (dragging) {
        prev[L].copy(pts[L]);
        pts[L].copy(dragTarget);
      }
      for (let i = 1; i < N; i++) {
        if (dragging && i === L) continue;
        const p = pts[i],
          q = prev[i];
        let vx = (p.x - q.x) * 0.988,
          vy = (p.y - q.y) * 0.988,
          vz = (p.z - q.z) * 0.988;
        const sp = Math.hypot(vx, vy, vz);
        if (sp > 0.5) {
          vx *= 0.5 / sp;
          vy *= 0.5 / sp;
          vz *= 0.5 / sp;
        }
        q.copy(p);
        p.x += vx;
        p.y += vy + g;
        p.z += vz - p.z * 0.015;
      }
      pts[0].copy(anchor);
      for (let k = 0; k < 26; k++) {
        for (let i = 0; i < N - 1; i++) {
          const a = pts[i],
            b = pts[i + 1];
          d.subVectors(b, a);
          const len = d.length() || 1e-6;
          const diff = (len - SEG) / len;
          const aF = i === 0,
            bF = dragging && i + 1 === L;
          if (aF && bF) continue;
          if (aF) b.addScaledVector(d, -diff);
          else if (bF) a.addScaledVector(d, diff);
          else {
            a.addScaledVector(d, diff * 0.5);
            b.addScaledVector(d, -diff * 0.5);
          }
        }
      }
    }
    let flip = 0,
      flipTarget = 0,
      yaw = 0;
    function placeCard() {
      const L = N - 1;
      dir.subVectors(pts[L], pts[L - 1]).normalize();
      card.position.copy(pts[L]).addScaledVector(dir, (CARD_H / 2) * cardScale + 0.1);
      qA.setFromUnitVectors(DOWN, dir);
      const vel = pts[L].x - prev[L].x;
      yaw += (clamp(vel * 16, -0.9, 0.9) - yaw) * 0.12;
      flip += (flipTarget - flip) * 0.12;
      qY.setFromAxisAngle(UP, flip + yaw);
      card.quaternion.copy(qA).multiply(qY);
      clip.position.copy(pts[L]).addScaledVector(dir, 0.02);
      clip.quaternion.copy(qA);
    }

    // ---------- pointer ----------
    const ray = new THREE.Raycaster(),
      ndc = new THREE.Vector2(),
      plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      hit = new THREE.Vector3(),
      grabOff = new THREE.Vector3();
    let downAt: { x: number; y: number; t: number; moved: boolean } | null = null,
      mx = 0,
      my = 0;
    function setNdc(e: PointerEvent) {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    function hitsCard() {
      ray.setFromCamera(ndc, camera);
      return ray.intersectObjects([front, back]).length > 0;
    }
    const onPointerDown = (e: PointerEvent) => {
      setNdc(e);
      if (!hitsCard()) return;
      downAt = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
      plane.constant = -pts[N - 1].z;
      ray.ray.intersectPlane(plane, hit);
      grabOff.subVectors(pts[N - 1], hit);
      dragTarget.copy(pts[N - 1]);
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      setNdc(e);
      if (dragging) {
        if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) downAt.moved = true;
        ray.setFromCamera(ndc, camera);
        if (ray.ray.intersectPlane(plane, hit)) {
          dragTarget.addVectors(hit, grabOff);
          d.subVectors(dragTarget, anchor);
          const max = ROPE * 0.97;
          if (d.length() > max) dragTarget.copy(anchor).addScaledVector(d.normalize(), max);
        }
      } else {
        canvas.style.cursor = hitsCard() ? "grab" : "default";
      }
    };
    const release = () => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      if (downAt && !downAt.moved && performance.now() - downAt.t < 350) flipTarget += Math.PI;
      downAt = null;
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    // ---------- overlays ----------
    const archive = document.getElementById("archive");
    const toneEls = [...document.querySelectorAll<HTMLElement>("[data-tone]")];
    const projEls = [...document.querySelectorAll<HTMLElement>(".proj")];
    function show(el: HTMLElement, o: number) {
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.02 ? "visible" : "hidden";
    }
    let lastDark: string | null = null;

    // ---------- loop ----------
    const camPos = new THREE.Vector3(),
      camLook = new THREE.Vector3(),
      tPos = new THREE.Vector3(),
      tLook = new THREE.Vector3();
    camAt(0, camPos, camLook);
    const bg = new THREE.Color();
    let last = performance.now(),
      time = 0;
    let failed = false;
    let rafId = 0;
    function frame(now: number) {
      try {
        tick(now);
      } catch (err) {
        if (!failed) {
          failed = true;
          console.error(err);
          root.classList.add("no-gl");
        }
        return;
      }
      rafId = requestAnimationFrame(frame);
    }
    let lastW = 0,
      lastH = 0;
    function tick(now: number) {
      const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 30);
      last = now;
      time += dt;
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (vh < 10) return;
      if (window.innerWidth !== lastW || vh !== lastH) {
        lastW = window.innerWidth;
        lastH = vh;
        layout();
      }
      let v = (window.scrollY / vh) * 100;
      if (!isFinite(v)) v = 0;
      if (!isFinite(camPos.x + camPos.y + camPos.z + camLook.x)) camAt(v, camPos, camLook);
      if (!isFinite(pts[N - 1].x + pts[N - 1].y)) resetRope(0);

      let lift = 0;
      if (DROP) {
        const t = clamp((now - dropStart) / 1150, 0, 1);
        lift = DROP * (1 - easeOutBack(t));
        if (t > 0 && !kicked) {
          kicked = true;
          prev[N - 1].x += 0.02;
        }
      }
      const scrollLift = sstep(22, 95, v) * 11;
      anchor.set(LX, anchorBase + lift + scrollLift, 0);
      step(dt / 2);
      step(dt / 2);
      placeCard();
      updateStraps();

      camAt(v, tPos, tLook);
      const k = 1 - Math.exp(-dt * 5);
      camPos.lerp(tPos, k);
      camLook.lerp(tLook, k);
      const par = reduce ? 0 : 1;
      camera.position.set(camPos.x + mx * 0.18 * par, camPos.y - my * 0.12 * par, camPos.z);
      camera.lookAt(camLook);

      const bt = sstep(95, 215, v);
      bg.copy(IVORY).lerp(WINE, bt);
      scene.background = bg.clone();
      if (scene.fog && "color" in scene.fog) scene.fog.color.copy(bg);
      if (scene.fog && "near" in scene.fog) {
        (scene.fog as THREE.Fog).near = 12 - 6 * bt;
        (scene.fog as THREE.Fog).far = 34 - 17 * bt;
      }
      floorMat.color.copy(FLOOR_A).lerp(FLOOR_B, bt);
      const aTop = archive ? archive.getBoundingClientRect().top : Infinity;
      const inArchive = aTop <= 64;
      let dark = bt > 0.5;
      if (inArchive) {
        dark = false;
        for (const el of toneEls) {
          const r = el.getBoundingClientRect();
          if (r.top <= 64 && r.bottom > 64) {
            dark = true;
            break;
          }
        }
      }
      const state = (dark ? "d" : "l") + (inArchive ? "s" : "");
      if (state !== lastDark) {
        lastDark = state;
        hdr!.classList.toggle("dark", dark);
        hdr!.classList.toggle("solid", inArchive);
        root.style.setProperty("--notch", dark ? "#3B1727" : "#F4EFE5");
        document.body.style.background = dark ? "#3B1727" : "#F4EFE5";
      }

      projects.forEach((p, i) => {
        const a = bump(v, 250 + 100 * i, 10, 45);
        p.g.userData.update(reduce ? a : a, reduce ? 0 : time);
      });

      show(heroL!, 1 - sstep(18, 60, v));
      const pv = sstep(215, 240, v) * (1 - sstep(585, 610, v));
      show(projL!, pv);
      projEls.forEach((el, i) => show(el, bump(v, 250 + 100 * i, 18, 22)));

      if (aTop > 0) renderer!.render(scene, camera);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      renderer!.dispose();
      document.body.style.background = "";
      root.style.removeProperty("--notch");
      root.classList.remove("no-gl");
      hdr!.classList.remove("dark", "solid");
    };
  }, []);

  return (
    <>
      <div id="top" className="anchor" style={{ top: 0 }} />
      <canvas ref={canvasRef} id="gl" aria-hidden="true" />

      <header className="top" id="hdr" ref={hdrRef}>
        <a className="mark" href="#top" aria-label="Back to the start" onClick={(e) => navigate("#top", e)}>
          RC
        </a>
        <div className="navbar">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className="wide" href={item.href} onClick={(e) => navigate(item.href, e)}>
              {item.label}
            </a>
          ))}
          <button
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <nav id="menu" aria-label="All sections" className={menuOpen ? "open" : ""}>
        <button className="menu-btn close" type="button" onClick={() => setMenuOpen(false)}>
          Close
        </button>
        <ol>
          {MENU_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={(e) => navigate(item.href, e)}>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="layer" id="hero" aria-label="Introduction" ref={heroRef}>
        <div className="inner">
          <h1 className="serif">
            <span>Rachel</span>
            <span className="second">Cooray</span>
          </h1>
          <p className="claim">{intro.tagline}</p>
          <p className="lede">
            Analyst for Data and AI at OCTAVE, the advanced analytics arm of John Keells Holdings. Published AI
            researcher (IEEE), technical co-founder of Layer1 Studio, First Class Honours in Computer Science from
            the University of Westminster.
          </p>
          <p className="hint">
            <span>
              <i />
              Drag the badge
            </span>
            <span>
              <i />
              Tap it to flip
            </span>
            <span>
              <i />
              Scroll to walk through
            </span>
          </p>
        </div>
      </section>

      <section className="layer" id="projects" aria-label="Selected work" ref={projLRef}>
        <article className="proj right" data-i="0">
          <p className="kind">Final year research, IEEE ICAHS 2025, Tunisia</p>
          <h2 className="serif">PCOS Care</h2>
          <p className="body">
            A machine learning web app for early PCOS risk prediction. Chi-square and ANOVA feature selection, SMOTE
            and a dual-model setup, reaching <span className="figure">{pcosRecall}</span> recall. Third place at the
            Westminster showcase, and selected for the MSIT Journal special edition.
          </p>
          <span className="count">1 of 4</span>
        </article>
        <article className="proj left" data-i="1">
          <p className="kind">OCTAVE, John Keells Group</p>
          <h2 className="serif">Incentives a distributor team can actually run</h2>
          <p className="body">
            KPI-driven incentive structures for an FMCG company that increased potential margins by{" "}
            <span className="figure">{octaveMargin}</span>, plus sales-incentive simulations to recapture lost sales
            in flood-affected outlets.
          </p>
          <span className="count">2 of 4</span>
        </article>
        <article className="proj right" data-i="2">
          <p className="kind">Generative AI builds</p>
          <h2 className="serif">Grounded in the source, not improvised</h2>
          <p className="body">
            A RAG study assistant locked to the CIMA syllabus, a CV reviewer with a senior-recruiter persona, and a
            neurodiversity support chatbot that reached the final of a Microsoft hackathon.
          </p>
          <span className="count">3 of 4</span>
        </article>
        <article className="proj left" data-i="3">
          <p className="kind">Co-founder and full-stack developer</p>
          <h2 className="serif">Layer1 Studio</h2>
          <p className="body">
            Web and mobile apps for gyms, shops, agencies, an author, an artist and sports teams. Four clients,
            thirteen projects delivered. Thirteen cubes, one for each.
          </p>
          <span className="count">4 of 4</span>
        </article>
      </section>

      <div className="spacer" aria-hidden="true">
        <div className="anchor" id="work" style={{ top: "250vh" }} />
      </div>
    </>
  );
}
