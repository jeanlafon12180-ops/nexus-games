"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./emergency-city.module.css";

type CameraMode = "third" | "first";
type Mission = { id: string; role: string; title: string; detail: string; x: number; z: number };
const missions: Mission[] = [
  { id: "police-01", role: "POLICE", title: "Sécuriser un carrefour", detail: "Rejoignez le carrefour central pour organiser la circulation.", x: 0, z: 0 },
  { id: "fire-01", role: "POMPIERS", title: "Contrôle de sécurité", detail: "Rejoignez le parc nord pour une vérification préventive.", x: -64, z: 64 },
  { id: "medical-01", role: "SECOURS", title: "Assistance citoyenne", detail: "Rejoignez le point de rendez-vous du quartier résidentiel.", x: 64, z: -64 }
];

export default function EmergencyCityPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<CameraMode>("third");
  const [driving, setDriving] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState(0);
  const [insideBuilding, setInsideBuilding] = useState(false);
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

        const mat = (name: string, color: import("@babylonjs/core").Color3, rough = 0.8, metallic = 0.04) => {
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
        const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: import("@babylonjs/core").Material) => {
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

        // 0.7: a compact accessible emergency-services reception interior.
        const interiorRoot = new B.TransformNode("emergency-hub-interior", world);
        const interiorFloor = B.MeshBuilder.CreateGround("hub-interior-floor", { width: 22, height: 18 }, world);
        interiorFloor.parent = interiorRoot; interiorFloor.position.set(178, 0.04, 178); interiorFloor.material = sidewalk;
        const interiorWall = mat("hub-interior-wall", new B.Color3(0.62, 0.66, 0.68), 0.92);
        const interiorTrim = mat("hub-interior-trim", new B.Color3(0.12, 0.18, 0.22), 0.6);
        const interiorPart = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: import("@babylonjs/core").Material) => {
          const mesh = B.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, world);
          mesh.parent = interiorRoot; mesh.position.set(178 + x, y, 178 + z); mesh.material = material; return mesh;
        };
        interiorPart("interior-back-wall", 22, 4, 0.5, 0, 2, -9, interiorWall);
        interiorPart("interior-left-wall", 0.5, 4, 18, -11, 2, 0, interiorWall);
        interiorPart("interior-right-wall", 0.5, 4, 18, 11, 2, 0, interiorWall);
        interiorPart("interior-front-left", 7, 4, 0.5, -7.5, 2, 9, interiorWall);
        interiorPart("interior-front-right", 7, 4, 0.5, 7.5, 2, 9, interiorWall);
        interiorPart("reception-desk", 7, 1.1, 1.4, 0, 0.65, -5.5, interiorTrim);
        interiorPart("dispatch-screen", 3.8, 2, 0.16, 0, 2.1, -8.55, glass);
        interiorPart("waiting-bench", 5, 0.65, 1.2, -6, 0.45, 3, interiorTrim);
        interiorPart("interior-ceiling-light", 5, 0.12, 1, 0, 3.85, 0, lane);
        interiorRoot.setEnabled(false);

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
        const carPart = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: import("@babylonjs/core").Material) => {
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
        const wheels: import("@babylonjs/core").Mesh[] = [];
        for (const x of [-1.02, 1.02]) for (const z of [-1.35, 1.35]) {
          const wheel = B.MeshBuilder.CreateCylinder("car-wheel", { diameter: 0.78, height: 0.28, tessellation: 20 }, world);
          wheel.parent = carRoot; wheel.position.set(x, 0.42, z); wheel.rotation.z = Math.PI / 2; wheel.material = tireMat; wheels.push(wheel);
          const rim = B.MeshBuilder.CreateCylinder("car-wheel-alloy", { diameter: 0.39, height: 0.295, tessellation: 16 }, world);
          rim.parent = carRoot; rim.position.copyFrom(wheel.position); rim.rotation.z = Math.PI / 2; rim.material = rimMat; wheels.push(rim);
        }

        // 0.5: three original procedural emergency-service vehicles, parked at the civic hub.
        const serviceVehicle = (name: string, x: number, z: number, color: import("@babylonjs/core").Color3, length: number, width: number, roofColor: import("@babylonjs/core").Color3) => {
          const root = new B.TransformNode(name, world);
          root.position.set(x, 0, z);
          const paint = mat(name + "-paint", color, 0.34, 0.42);
          const roofPaint = mat(name + "-roof", roofColor, 0.38, 0.25);
          const wheelPaint = tireMat;
          const part = (label: string, w: number, h: number, d: number, px: number, py: number, pz: number, material: import("@babylonjs/core").Material) => {
            const mesh = B.MeshBuilder.CreateBox(name + "-" + label, { width: w, height: h, depth: d }, world);
            mesh.parent = root; mesh.position.set(px, py, pz); mesh.material = material; return mesh;
          };
          part("chassis", width, 0.72, length, 0, 0.72, 0, paint);
          part("cabin", width * 0.82, 0.82, length * 0.48, 0, 1.48, -length * 0.08, roofPaint);
          part("windscreen", width * 0.72, 0.5, 0.06, 0, 1.48, length * 0.17, darkGlass);
          for (const side of [-1, 1]) for (const axle of [-1, 1]) {
            const wheel = B.MeshBuilder.CreateCylinder(name + "-wheel", { diameter: 0.72, height: 0.25, tessellation: 16 }, world);
            wheel.parent = root; wheel.position.set(side * (width / 2 + 0.02), 0.4, axle * length * 0.31); wheel.rotation.z = Math.PI / 2; wheel.material = wheelPaint;
          }
          const bar = part("lightbar", width * 0.55, 0.16, 0.38, 0, 1.98, -length * 0.08, metal);
          const blue = mat(name + "-blue-beacon", new B.Color3(0.035, 0.22, 1), 0.2, 0.2);
          const red = mat(name + "-red-beacon", new B.Color3(1, 0.035, 0.025), 0.2, 0.2);
          part("blue-beacon", 0.28, 0.18, 0.25, -width * 0.18, 2.12, -length * 0.08, blue);
          part("red-beacon", 0.28, 0.18, 0.25, width * 0.18, 2.12, -length * 0.08, red);
          bar.isPickable = false;
          return root;
        };
        serviceVehicle("police-cruiser", -18, 19, new B.Color3(0.025, 0.07, 0.16), 4.5, 2.05, new B.Color3(0.88, 0.9, 0.94));
        serviceVehicle("fire-engine", 0, 21, new B.Color3(0.72, 0.045, 0.025), 7.2, 2.45, new B.Color3(0.82, 0.08, 0.035));
        serviceVehicle("medical-ambulance", 19, 19, new B.Color3(0.83, 0.86, 0.82), 5.6, 2.15, new B.Color3(0.9, 0.92, 0.88));

        // Lightweight civilian pedestrians follow short, safe sidewalk loops.
        const pedestrians: { mesh: import("@babylonjs/core").Mesh; originX: number; originZ: number; phase: number }[] = [];
        const pedestrianMat = mat("pedestrian-jacket", new B.Color3(0.72, 0.48, 0.22));
        const skinMat = mat("pedestrian-face", new B.Color3(0.72, 0.52, 0.39));
        for (let i = 0; i < 8; i++) {
          const x = -28 + (i % 4) * 18;
          const z = -28 + Math.floor(i / 4) * 54;
          const person = B.MeshBuilder.CreateCapsule("city-pedestrian-" + i, { height: 1.65, radius: 0.28 }, world);
          person.position.set(x, 0.82, z); person.material = pedestrianMat;
          const head = B.MeshBuilder.CreateSphere("pedestrian-head-" + i, { diameter: 0.42, segments: 8 }, world);
          head.parent = person; head.position.y = 0.88; head.material = skinMat;
          pedestrians.push({ mesh: person, originX: x, originZ: z, phase: i * 0.82 });
        }

        // 0.6: a compact signal installation at the central avenue crossing.
        const signalRed = mat("signal-red", new B.Color3(0.95, 0.045, 0.025), 0.24, 0.1);
        const signalAmber = mat("signal-amber", new B.Color3(1, 0.52, 0.025), 0.24, 0.1);
        const signalGreen = mat("signal-green", new B.Color3(0.08, 0.85, 0.22), 0.24, 0.1);
        const signalDark = mat("signal-housing", new B.Color3(0.025, 0.03, 0.035), 0.65, 0.2);
        const signalLamps: { red: import("@babylonjs/core").Mesh; amber: import("@babylonjs/core").Mesh; green: import("@babylonjs/core").Mesh }[] = [];
        for (const x of [-13, 13]) {
          const pole = B.MeshBuilder.CreateCylinder("traffic-signal-pole", { height: 6, diameter: 0.18 }, world);
          pole.position.set(x, 3, -13); pole.material = metal;
          const housing = B.MeshBuilder.CreateBox("traffic-signal-housing", { width: 0.72, height: 1.85, depth: 0.48 }, world);
          housing.position.set(x, 5.8, -13); housing.material = signalDark;
          const lamp = (name: string, y: number, material: import("@babylonjs/core").Material) => {
            const mesh = B.MeshBuilder.CreateSphere(name, { diameter: 0.38, segments: 10 }, world);
            mesh.position.set(x, y, -12.72); mesh.material = material; return mesh;
          };
          signalLamps.push({ red: lamp("traffic-red-lamp", 6.35, signalRed), amber: lamp("traffic-amber-lamp", 5.8, signalDark), green: lamp("traffic-green-lamp", 5.25, signalDark) });
        }

        // Ambient traffic uses simple lane-following loops on the main avenues.
        const trafficCars: { root: import("@babylonjs/core").TransformNode; origin: number; lane: number; speed: number; phase: number }[] = [];
        const trafficPaints = [new B.Color3(0.18, 0.42, 0.62), new B.Color3(0.62, 0.62, 0.58), new B.Color3(0.22, 0.38, 0.24)];
        for (let i = 0; i < 3; i++) {
          const root = new B.TransformNode("ambient-traffic-" + i, world);
          const body = B.MeshBuilder.CreateBox("traffic-body-" + i, { width: 1.8, height: 0.62, depth: 3.8 }, world);
          body.parent = root; body.position.y = 0.68; body.material = mat("traffic-paint-" + i, trafficPaints[i], 0.42, 0.28);
          const cabin = B.MeshBuilder.CreateBox("traffic-cabin-" + i, { width: 1.48, height: 0.65, depth: 1.8 }, world);
          cabin.parent = root; cabin.position.set(0, 1.22, -0.15); cabin.material = darkGlass;
          trafficCars.push({ root, origin: -145 + i * 125, lane: i % 2 ? 5 : -5, speed: i % 2 ? -8 : 6, phase: i * 23 });
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
        const missionTarget = { current: null as { x: number; z: number } | null };
        const missionComplete = { current: (() => {}) as () => void };
        buildingBridgeRef.current = (inside) => {
          if (inside) { interiorRoot.setEnabled(true); player.position.set(178, 0.9, 176); carRoot.setEnabled(false); }
          else { interiorRoot.setEnabled(false); player.position.set(0, 0.9, 15); carRoot.setEnabled(true); }
          setInsideBuilding(inside);
        };
        missionBridgeRef.current = { setTarget: (target) => { missionTarget.current = target; }, clear: () => { missionTarget.current = null; } };
        const onDown = (event: KeyboardEvent) => { keys.add(event.key.toLowerCase()); };
        const onUp = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);
        const observer = world.onBeforeRenderObservable.add(() => {
          const dt = Math.min(webEngine.getDeltaTime() / 1000, 0.04);
          const forward = (keys.has("w") || keys.has("z") || keys.has("arrowup") ? 1 : 0) - (keys.has("s") || keys.has("arrowdown") ? 1 : 0);
          const strafe = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("q") || keys.has("arrowleft") ? 1 : 0);
          let followed = player.position;
          const elapsed = performance.now() / 1000;
          // Pedestrians follow rounded rectangular sidewalk circuits and face their direction of travel.
          pedestrians.forEach((person) => {
            const angle = elapsed * 0.22 + person.phase;
            person.mesh.position.x = person.originX + Math.cos(angle) * 5.5;
            person.mesh.position.z = person.originZ + Math.sin(angle) * 3.2;
            person.mesh.rotation.y = -angle;
          });
          // 10 seconds green, 2 seconds amber, 6 seconds red; traffic queues at the stop line.
          const signalPhase = elapsed % 18;
          const signalState = signalPhase < 10 ? "green" : signalPhase < 12 ? "amber" : "red";
          signalLamps.forEach((lamps) => {
            lamps.red.material = signalState === "red" ? signalRed : signalDark;
            lamps.amber.material = signalState === "amber" ? signalAmber : signalDark;
            lamps.green.material = signalState === "green" ? signalGreen : signalDark;
          });
          trafficCars.forEach((traffic) => {
            let travel = ((traffic.origin + elapsed * traffic.speed + 210) % 420 + 420) % 420 - 210;
            if (signalState !== "green") {
              if (traffic.speed > 0 && travel < -12 && travel > -34) travel = Math.min(travel, -12);
              if (traffic.speed < 0 && travel > 12 && travel < 34) travel = Math.max(travel, 12);
            }
            traffic.root.position.set(traffic.lane, 0, travel);
            traffic.root.rotation.y = traffic.speed > 0 ? 0 : Math.PI;
          });

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
          if (missionTarget.current) { const distance = Math.hypot(followed.x - missionTarget.current.x, followed.z - missionTarget.current.z); if (distance < 9) { missionTarget.current = null; missionComplete.current(); } }
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
        missionComplete.current = () => setCompletedMissions((count) => count + 1);
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
      missionBridgeRef.current = null;
      buildingBridgeRef.current = null;
    };
  }, []);

  const buildingBridgeRef = useRef<((inside: boolean) => void) | null>(null);
  const missionBridgeRef = useRef<{ setTarget: (target: { x: number; z: number }) => void; clear: () => void } | null>(null);
  const modeRef = useRef<CameraMode>("third");
  const driveBundleRef = useRef<{ player: import("@babylonjs/core").Mesh } | null>(null);
  const drivingRef = useRef(false);
  useEffect(() => { drivingRef.current = driving; const bundle = driveBundleRef.current; if (bundle) bundle.player.isVisible = !driving; }, [driving]);
  useEffect(() => {
    if (activeMission) missionBridgeRef.current?.setTarget({ x: activeMission.x, z: activeMission.z }); else missionBridgeRef.current?.clear();
  }, [activeMission]);
  useEffect(() => {
    modeRef.current = mode;
    const cameras = cameraBundleRef.current;
    if (cameras) cameras.world.activeCamera = mode === "third" ? cameras.third : cameras.first;
  }, [mode]);

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <a href="/" className={styles.brand}><span>N</span> NEXUS <b>EMERGENCY CITY</b></a>
        <div className={styles.build}>CITY UPDATE <i /> 0.7.0</div>
      </header>
      <section className={styles.viewport}>
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Aperçu 3D de la métropole Nexus Emergency City" />
        <div className={styles.hudTop}><span><i /> METRO DISTRICT / CITY BUILD 0.7</span><span>POLICE · POMPIERS · SECOURS · CIRCULATION</span></div>
        <div className={styles.titleCard}><small>NEXUS SIMULATION PROJECT</small><h1>EMERGENCY<br /><em>CITY</em></h1><p>UNE MÉTROPOLE. DES MILLIERS D'HISTOIRES.</p></div>
        <aside className={styles.dispatchPanel}>
          <div className={styles.dispatchHeader}><span>DISPATCH CENTRAL</span><b>{completedMissions} TERMINÉE(S)</b></div>
          {activeMission ? <div className={styles.activeMission}>
            <small>MISSION EN COURS · {activeMission.role}</small><h2>{activeMission.title}</h2><p>{activeMission.detail}</p>
            <div className={styles.missionTarget}>OBJECTIF : {activeMission.x}, {activeMission.z} · APPROCHEZ-VOUS À 9 M</div>
            <button onClick={() => setActiveMission(null)}>ABANDONNER</button>
          </div> : <div className={styles.missionList}><small>CHOISISSEZ UNE INTERVENTION</small>
            {missions.map((mission) => <button key={mission.id} onClick={() => setActiveMission(mission)}><span>{mission.role}</span><b>{mission.title}</b><i>↗</i></button>)}
          </div>}
        </aside>
        {completedMissions > 0 && <div className={styles.missionToast}>INTERVENTION VALIDÉE · +1 EXPÉRIENCE</div>}
        <div className={styles.buildingAccess}>
          <span>{insideBuilding ? "CENTRE DE SERVICES · INTÉRIEUR" : "CENTRE DE SERVICES · ENTRÉE"}</span>
          <button disabled={driving} onClick={() => buildingBridgeRef.current?.(!insideBuilding)}>{driving ? "SORTEZ DU VÉHICULE" : insideBuilding ? "SORTIR DU BÂTIMENT" : "ENTRER DANS LE BÂTIMENT"}</button>
        </div>
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
      <footer className={styles.footer}><span>BUILD 0.7 — ACCESSIBLE SERVICE INTERIOR</span><span>CENTRE DE SERVICES ACCESSIBLE · INTÉRIEUR AMÉNAGÉ · FEUX · PIÉTONS · 3 MISSIONS.</span></footer>
    </main>
  );
}
