"use client";

import { useEffect, useRef } from "react";

// A live 3D garden behind the whole site: leaves, pebbles, rings and
// berries in the site palette, drifting in depth. The pointer moves the
// camera, scrolling travels down through them. Purely decorative: it is
// hidden from assistive tech, never starts with reduced motion, and the
// site reads the same without it.
const PALETTE = [0x46521a, 0x8c9a3a, 0xc7d42b, 0xd3c399, 0x7a6142, 0xb9a6de, 0xdde3b0, 0xb9a6de, 0x8c9a3a];

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Scene3D() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const root = document.documentElement;
    const cores = navigator.hardwareConcurrency || 4;
    if (root.classList.contains("rm") || cores <= 2) return;

    let cancelled = false;
    let dispose = () => {};

    import("three").then((THREE) => {
      if (cancelled) return;
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return;
      }
      const small = window.innerWidth < 760;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xfaf7ef, 12, 35);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
      camera.position.set(0, 0, 10);

      scene.add(new THREE.HemisphereLight(0xfffaf0, 0x7a6142, 1.5));
      const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
      sun.position.set(5, 8, 6);
      scene.add(sun);
      const fill = new THREE.PointLight(0xb9a6de, 30, 40);
      fill.position.set(-6, -2, 6);
      scene.add(fill);

      // Geometry kit
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -1);
      leafShape.quadraticCurveTo(0.95, -0.15, 0, 1.25);
      leafShape.quadraticCurveTo(-0.95, -0.15, 0, -1);
      const leaf = new THREE.ExtrudeGeometry(leafShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 20 });
      leaf.center();
      const pebble = new THREE.SphereGeometry(1, 40, 28);
      const ring = new THREE.TorusGeometry(1, 0.085, 16, 72);
      const berry = new THREE.SphereGeometry(0.45, 28, 20);
      const geos = [leaf, leaf, leaf, pebble, pebble, ring, berry, berry];

      const mats = PALETTE.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.42, metalness: 0.08 }));

      const SPAN = 26;
      const HALF = SPAN / 2;
      const rand = rng(20261110);
      const count = small ? 18 : 40;
      type Item = { mesh: import("three").Mesh; u: number; y: number; z: number; base: import("three").Vector3; rs: [number, number, number]; bob: number; phase: number; delay: number };
      const items: Item[] = [];
      for (let i = 0; i < count; i++) {
        const gi = Math.floor(rand() * geos.length);
        const geo = geos[gi];
        const near = rand() < 0.42;
        const side = rand() < 0.5 ? -1 : 1;
        // Reading comes first: every shape keeps to the side margins, so
        // nothing passes behind the text column. Far ones sit in the mist.
        const u = near ? side * (0.92 + rand() * 0.3) : side * (0.84 + rand() * 0.42);
        const z = near ? -3 + rand() * 6 : -23 + rand() * 10;
        const size = near ? 0.34 + rand() * 0.6 : 0.8 + rand() * 1.3;
        const base = new THREE.Vector3(size, size, size);
        if (geo === pebble) base.set(size, size * (0.55 + rand() * 0.25), size * (0.7 + rand() * 0.3));
        const mat = geo === berry ? mats[rand() < 0.6 ? 2 : 5] : mats[Math.floor(rand() * mats.length)];
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
        mesh.scale.setScalar(0.0001);
        scene.add(mesh);
        items.push({
          mesh,
          u,
          y: -HALF + rand() * SPAN,
          z,
          base,
          rs: [(rand() - 0.5) * 0.5, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.3],
          bob: 0.3 + rand() * 0.5,
          phase: rand() * 6.28,
          delay: 0.2 + rand() * 1.4,
        });
      }

      let w = 0;
      let h = 0;
      const tan = Math.tan((40 * Math.PI) / 360);
      const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        for (const it of items) {
          const halfW = tan * (10 - it.z) * camera.aspect;
          it.mesh.position.x = it.u * halfW;
          it.mesh.position.z = it.z;
        }
      };
      resize();
      window.addEventListener("resize", resize);

      let px = 0;
      let py = 0;
      const onPointer = (e: PointerEvent) => {
        px = (e.clientX / w) * 2 - 1;
        py = (e.clientY / h) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let lastScroll = window.scrollY;
      let spin = 0;
      let camY = -lastScroll * 0.0042;
      let cx = 0;
      let cy = 0;
      let raf = 0;
      let running = true;
      const clock = new THREE.Clock();
      const ease = (x: number) => 1 - Math.pow(1 - x, 4);

      const frame = () => {
        if (!running) return;
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        const sy = window.scrollY;
        // Full strength over the hero, then it steps back behind the content.
        canvas.style.setProperty("--dim", Math.min(1, sy / (h * 0.7)).toFixed(3));
        spin += Math.min(Math.abs(sy - lastScroll), 120) * 0.0009;
        spin *= 0.92;
        lastScroll = sy;
        camY += (-sy * 0.0042 - camY) * 0.09;
        cx += (px - cx) * 0.04;
        cy += (py - cy) * 0.04;
        camera.position.set(cx * 0.9, camY - cy * 0.5, 10);
        camera.rotation.set(cy * 0.03, -cx * 0.045, 0);

        for (const it of items) {
          let rel = (((it.y - camY + HALF) % SPAN) + SPAN) % SPAN;
          rel -= HALF;
          it.mesh.position.y = camY + rel + Math.sin(t * it.bob + it.phase) * 0.28;
          const k = 1 + spin * 6;
          it.mesh.rotation.x += it.rs[0] * dt * k;
          it.mesh.rotation.y += it.rs[1] * dt * k;
          it.mesh.rotation.z += it.rs[2] * dt * k;
          const s = ease(Math.min(1, Math.max(0, (t - it.delay) / 1.4)));
          it.mesh.scale.set(it.base.x * s + 0.0001, it.base.y * s + 0.0001, it.base.z * s + 0.0001);
        }
        renderer.render(scene, camera);
      };
      const onVis = () => {
        const on = !document.hidden;
        if (on && !running) {
          running = true;
          clock.getDelta();
          frame();
        } else if (!on) {
          running = false;
          cancelAnimationFrame(raf);
        }
      };
      document.addEventListener("visibilitychange", onVis);
      canvas.classList.add("on");
      frame();

      dispose = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVis);
        [leaf, pebble, ring, berry].forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return <canvas ref={ref} className="scene3d" aria-hidden="true" />;
}
