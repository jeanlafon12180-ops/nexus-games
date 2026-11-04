"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./emergency-city.module.css";

type CameraMode = "third" | "first";

export default function EmergencyCityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<CameraMode>("third");
  const [driving, setDriving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const cameraBundleRef = useRef<{ world: import("@babylonjs/core").Scene; first: import("@babylonjs/core").UniversalCamera; third: import("@babylonjs/core").ArcRotateCamera } | null>(null);

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
        world.fogDensity = 0.00155;
        world.fogColor = new B.Color3(0.22, 0.29, 0.38);

        const hemi = new B.HemisphericLight("sky-fill", new B.Vector3(0, 1, 0), world);
        hemi.intensity = 0.78;
        const sun = new B.DirectionalLight("late-afternoon-sun", new B.Vector3(-0.45, -1, 0.3), world);
        sun.position = new B.Vector3(120, 160, -90);
        sun.intensity = 1.45;

        const mat = (name: string, color: B.Color3, rough = 0.8, metallic = 0.04) => {
          const m = new B.PBRMaterial(name, world);
          m.albedoColor = color;
          m.metallic = metallic;
          m.roughness = rough;
          return m;
        };
        const asphalt = mat("road-asphalt", new B.Color3(0.065, 0.078, 0.09), 0.96);
        const sidewalk = mat("sidewalk-stone", new B.Color3(0.37, 0.39, 0.4), 0.9);
        const curb = mat("curb-concrete", new B.Color3(0.52, 0.53, 0.51));
        const lane = mat("road-markings", new B.Color3(0.86, 0.83, 0.72));
        const glass = mat("facade-glass", new B.Color3(0.055, 0.16, 0.22), 0.2, 0.28);
        const darkGlass = mat("dark-glass", new B.Color3(0.025, 0.07, 0.095), 0.18, 0.35);
        const roofMat = mat("roof-concrete", new B.Color3(0.25, 0.27, 0.29));
        const metal = mat("street-metal", new B.Color3(0.1, 0.12, 0.14), 0.38, 0.72);
        const parkGrass = mat("park-grass", new B.Color3(0.12, 0.27, 0.16), 1);
        const treeTrunk = mat("tree-trunk", new B.Color3(0.22, 0.13, 0.075));
        const treeLeaf = mat("tree-canopy", new B.Color3(0.13, 0.31, 0.19), 0.95);
        const water = mat("canal-water", new B.Color3(0.035, 0.19, 0.24), 0.18, 0.48);
        const playerMat = mat("player-marker", new B.Color3(0.55, 0.95, 0.29), 0.42, 0.12);

        const ground = B.MeshBuilder.CreateGround("metropolitan-terrain", { width: 430, height: 430 }, world);
        ground.position.y = -0.16;
        ground.material = parkGrass;

        const seeded = (n: number) => {
          const x = Math.sin(n * 127.1 + 17.7) * 43758.5453;
          return x - Math.floor(x);
        };
        const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: B.Material) => {
          const mesh = B.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, world);
          mesh.position.set(x, y, z);
          mesh.material = material;
          return mesh;
        };

        // A six-by-six street grid creates a navigable metropolitan road network.
        const roadLines = [-192, -128, -64, 0, 64, 128, 192];
        for (const line of roadLines) {
          const vertical = B.MeshBuilder.CreateGround("north-south-avenue", { width: 21, height: 410 }, world);
          vertical.position.set(line, 0.015, 0);
          vertical.material = asphalt;
          const horizontal = B.MeshBuilder.CreateGround("east-west-avenue", { width: 410, height: 21 }, world);
          horizontal.position.set(0, 0.02, line);
          horizontal.material = asphalt;

          for (const side of [-1, 1]) {
            const pavementV = B.MeshBuilder.CreateGround("avenue-sidewalk", { width: 3.2, height: 410 }, world);
            pavementV.position.set(line + side * 12.2, 0.035, 0);
            pavementV.material = sidewalk;
            const pavementH = B.MeshBuilder.CreateGround("avenue-sidewalk", { width: 410, height: 3.2 }, world);
            pavementH.position.set(0, 0.04, line + side * 12.2);
            pavementH.material = sidewalk;
            const curbV = B.MeshBuilder.CreateBox("avenue-curb", { width: 0.22, height: 0.22, depth: 410 }, world);
            curbV.position.set(line + side * 10.55, 0.12, 0);
            curbV.material = curb;
            const curbH = B.MeshBuilder.CreateBox("avenue-curb", { width: 410, height: 0.22, depth: 0.22 }, world);
            curbH.position.set(0, 0.12, line + side * 10.55);
            curbH.material = curb;
          }
        }

        // Dashed lane dividers and zebra crossings at every major intersection.
        for (const line of roadLines) {
          for (let p = -184; p <= 184; p += 13) {
            if (roadLines.some(cross => Math.abs(p - cross) < 13)) continue;
            box("lane-dash-ns", 0.2, 0.035, 5.2, line, 0.075, p, lane);
            box("lane-dash-ew", 5.2, 0.035, 0.2, p, 0.08, line, lane);
          }
          for (const cross of roadLines) {
            for (let stripe = -1; stripe <= 1; stripe++) {
              box("zebra-ns", 5.2, 0.035, 0.72, line + stripe * 1.8, 0.085, cross + 8.5, lane);
              box("zebra-ew", 0.72, 0.035, 5.2, cross + 8.5, 0.09, line + stripe * 1.8, lane);
            }
          }
        }

        const districtMaterials = [
          mat("downtown-stone", new B.Color3(0.34, 0.38, 0.42)),
          mat("business-tower", new B.Color3(0.2, 0.29, 0.35), 0.48, 0.18),
          mat("residential-brick", new B.Color3(0.42, 0.27, 0.22)),
          mat("industrial-metal", new B.Color3(0.29, 0.32, 0.31), 0.7, 0.24),
          mat("civic-sandstone", new B.Color3(0.55, 0.48, 0.36)),
        ];

        const parkBlocks = new Set(["-64,64", "64,-64"]);
        let buildingId = 0;
        for (let gx = -2; gx <= 2; gx++) {
          for (let gz = -2; gz <= 2; gz++) {
            const blockX = gx * 64;
            const blockZ = gz * 64;
            if (parkBlocks.has(blockX + "," + blockZ)) {
              const park = B.MeshBuilder.CreateGround("riverside-city-park", { width: 43, height: 43 }, world);
              park.position.set(blockX, 0.055, blockZ);
              park.material = parkGrass;
              for (let t = 0; t < 18; t++) {
                const tx = blockX + (seeded(t + gx * 13 + gz * 7) - 0.5) * 34;
                const tz = blockZ + (seeded(t + 51 + gx * 3) - 0.5) * 34;
                const trunk = B.MeshBuilder.CreateCylinder("park-tree-trunk", { height: 2.6, diameter: 0.42 }, world);
                trunk.position.set(tx, 1.3, tz);
                trunk.material = treeTrunk;
                const crown = B.MeshBuilder.CreateSphere("park-tree-crown", { diameter: 3.5 + seeded(t + 83) * 1.5, segments: 7 }, world);
                crown.position.set(tx, 3.6, tz);
                crown.material = treeLeaf;
              }
              for (let pathIndex = -1; pathIndex <= 1; pathIndex++) {
                const path = B.MeshBuilder.CreateGround("park-walking-path", { width: 2.2, height: 40 }, world);
                path.position.set(blockX + pathIndex * 10, 0.075, blockZ);
                path.material = sidewalk;
              }
              continue;
            }

            const district = gx === 0 && gz === 0 ? 1 : gx === 2 || gz === 2 ? 3 : gx < 0 && gz < 0 ? 2 : gx === 0 ? 4 : 0;
            const count = district === 1 ? 5 : 4;
            for (let b = 0; b < count; b++) {
              const col = b % 2;
              const row = Math.floor(b / 2);
              const width = (district === 1 ? 13 : 15) + seeded(buildingId + 4) * 5;
              const depth = 13 + seeded(buildingId + 9) * 5;
              let height = district === 1 ? 48 + seeded(buildingId + 12) * 70 : district === 3 ? 12 + seeded(buildingId + 12) * 12 : 18 + seeded(buildingId + 12) * 34;
              if (gx === 0 && gz === 0 && b === 4) height = 112;
              const x = blockX + (col === 0 ? -12 : 12) + (seeded(buildingId + 17) - 0.5) * 3;
              const z = blockZ + (row === 0 ? -12 : 12) + (seeded(buildingId + 21) - 0.5) * 3;
              const building = box("metropolitan-building-" + buildingId, width, height, depth, x, height / 2, z, districtMaterials[district]);
              const roof = box("building-roof-" + buildingId, width + 0.5, 0.5, depth + 0.5, x, height + 0.25, z, roofMat);
              roof.isPickable = false;

              // Repeated facade window bands; restrained counts keep the browser scene responsive.
              const floors = Math.min(18, Math.floor(height / 4.2));
              for (let floor = 0; floor < floors; floor++) {
                for (let side = -1; side <= 1; side++) {
                  const winWidth = Math.max(1.25, width / 5);
                  box("front-window", winWidth, 1.45, 0.09, x + side * width / 3.1, floor * 4.1 + 2.3, z - depth / 2 - 0.055, district === 1 ? darkGlass : glass);
                  box("side-window", 0.09, 1.45, Math.max(1.25, depth / 5), x + width / 2 + 0.055, floor * 4.1 + 2.3, z + side * depth / 3.1, glass);
                }
              }
              buildingId++;
            }
          }
        }

        // A canal and promenade establish a recognisable waterfront district.
        const canal = B.MeshBuilder.CreateGround("east-waterfront-canal", { width: 24, height: 420 }, world);
        canal.position.set(216, -0.035, 0);
        canal.material = water;
        for (const side of [-1, 1]) {
          const promenade = B.MeshBuilder.CreateGround("canal-promenade", { width: 5, height: 420 }, world);
          promenade.position.set(216 + side * 15, 0.04, 0);
          promenade.material = sidewalk;
          for (let z = -180; z <= 180; z += 30) {
            const lamp = B.MeshBuilder.CreateCylinder("waterfront-lamp", { height: 5.5, diameter: 0.13 }, world);
            lamp.position.set(216 + side * 17, 2.75, z);
            lamp.material = metal;
            const head = B.MeshBuilder.CreateSphere("waterfront-lamp-head", { diameter: 0.55, segments: 8 }, world);
            head.position.set(216 + side * 17, 5.55, z);
            head.material = lane;
          }
        }

        // Street furniture and trees line the principal boulevards.
        for (const line of roadLines) {
          for (let z = -176; z <= 176; z += 32) {
            for (const side of [-1, 1]) {
              const pole = B.MeshBuilder.CreateCylinder("streetlight-pole", { height: 8, diameter: 0.18 }, world);
              pole.position.set(line + side * 14.3, 4, z);
              pole.material = metal;
              const arm = box("streetlight-arm", 1.7, 0.15, 0.15, line + side * 13.55, 7.7, z, metal);
              arm.isPickable = false;
            }
          }
        }

        // Civic landmark: a distinctive transit and emergency-services hub.
        const hubBase = box("central-civic-hub", 26, 10, 22, 0, 5, 0, districtMaterials[4]);
        const hubRoof = box("central-hub-roof", 29, 1.1, 25, 0, 10.5, 0, metal);
        const hubGlass = box("central-hub-glass-front", 18, 6.5, 0.16, 0, 5, -11.1, glass);
        const hubSign = box("central-hub-sign", 8, 1.2, 0.25, 0, 9, -11.25, lane);
        hubBase.isPickable = hubRoof.isPickable = hubGlass.isPickable = hubSign.isPickable = false;

        const player = B.MeshBuilder.CreateCapsule("player-placeholder", { height: 1.8, radius: 0.34 }, world);
        player.position.set(5, 0.9, 18);
        player.material = playerMat;

        // Original procedural civilian hatchback for the 0.3 driving prototype.
        const carRoot = new B.TransformNode("civilian-hatchback", world);
        carRoot.position.set(2, 0, 18);
        const carPaint = mat("car-deep-blue-paint", new B.Color3(0.035, 0.19, 0.38), 0.28, 0.72);
        const tireMat = mat("car-rubber", new B.Color3(0.018, 0.022, 0.027), 0.98);
        const rimMat = mat("car-alloy", new B.Color3(0.48, 0.53, 0.57), 0.24, 0.86);
        const lampMat = mat("car-headlights", new B.Color3(0.92, 0.86, 0.65), 0.22, 0.18);
        const tailMat = mat("car-tail-lights", new B.Color3(0.62, 0.025, 0.018), 0.3, 0.12);
        const carPart = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: B.Material) => {
          const mesh = B.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, world);
          mesh.parent = carRoot; mesh.position.set(x, y, z); mesh.material = material; return mesh;
        };
        carPart("car-lower-body", 2.05, 0.62, 4.15, 0, 0.72, 0, carPaint);
        carPart("car-cabin", 1.72, 0.78, 2.15, 0, 1.34, -0.18, carPaint);
        carPart("car-windshield", 1.55, 0.58, 0.07, 0, 1.39, 0.91, darkGlass);
        carPart("car-rear-window", 1.48, 0.52, 0.07, 0, 1.39, -1.27, darkGlass);
        for (const side of [-1, 1]) {
          carPart("car-side-window", 0.07, 0.5, 1.45, side * 0.87, 1.38, -0.18, darkGlass);
          carPart("car-headlamp", 0.42, 0.2, 0.08, side * 0.67, 0.82, 2.1, lampMat);
          carPart("car-tail-lamp", 0.38, 0.22, 0.08, side * 0.68, 0.84, -2.1, tailMat);
        }
        const wheels: B.Mesh[] = [];
        for (const x of [-1.02, 1.02]) for (const z of [-1.35, 1.35]) {
          const wheel = B.MeshBuilder.CreateCylinder("car-wheel", { diameter: 0.78, height: 0.28, tessellation: 20 }, world);
          wheel.parent = carRoot; wheel.position.set(x, 0.42, z); wheel.rotation.z = Math.PI / 2; wheel.material = tireMat; wheels.push(wheel);
          const rim = B.MeshBuilder.CreateCylinder("car-wheel-alloy", { diameter: 0.39, height: 0.295, tessellation: 16 }, world);
          rim.parent = carRoot; rim.position.copyFrom(wheel.position); rim.rotation.z = Math.PI / 2; rim.material = rimMat; wheels.push(rim);
        }

        const third = new B.ArcRotateCamera("third-person", -Math.PI / 2, 1.12, 13, player.position.clone(), world);
        third.lowerRadiusLimit = 4;
        third.upperRadiusLimit = 24;
        third.wheelPrecision = 45;
        third.attachControl(canvas, true);
        const first = new B.UniversalCamera("first-person", new B.Vector3(5, 1.55, 18), world);
        first.speed = 0;
        first.inertia = 0;
        first.minZ = 0.1;
        first.attachControl(canvas, true);
        first.inputs.clear();
        world.activeCamera = third;
        cameraBundleRef.current = { world, first, third };

        const keys = new Set<string>();
        let carSpeed = 0;
        const onDown = (event: KeyboardEvent) => { keys.add(event.key.toLowerCase()); };
        const onUp = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        const observer = world.onBeforeRenderObservable.add(() => {
          const dt = Math.min(webEngine.getDeltaTime() / 1000, 0.04);
          const forward = (keys.has("w") || keys.has("z") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
          const strafe = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("q") || keys.has("arrowleft") ? 1 : 0);
          let followed = player.position;
          if (drivingRef.current) {
            const throttle = (keys.has("w") || keys.has("z") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
            const steering = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("q") || keys.has("arrowleft") ? 1 : 0);
            carSpeed += throttle * dt * 10; carSpeed *= Math.pow(0.985, dt * 60); carSpeed = B.Scalar.Clamp(carSpeed, -7, 17);
            carRoot.rotation.y += steering * dt * Math.min(Math.abs(carSpeed) / 5, 1.2) * Math.sign(carSpeed || 1) * 1.65;
            carRoot.position.x = B.Scalar.Clamp(carRoot.position.x + Math.sin(carRoot.rotation.y) * carSpeed * dt, -205, 205);
            carRoot.position.z = B.Scalar.Clamp(carRoot.position.z + Math.cos(carRoot.rotation.y) * carSpeed * dt, -205, 205);
            wheels.forEach((wheel) => { wheel.rotation.x += carSpeed * dt * 1.8; }); followed = carRoot.position;
          } else if (forward || strafe) {
            const direction = new B.Vector3(strafe, 0, forward); direction.normalize();
            const angle = modeRef.current === "third" ? third.alpha : first.rotation.y;
            const dx = Math.cos(angle) * direction.x + Math.sin(angle) * direction.z;
            const dz = -Math.sin(angle) * direction.x + Math.cos(angle) * direction.z;
            player.position.x = B.Scalar.Clamp(player.position.x + dx * dt * 9, -205, 205);
            player.position.z = B.Scalar.Clamp(player.position.z + dz * dt * 9, -205, 205);
          }
          if (modeRef.current === "third") third.target.copyFrom(followed);
          else if (drivingRef.current) { first.position.set(carRoot.position.x, 1.48, carRoot.position.z); first.rotation.y = carRoot.rotation.y; }
          else first.position.set(player.position.x, player.position.y + 0.55, player.position.z);
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
        driveBundleRef.current = { player };
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
      cameraBundleRef.current = null;
      driveBundleRef.current = null;
    };
  }, []);

  const modeRef = useRef<CameraMode>("third");
  const driveBundleRef = useRef<{ player: import("@babylonjs/core").Mesh } | null>(null);
  const drivingRef = useRef(false);
  useEffect(() => { drivingRef.current = driving; const bundle = driveBundleRef.current; if (bundle) bundle.player.isVisible = !driving; }, [driving]);
  useEffect(() => {
    modeRef.current = mode;
    const cameras = cameraBundleRef.current;
    if (cameras) cameras.world.activeCamera = mode === "third" ? cameras.third : cameras.first;
  }, [mode]);

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}><span>N</span> NEXUS <b>EMERGENCY CITY</b></a>
        <div className={styles.build}>CITY UPDATE <i /> 0.3.0</div>
      </header>
      <section className={styles.viewport}>
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Aperçu 3D de la métropole Nexus Emergency City" />
        <div className={styles.hudTop}><span><i /> METRO DISTRICT / CITY BUILD 0.3</span><span>25 CITY BLOCKS · DRIVEABLE CIVILIAN CAR</span></div>
        <div className={styles.titleCard}><small>NEXUS SIMULATION PROJECT</small><h1>EMERGENCY<br /><em>CITY</em></h1><p>UNE MÉTROPOLE. DES MILLIERS D'HISTOIRES.</p></div>
        <div className={styles.hudBottom}>
          <div className={styles.status}>{error ? "3D ENGINE ERROR" : loaded ? "CITY ONLINE" : "LOADING CITY"} <i className={error ? styles.error : ""} /></div>
          <div className={styles.controls}>ZQSD / WASD <span>{driving ? "DRIVE" : "MOVE"}</span> · MOUSE <span>LOOK</span></div>
          <div className={styles.cameraSwitch}>
            <button className={driving ? styles.active : ""} onClick={() => setDriving(!driving)}>{driving ? "EXIT CAR" : "DRIVE CAR"}</button>
            <button className={mode === "third" ? styles.active : ""} onClick={() => setMode("third")}>3RD PERSON</button>
            <button className={mode === "first" ? styles.active : ""} onClick={() => setMode("first")}>1ST PERSON</button>
          </div>
        </div>
        {error && <div className={styles.errorPanel}>Le moteur 3D n'a pas pu démarrer : {error}</div>}
      </section>
      <footer className={styles.footer}><span>BUILD 0.3 — VEHICLE FOUNDATION</span><span>VOITURE CIVILE TESTABLE · CONDUITE PROTOTYPE · CAMÉRAS PIÉTON ET VÉHICULE.</span></footer>
    </main>
  );
}
