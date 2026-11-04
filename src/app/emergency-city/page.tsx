"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./emergency-city.module.css";

type CameraMode = "third" | "first";

export default function EmergencyCityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<CameraMode>("third");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let engine: { dispose: () => void } | undefined;
    let cleanup: (() => void) | undefined;

    async function start() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const B = await import("@babylonjs/core");
        if (disposed) return;

        const scene = new B.Scene(new B.NullEngine());
        scene.dispose();
        const webEngine = new B.Engine(canvas, true, {
          preserveDrawingBuffer: false,
          stencil: true,
          antialias: true,
          adaptToDeviceRatio: true,
        });
        engine = webEngine;
        const world = new B.Scene(webEngine);
        world.clearColor = new B.Color4(0.055, 0.075, 0.11, 1);
        world.fogMode = B.Scene.FOGMODE_EXP2;
        world.fogDensity = 0.0022;
        world.fogColor = new B.Color3(0.22, 0.29, 0.38);

        const hemi = new B.HemisphericLight("sky-fill", new B.Vector3(0, 1, 0), world);
        hemi.intensity = 0.72;
        const sun = new B.DirectionalLight("late-afternoon-sun", new B.Vector3(-0.45, -1, 0.3), world);
        sun.position = new B.Vector3(80, 110, -60);
        sun.intensity = 1.35;

        const mat = (name: string, color: B.Color3, rough = 0.8) => {
          const m = new B.PBRMaterial(name, world);
          m.albedoColor = color;
          m.metallic = 0.05;
          m.roughness = rough;
          return m;
        };
        const asphalt = mat("asphalt-greybox", new B.Color3(0.075, 0.09, 0.11), 0.94);
        const sidewalk = mat("pavement-greybox", new B.Color3(0.34, 0.36, 0.37));
        const concrete = [0.25, 0.31, 0.38, 0.43].map((v, i) => mat("building-" + i, new B.Color3(v, v * 1.04, v * 1.1)));
        const glass = mat("blue-glass-placeholder", new B.Color3(0.08, 0.19, 0.25), 0.22);
        const lane = mat("road-markings", new B.Color3(0.83, 0.81, 0.72));
        const green = mat("player-marker", new B.Color3(0.55, 0.95, 0.29), 0.45);

        const ground = B.MeshBuilder.CreateGround("city-ground", { width: 260, height: 260 }, world);
        ground.position.y = -0.12;
        ground.material = sidewalk;

        const road = B.MeshBuilder.CreateGround("main-avenue", { width: 22, height: 230 }, world);
        road.position.y = 0.015;
        road.material = asphalt;
        const crossRoad = B.MeshBuilder.CreateGround("cross-avenue", { width: 230, height: 20 }, world);
        crossRoad.position.y = 0.02;
        crossRoad.material = asphalt;

        for (let z = -105; z <= 105; z += 10) {
          const dash = B.MeshBuilder.CreateBox("center-line", { width: 0.22, height: 0.025, depth: 4.8 }, world);
          dash.position.set(0, 0.06, z);
          dash.material = lane;
        }
        for (let x = -105; x <= 105; x += 10) {
          const dash = B.MeshBuilder.CreateBox("cross-line", { width: 4.8, height: 0.025, depth: 0.22 }, world);
          dash.position.set(x, 0.065, 0);
          dash.material = lane;
        }

        const seeded = (n: number) => {
          const x = Math.sin(n * 127.1) * 43758.5453;
          return x - Math.floor(x);
        };
        let index = 0;
        for (let x = -90; x <= 90; x += 30) {
          for (let z = -90; z <= 90; z += 30) {
            if (Math.abs(x) < 20 || Math.abs(z) < 19) continue;
            const width = 13 + seeded(index + 2) * 5;
            const depth = 13 + seeded(index + 4) * 5;
            const height = 13 + seeded(index + 6) * 42;
            const building = B.MeshBuilder.CreateBox("city-block-" + index, { width, depth, height }, world);
            building.position.set(x + (seeded(index + 9) - 0.5) * 5, height / 2, z + (seeded(index + 11) - 0.5) * 5);
            building.material = concrete[index % concrete.length];
            const roof = B.MeshBuilder.CreateBox("roof-" + index, { width: width + 0.2, depth: depth + 0.2, height: 0.45 }, world);
            roof.position.set(building.position.x, height + 0.22, building.position.z);
            roof.material = sidewalk;

            const floors = Math.max(2, Math.floor(height / 4));
            for (let floor = 0; floor < floors; floor++) {
              for (let side = -1; side <= 1; side++) {
                const window = B.MeshBuilder.CreateBox("facade-glass", { width: 2.1, height: 1.35, depth: 0.08 }, world);
                window.position.set(building.position.x + side * (width / 3.2), floor * 3.5 + 2.2, building.position.z - depth / 2 - 0.045);
                window.material = glass;
              }
            }
            index++;
          }
        }

        for (let side of [-1, 1]) {
          for (let z = -100; z <= 100; z += 25) {
            const pole = B.MeshBuilder.CreateCylinder("street-light-pole", { height: 7, diameter: 0.16 }, world);
            pole.position.set(side * 13.5, 3.5, z);
            pole.material = mat("street-metal-" + side, new B.Color3(0.12, 0.14, 0.17), 0.4);
            const arm = B.MeshBuilder.CreateBox("street-light-arm", { width: 2, height: 0.14, depth: 0.14 }, world);
            arm.position.set(side * 14.4, 6.7, z);
            arm.material = pole.material;
          }
        }

        const player = B.MeshBuilder.CreateCapsule("player-placeholder", { height: 1.8, radius: 0.34 }, world);
        player.position.set(2.5, 0.9, 15);
        player.material = green;

        const third = new B.ArcRotateCamera("third-person", -Math.PI / 2, 1.12, 11, player.position.clone(), world);
        third.lowerRadiusLimit = 4;
        third.upperRadiusLimit = 18;
        third.wheelPrecision = 45;
        third.attachControl(canvas, true);
        const first = new B.UniversalCamera("first-person", new B.Vector3(2.5, 1.55, 15), world);
        first.speed = 0;
        first.inertia = 0;
        first.minZ = 0.1;
        first.attachControl(canvas, true);
        first.inputs.clear();
        world.activeCamera = third;

        const keys = new Set<string>();
        const onDown = (event: KeyboardEvent) => { keys.add(event.key.toLowerCase()); };
        const onUp = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        const observer = world.onBeforeRenderObservable.add(() => {
          const dt = Math.min(webEngine.getDeltaTime() / 1000, 0.04);
          const forward = (keys.has("w") || keys.has("z") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
          const strafe = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("q") || keys.has("arrowleft") ? 1 : 0);
          if (forward || strafe) {
            const direction = new B.Vector3(strafe, 0, forward);
            direction.normalize();
            const angle = modeRef.current === "third" ? third.alpha : first.rotation.y;
            const dx = Math.cos(angle) * direction.x + Math.sin(angle) * direction.z;
            const dz = -Math.sin(angle) * direction.x + Math.cos(angle) * direction.z;
            player.position.x += dx * dt * 8;
            player.position.z += dz * dt * 8;
          }
          if (modeRef.current === "third") {
            third.target.copyFrom(player.position);
          } else {
            first.position.set(player.position.x, player.position.y + 0.55, player.position.z);
          }
        });
        cleanup = () => {
          window.removeEventListener("keydown", onDown);
          window.removeEventListener("keyup", onUp);
          world.onBeforeRenderObservable.remove(observer);
          world.dispose();
        };
        webEngine.runRenderLoop(() => world.render());
        window.addEventListener("resize", webEngine.resize);
        const priorCleanup = cleanup;
        cleanup = () => {
          window.removeEventListener("resize", webEngine.resize);
          priorCleanup?.();
        };
        if (!disposed) setLoaded(true);
      } catch (e) {
        if (!disposed) setError(e instanceof Error ? e.message : "Impossible de charger le moteur 3D.");
      }
    }
    start();
    return () => {
      disposed = true;
      cleanup?.();
      engine?.dispose();
    };
  }, []);

  const modeRef = useRef<CameraMode>("third");
  useEffect(() => { modeRef.current = mode; }, [mode]);

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}><span>N</span> NEXUS <b>EMERGENCY CITY</b></a>
        <div className={styles.build}>TECH PREVIEW <i /> 0.1.0</div>
      </header>
      <section className={styles.viewport}>
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Aperçu 3D de la métropole Nexus Emergency City" />
        <div className={styles.hudTop}><span><i /> CITY BLOCKOUT / METRO DISTRICT 01</span><span>EARLY DEVELOPMENT BUILD</span></div>
        <div className={styles.titleCard}><small>NEXUS SIMULATION PROJECT</small><h1>EMERGENCY<br /><em>CITY</em></h1><p>UNE MÉTROPOLE. DES MILLIERS D'HISTOIRES.</p></div>
        <div className={styles.hudBottom}>
          <div className={styles.status}>{error ? "3D ENGINE ERROR" : loaded ? "WORLD ONLINE" : "LOADING CITY"} <i className={error ? styles.error : ""} /></div>
          <div className={styles.controls}>ZQSD / WASD <span>MOVE</span> · MOUSE <span>LOOK</span></div>
          <div className={styles.cameraSwitch}>
            <button className={mode === "third" ? styles.active : ""} onClick={() => setMode("third")}>3RD PERSON</button>
            <button className={mode === "first" ? styles.active : ""} onClick={() => setMode("first")}>1ST PERSON</button>
          </div>
        </div>
        {error && <div className={styles.errorPanel}>Le moteur 3D n'a pas pu démarrer : {error}</div>}
      </section>
      <footer className={styles.footer}><span>PROTOTYPE 0.1 — GÉOMÉTRIE TEMPORAIRE</span><span>LES GRAPHISMES FINAUX SERONT CRÉÉS AVEC DES ASSETS 3D ORIGINAUX.</span></footer>
    </main>
  );
}
