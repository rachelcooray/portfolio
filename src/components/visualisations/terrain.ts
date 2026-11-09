/*
 * The Atlas terrain. Plain three.js, mounted only in "gl" mode.
 * Each region is a stack of contour plates: a dark filled plate per level
 * with a contour line on its rim, so the hill reads like a laser-cut
 * topographic model. The selected region's contours turn lime.
 */
import * as THREE from "three";

export type TerrainRegion = { x: number; z: number; r: number; levels: number; seed: number };

export const TERRAIN_REGIONS: TerrainRegion[] = [
  { x: -3.4, z: -0.6, r: 3.0, levels: 11, seed: 1.3 },
  { x: 1.4, z: -1.8, r: 3.6, levels: 15, seed: 2.6 },
  { x: -1.6, z: 2.6, r: 2.5, levels: 9, seed: 4.1 },
  { x: 3.6, z: 2.4, r: 2.2, levels: 8, seed: 5.4 },
];

const STEP = 0.26;
const GLACIAL = new THREE.Color("#BED7F4");
const CORAL = new THREE.Color("#C7D42B");
const PLATE = new THREE.Color("#1E4C8E");

function ringPoints(cx: number, cz: number, rad: number, seed: number, n = 72): [number, number][] {
  const pts: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    const t = (k / n) * Math.PI * 2;
    const rr =
      rad *
      (1 + 0.16 * Math.sin(3 * t + seed) + 0.08 * Math.cos(5 * t + seed * 2.1) + 0.05 * Math.sin(7 * t + seed * 0.7));
    pts.push([cx + rr * Math.cos(t), cz + rr * Math.sin(t)]);
  }
  return pts;
}

export type TerrainHandle = { select: (i: number) => void; destroy: () => void };

export function mountTerrain(
  host: HTMLElement,
  opts: { initial: number; reduced: boolean; onHover: (i: number | null) => void; onPick: (i: number) => void; onReady: () => void },
): TerrainHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x2961b1, 16, 34);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const world = new THREE.Group();
  scene.add(world);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  // Base map: a faint grid the terrain sits on.
  const grid = new THREE.GridHelper(26, 26, 0x4c7ac0, 0x3a6bb5);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.45;
  grid.position.y = -0.01;
  world.add(grid);
  track(grid.geometry);
  track(grid.material as THREE.Material);

  const plateMat = track(new THREE.MeshBasicMaterial({ color: PLATE, side: THREE.DoubleSide }));
  type Level = { plate: THREE.Mesh; line: THREE.LineLoop; mat: THREE.LineBasicMaterial; y: number; f: number };
  const regions: { levels: Level[]; top: THREE.Vector3 }[] = [];

  TERRAIN_REGIONS.forEach((g, ri) => {
    const levels: Level[] = [];
    for (let l = 0; l < g.levels; l++) {
      const f = l / g.levels;
      const pts = ringPoints(g.x, g.z, g.r * (1 - f * 0.92), g.seed + l * 0.18);
      const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      const plateGeo = track(new THREE.ShapeGeometry(shape));
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.rotation.x = -Math.PI / 2;
      const y = l * STEP + ri * 0.004;
      plate.position.y = y;
      const lineGeo = track(new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, 0.004, z))));
      const mat = track(new THREE.LineBasicMaterial({ color: GLACIAL.clone(), transparent: true, opacity: 0.3 + f * 0.55 }));
      const line = new THREE.LineLoop(lineGeo, mat);
      line.position.y = y;
      world.add(plate, line);
      levels.push({ plate, line, mat, y, f });
    }
    regions.push({ levels, top: new THREE.Vector3(g.x, (g.levels - 1) * STEP + 0.1, g.z) });
  });

  // Tiny architecture at the foot of the enterprise region: the FMCG world.
  const edgeMat = track(new THREE.LineBasicMaterial({ color: "#64A8E5", transparent: true, opacity: 0.8 }));
  const boxes: [number, number, number, number, number][] = [
    [5.4, -3.6, 0.5, 0.4, 0.5],
    [6.1, -3.4, 0.3, 0.7, 0.3],
    [5.7, -2.7, 0.6, 0.25, 0.4],
    [6.5, -2.4, 0.35, 0.35, 0.35],
  ];
  boxes.forEach(([x, z, w, h, d]) => {
    const geo = track(new THREE.EdgesGeometry(track(new THREE.BoxGeometry(w, h, d))));
    const e = new THREE.LineSegments(geo, edgeMat);
    e.position.set(x, h / 2, z);
    world.add(e);
  });

  // The pathway that connects the four regions.
  const curve = new THREE.CatmullRomCurve3(
    [regions[0].top, new THREE.Vector3(-1, 3.6, -3.4), regions[1].top, new THREE.Vector3(4.6, 2.4, 0), regions[3].top, regions[2].top].map((v) => v.clone()),
  );
  const pathGeo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(160)));
  const pathMat = track(new THREE.LineDashedMaterial({ color: new THREE.Color("#D3C399"), dashSize: 0.12, gapSize: 0.22, transparent: true, opacity: 0.85 }));
  const path = new THREE.Line(pathGeo, pathMat);
  path.computeLineDistances();
  world.add(path);

  // Peak markers.
  const dotGeo = track(new THREE.SphereGeometry(0.07, 12, 12));
  const dots = regions.map((r) => {
    const m = new THREE.Mesh(dotGeo, track(new THREE.MeshBasicMaterial({ color: "#EFE6D3" })));
    m.position.copy(r.top);
    world.add(m);
    return m;
  });

  // Particles.
  const N = 420;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = Math.random() * 6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
  }
  const pGeo = track(new THREE.BufferGeometry());
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = track(new THREE.PointsMaterial({ color: "#EFE6D3", size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  let selected = opts.initial;
  let hovered: number | null = null;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, sx: -9999, sy: -9999 };
  let scrollP = 0;
  const start = performance.now();
  let raf = 0;
  let visible = true;

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    pointer.sx = e.clientX - r.left;
    pointer.sy = e.clientY - r.top;
  };
  const onLeave = () => {
    pointer.tx = 0;
    pointer.ty = 0;
    pointer.sx = -9999;
    if (hovered !== null) {
      hovered = null;
      opts.onHover(null);
    }
  };
  const onClick = () => {
    if (hovered !== null) opts.onPick(hovered);
  };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("click", onClick);
  const onScroll = () => {
    const r = host.getBoundingClientRect();
    scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  });
  io.observe(host);

  const tmp = new THREE.Vector3();
  let ready = false;

  function frame(now: number) {
    raf = 0;
    const t = (now - start) / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    // Reveal: plates rise level by level.
    const reveal = opts.reduced ? 1 : Math.min(1, t / 1.8);
    regions.forEach((r, ri) => {
      const on = ri === selected || ri === hovered;
      r.levels.forEach((lv, li) => {
        const local = opts.reduced ? 1 : Math.min(1, Math.max(0, reveal * 1.6 - (li / r.levels.length) * 0.6));
        const e = 1 - Math.pow(1 - local, 3);
        lv.plate.position.y = lv.y * e;
        lv.line.position.y = lv.y * e;
        lv.mat.color.lerp(on ? (ri === selected ? CORAL : GLACIAL) : GLACIAL, 0.08);
        const target = (ri === selected ? 0.5 + lv.f * 0.5 : on ? 0.45 + lv.f * 0.5 : 0.22 + lv.f * 0.5) * local;
        lv.mat.opacity += (target - lv.mat.opacity) * 0.1;
      });
      (dots[ri].material as THREE.MeshBasicMaterial).color.lerp(ri === selected ? CORAL : new THREE.Color("#EFE6D3"), 0.1);
      dots[ri].scale.setScalar(ri === selected ? 1.6 : 1);
    });
    pathMat.opacity = 0.85 * reveal;

    // Camera: a slow, small drift plus cursor parallax; scrolling lifts it.
    const drift = opts.reduced ? 0 : Math.sin(t * 0.12) * 0.12;
    const ang = 0.55 + pointer.x * 0.18 + drift;
    const dist = 14.5 + scrollP * 7;
    camera.position.set(Math.sin(ang) * dist, 8.2 - pointer.y * 1.2 + scrollP * 6, Math.cos(ang) * dist);
    camera.lookAt(0.6, 1.1 - scrollP * 0.8, 0.4);

    if (!opts.reduced) {
      const p = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < N; i++) {
        let y = p.getY(i) + 0.003;
        if (y > 6) y = 0;
        p.setY(i, y);
      }
      p.needsUpdate = true;
    }

    // Hover: nearest projected peak within 90px of the cursor.
    const w = host.clientWidth;
    const h = host.clientHeight;
    let best: number | null = null;
    let bestD = 90;
    regions.forEach((r, ri) => {
      tmp.copy(r.top).project(camera);
      const sx = (tmp.x * 0.5 + 0.5) * w;
      const sy = (-tmp.y * 0.5 + 0.5) * h;
      const d = Math.hypot(sx - pointer.sx, sy - pointer.sy);
      if (d < bestD) {
        bestD = d;
        best = ri;
      }
    });
    if (best !== hovered) {
      hovered = best;
      host.style.cursor = best === null ? "" : "pointer";
      opts.onHover(best);
    }

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      opts.onReady();
    }
    if (visible) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    select(i: number) {
      selected = i;
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
