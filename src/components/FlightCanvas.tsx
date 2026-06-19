"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { gsap } from "gsap";

// --- Procedural Stylized Plane Builder (Atmos organic style) ---
function createProceduralPlane() {
  const planeGroup = new THREE.Group();

  // Material: pure white soft clay, matte finish to look organic
  const planeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.45,
    metalness: 0.0,
    flatShading: false,
    dithering: true, // Prevent shading banding
  });

  // 1. Chubby Streamlined Fuselage (Length: 1.3, Radius: 0.22)
  const fuseLength = 1.3;
  const fuseRadius = 0.22;
  const fuseGeom = new THREE.CylinderGeometry(fuseRadius, fuseRadius, fuseLength, 32, 40, false);
  fuseGeom.rotateX(Math.PI / 2);

  const posAttr = fuseGeom.attributes.position;
  const v = posAttr.array as Float32Array;
  
  let minZ = 999;
  let maxZ = -999;
  for (let i = 0; i < posAttr.count; i++) {
    const z = v[i * 3 + 2];
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  const zLength = maxZ - minZ;

  for (let i = 0; i < posAttr.count; i++) {
    const x = v[i * 3];
    const y = v[i * 3 + 1];
    const z = v[i * 3 + 2];

    const t = (z - minZ) / zLength; // 0 (tail) to 1 (nose)

    // Chubby whale shape: rounded nose, thick middle, tapering to a soft point at tail
    const factor = Math.sin(Math.pow(t, 0.65) * Math.PI) * 1.05;
    v[i * 3] = x * factor;
    v[i * 3 + 1] = y * factor;

    // Gentle upward sweep at the tail
    v[i * 3 + 1] += 0.08 * Math.pow(1.0 - t, 2.0);
  }
  fuseGeom.computeVertexNormals();

  const fuselage = new THREE.Mesh(fuseGeom, planeMat);
  fuselage.castShadow = true;
  fuselage.receiveShadow = true;
  planeGroup.add(fuselage);

  // 2. Wide Organic Swept Wings (Wingspan: 2.8, thickness: 0.09)
  const wingspan = 2.8;
  const wingRadius = 0.09;
  const wingGeom = new THREE.CylinderGeometry(wingRadius, wingRadius, wingspan, 16, 50, false);
  wingGeom.rotateZ(Math.PI / 2);

  const wingPosAttr = wingGeom.attributes.position;
  const wingV = wingPosAttr.array as Float32Array;

  for (let i = 0; i < wingPosAttr.count; i++) {
    const wx = wingV[i * 3];
    const wy = wingV[i * 3 + 1];
    const wz = wingV[i * 3 + 2];

    const t = Math.abs(wx) / (wingspan / 2);

    // Taper: thick root to merge with fuselage, thin tips
    const taper = 1.0 - t * 0.85;
    wingV[i * 3 + 1] = wy * taper;
    wingV[i * 3 + 2] = wz * taper;

    // Soft organic wing bend: dips slightly, then curves up elegantly at tips
    wingV[i * 3 + 1] += -0.03 * Math.sin(t * Math.PI * 0.7) + 0.1 * Math.pow(t, 3.0);

    // Sweep back: wings sweep backwards towards the tail
    wingV[i * 3 + 2] += -0.26 * Math.pow(t, 1.6);
  }
  wingGeom.computeVertexNormals();

  const wings = new THREE.Mesh(wingGeom, planeMat);
  wings.position.set(0, -0.03, 0.08); // positioned slightly forward of fuselage center
  wings.castShadow = true;
  wings.receiveShadow = true;
  planeGroup.add(wings);

  // 3. Sleek Vertical Fin (extruding swept shape, scaled for chubby body)
  const rudderShape = new THREE.Shape();
  rudderShape.moveTo(0, 0);
  rudderShape.lineTo(0.26, 0.0);
  rudderShape.lineTo(0.16, 0.38); // top of fin
  rudderShape.lineTo(0.05, 0.38); // top trailing edge
  rudderShape.closePath();

  const extrudeSettings = {
    depth: 0.024, // slightly thicker for clay look
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  };

  const rudderGeom = new THREE.ExtrudeGeometry(rudderShape, extrudeSettings);
  const rudder = new THREE.Mesh(rudderGeom, planeMat);
  rudder.rotation.y = -Math.PI / 2;
  rudder.position.set(0, 0.12, -0.5); // tail placement
  rudder.castShadow = true;
  rudder.receiveShadow = true;
  planeGroup.add(rudder);

  // 4. Sleek T-Tail Horizontal Stabilizers (on top of the vertical fin)
  const stabilizerShape = new THREE.Shape();
  stabilizerShape.moveTo(0, 0);
  stabilizerShape.lineTo(0.38, -0.1);
  stabilizerShape.lineTo(0.35, -0.15);
  stabilizerShape.lineTo(0.0, -0.05);
  stabilizerShape.lineTo(-0.35, -0.15);
  stabilizerShape.lineTo(-0.38, -0.1);
  stabilizerShape.closePath();

  const stabGeom = new THREE.ExtrudeGeometry(stabilizerShape, extrudeSettings);
  const stabilizer = new THREE.Mesh(stabGeom, planeMat);
  stabilizer.rotation.x = Math.PI / 2;
  stabilizer.position.set(0, 0.49, -0.48); // sits perfectly on top of vertical fin
  stabilizer.castShadow = true;
  stabilizer.receiveShadow = true;
  planeGroup.add(stabilizer);

  // 5. Small Jet Exhaust Hole (where the trail originates)
  const exhaustGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16, 1);
  exhaustGeom.rotateX(Math.PI / 2);
  const exhaustCone = new THREE.Mesh(exhaustGeom, new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
  }));
  exhaustCone.position.set(0, 0.08, -0.62); // at the tail end
  planeGroup.add(exhaustCone);

  return planeGroup;
}

// --- Update Ribbon Trail Buffer Geometry In-Place (High-Performance 120fps) ---
function updateTrailGeometry(
  geom: THREE.BufferGeometry,
  points: THREE.Vector3[],
  maxPoints: number,
  radialSegments: number = 8
) {
  if (points.length < 2) return;

  // Pad the points array to always equal maxPoints
  const activePoints = [...points];
  while (activePoints.length < maxPoints) {
    activePoints.unshift(activePoints[0].clone());
  }

  const tangents: THREE.Vector3[] = [];
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];

  for (let i = 0; i < maxPoints; i++) {
    const tangent = new THREE.Vector3();
    if (i === 0) {
      tangent.subVectors(activePoints[1], activePoints[0]).normalize();
    } else if (i === maxPoints - 1) {
      tangent.subVectors(activePoints[maxPoints - 1], activePoints[maxPoints - 2]).normalize();
    } else {
      tangent.subVectors(activePoints[i + 1], activePoints[i - 1]).normalize();
    }
    tangents.push(tangent);
  }

  const normal = new THREE.Vector3();
  let min = 999;
  const tVec = tangents[0];
  if (Math.abs(tVec.x) <= min) { min = Math.abs(tVec.x); normal.set(1, 0, 0); }
  if (Math.abs(tVec.y) <= min) { min = Math.abs(tVec.y); normal.set(0, 1, 0); }
  if (Math.abs(tVec.z) <= min) { min = Math.abs(tVec.z); normal.set(0, 0, 1); }
  
  const binormal = new THREE.Vector3().crossVectors(tVec, normal).normalize();
  normal.crossVectors(binormal, tVec).normalize();

  normals.push(normal.clone());
  binormals.push(binormal.clone());

  for (let i = 1; i < maxPoints; i++) {
    const t0 = tangents[i - 1];
    const t1 = tangents[i];
    const n0 = normals[i - 1];
    const b0 = binormals[i - 1];

    const n1 = n0.clone();
    const b1 = b0.clone();

    const cross = new THREE.Vector3().crossVectors(t0, t1);
    if (cross.length() > 0.0001) {
      cross.normalize();
      const theta = Math.acos(Math.min(1.0, Math.max(-1.0, t0.dot(t1))));
      n1.applyAxisAngle(cross, theta);
      b1.applyAxisAngle(cross, theta);
    }
    normals.push(n1);
    binormals.push(b1);
  }

  const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
  const v = posAttr.array as Float32Array;

  for (let i = 0; i < maxPoints; i++) {
    const p = activePoints[i];
    const n = normals[i];
    const b = binormals[i];
    const pct = i / (maxPoints - 1); // 0 (oldest/tail) to 1 (newest/exhaust)
    
    // Taper: starts at 0 at tail and grows to 0.045 at exhaust
    const radius = 0.045 * Math.pow(pct, 1.2);

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const vx = p.x + (n.x * cos + b.x * sin) * radius;
      const vy = p.y + (n.y * cos + b.y * sin) * radius;
      const vz = p.z + (n.z * cos + b.z * sin) * radius;

      const idx = i * (radialSegments + 1) + j;
      v[idx * 3] = vx;
      v[idx * 3 + 1] = vy;
      v[idx * 3 + 2] = vz;
    }
  }

  posAttr.needsUpdate = true;
  geom.computeVertexNormals();
}

interface FlightCanvasProps {
  scrollProgress: number; // 0 to 1
  onSectionReached?: (sectionIndex: number) => void;
  cardRefs?: Record<number, React.RefObject<HTMLDivElement | null>>;
}

export default function FlightCanvas({
  scrollProgress,
  onSectionReached,
  cardRefs,
}: FlightCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cardRefsRef = useRef(cardRefs);
  useEffect(() => {
    cardRefsRef.current = cardRefs;
  }, [cardRefs]);
  
  // Keep scrollProgress in a ref to access it in the animation loop without re-triggering useEffect
  const progressRef = useRef(scrollProgress);
  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Add soft linear fog that fades out distant clouds, blending them into the background sky
    scene.fog = new THREE.Fog("#e6eefa", 20, 150);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    scene.add(camera);

    // --- Custom Perlin Noise Background Shader (Phase 1) ---
    const bgGeom = new THREE.PlaneGeometry(500, 500, 20, 20);
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vMixVal;
        varying float vN3;

        // --- 2D Simplex Noise ---
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx) ;
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0 ;
          vec3 h = abs(x) - 0.5 ;
          vec3 a0 = x - floor(x + 0.5) ;
          vec3 g = a0.xyx  * vec3(x0.x, x12.x, x12.z) + h.xyx * vec3(x0.y, x12.y, x12.zw);
          vec3 r = 130.0 * vec3(dot(m*g, vec3(1.0)));
          return r.x;
        }

        void main() {
          vUv = uv;
          vec2 noiseUv = uv * 2.0;
          float n1 = snoise(noiseUv + vec2(uTime * 0.04, uTime * 0.02));
          float n2 = snoise(noiseUv - vec2(uTime * 0.03, -uTime * 0.05));
          vMixVal = (n1 + n2) * 0.5 + 0.5;
          vN3 = snoise(noiseUv * 1.6 + uTime * 0.015) * 0.5 + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        varying float vMixVal;
        varying float vN3;

        void main() {
          vec3 col = mix(uColor1, uColor2, vMixVal);
          col = mix(col, uColor3, vN3);
          
          vec2 uvDist = vUv - vec2(0.5);
          float vignette = 1.0 - dot(uvDist, uvDist) * 0.52;
          
          gl_FragColor = vec4(col * vignette, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#002fa7") },
        uColor2: { value: new THREE.Color("#4a7eff") },
        uColor3: { value: new THREE.Color("#bcd2ee") },
      },
      depthWrite: false,
      depthTest: false,
    });

    const bgMesh = new THREE.Mesh(bgGeom, bgMat);
    bgMesh.position.z = -95;
    camera.add(bgMesh);

    // --- Color Palettes (Phase 4) ---
    const palettes = [
      { c1: "#002fa7", c2: "#4a7eff", c3: "#bcd2ee" }, // Palette 0: Landing (Atmos Blue)
      { c1: "#ff7b7b", c2: "#ffb57a", c3: "#83a4d4" }, // Palette 1: Memory 1 (Sunset)
      { c1: "#075e54", c2: "#128c7e", c3: "#d2f3ec" }, // Palette 2: Memory 2 (Coastal)
      { c1: "#8a4f91", c2: "#d9a5b3", c3: "#b9cced" }, // Palette 3: Memory 3 (Lavender)
      { c1: "#e0a96d", c2: "#dd6b55", c3: "#a8c0ff" }, // Palette 4: Celebration (Golden)
    ];
    let currentPaletteIndex = 0;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Transparent background to show CSS gradient underneath
      powerPreference: "high-performance",
    });
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false;
    // Hemisphere light representing the ambient sky and ground colors (Atmos step 4)
    const hemiLight = new THREE.HemisphereLight("#4a7eff", "#bcd2ee", 1.45); // slightly brighter ambient
    scene.add(hemiLight);

    // Directional key light to cast highlights
    const dirLight = new THREE.DirectionalLight("#fffdfa", 1.15); // slightly stronger key light for popping white clay
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = false;
    scene.add(dirLight);

    // --- Custom Soft-Edge Volumetric Cloud Shader ---
    const cloudMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false, // Prevents clipping artifacts in overlapping spheres
      depthTest: true,
      fog: true, // Enable Three.js built-in fog integration
      uniforms: {
        // Fog uniforms (required by WebGLRenderer when fog: true is set)
        fogColor: { value: new THREE.Color("#e6eefa") },
        fogNear: { value: 20 },
        fogFar: { value: 150 },
        fogDensity: { value: 0.00025 },

        uTime: { value: 0 },
        uLightDirection: { value: new THREE.Vector3(15, 30, 20).normalize() },
        uLightColor: { value: new THREE.Color("#fffdfa") },
        uAmbientColor: { value: new THREE.Color("#4a7eff") },
        uShadowColor: { value: new THREE.Color("#bcd2ee") },
        uEdgeSoftness: { value: 0.65 },
        uOpacity: { value: 0.95 },
        uNoiseScale: { value: 0.05 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        #include <fog_pars_vertex>

        void main() {
          vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vViewPosition = cameraPosition - worldPos.xyz;
          vec4 mvPosition = viewMatrix * worldPos;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uLightDirection;
        uniform vec3 uLightColor;
        uniform vec3 uAmbientColor;
        uniform vec3 uShadowColor;
        uniform float uEdgeSoftness;
        uniform float uOpacity;
        uniform float uNoiseScale;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;

        #include <fog_pars_fragment>

        float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // 1. Soft Silhouette Transparency Falloff
          float dVN = max(0.0, dot(normal, viewDir));
          float edgeNoise = sin(vWorldPosition.x * 1.5 + uTime * 0.2) * cos(vWorldPosition.y * 1.5 - uTime * 0.1) * 0.035;
          float alpha = smoothstep(0.0, uEdgeSoftness + edgeNoise, dVN);

          // 2. Shading: Half-Lambert
          float NdotL = dot(normal, uLightDirection);
          float diffuse = NdotL * 0.5 + 0.5;

          vec3 baseColor = vec3(1.0);
          vec3 shadedColor = mix(uShadowColor, baseColor, diffuse);
          shadedColor += uAmbientColor * 0.12;

          // 3. Film Grain
          vec2 screenUV = gl_FragCoord.xy / 900.0;
          float grain = rand(screenUV + fract(uTime * 0.01));
          shadedColor += (grain - 0.5) * uNoiseScale;

          gl_FragColor = vec4(shadedColor, alpha * uOpacity);

          #include <fog_fragment>
        }
      `,
    });

    // --- Spline Curve (Flight Track) ---
    // Define 3D control points representing a serpentine forward track down Z axis
    const curvePoints = [
      new THREE.Vector3(0, 0, 10),       // Start (extended backward for camera lead-in)
      new THREE.Vector3(0, 0, 0),        // P0 (scroll = 0)
      new THREE.Vector3(4, 1.5, -25),    // P1 (scroll = 0.25)
      new THREE.Vector3(-4, -1, -50),    // P2 (scroll = 0.5)
      new THREE.Vector3(4, 2, -75),      // P3 (scroll = 0.75)
      new THREE.Vector3(-2.5, -0.5, -100),// P4 (scroll = 0.95)
      new THREE.Vector3(0, 0, -125),     // P5 (scroll = 1.0)
      new THREE.Vector3(0, 0, -145),     // End buffer
    ];

    const spline = new THREE.CatmullRomCurve3(curvePoints);
    spline.curveType = "centripetal";

    // Define 3D milestone positions along the serpentine spline track (on alternating sides, pushed further out to keep them at a distance)
    const milestoneTargets = [
      { id: 1, t: 0.23, offsetX: -2.5, offsetY: 0.6, mobileOffsetX: -0.45 }, // Milestone 1: Left (adjusted to center nicely)
      { id: 2, t: 0.48, offsetX: 3.8, offsetY: 0.5, mobileOffsetX: 0.75 },   // Milestone 2: Right
      { id: 3, t: 0.73, offsetX: -3.8, offsetY: 0.6, mobileOffsetX: -0.75 },  // Milestone 3: Left
    ];

    const milestoneWorldPositions = milestoneTargets.map(target => {
      const pos = spline.getPointAt(target.t);
      const dir = spline.getTangentAt(target.t);
      const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
      
      const worldPos = pos.clone()
        .addScaledVector(normal, target.offsetX)
        .add(new THREE.Vector3(0, target.offsetY, 0));
        
      return {
        id: target.id,
        position: worldPos,
        t: target.t,
        offsetX: target.offsetX,
        offsetY: target.offsetY,
        mobileOffsetX: target.mobileOffsetX
      };
    });

    // --- Group Pivots ---
    const planePivot = new THREE.Group();
    scene.add(planePivot);

    const planeModelContainer = new THREE.Group();
    planePivot.add(planeModelContainer);

    const cloudsGroup = new THREE.Group();
    scene.add(cloudsGroup);

    // --- Vapour Trail (Tapered Ribbon) Setup ---
    const trailHistory: THREE.Vector3[] = [];
    const maxTrailPoints = isMobile ? 30 : 60; // 30 points on mobile, 60 on desktop
    const radialSegments = 8;
    
    // Create trail mesh with pre-allocated buffer geometry attributes
    const trailGeometry = new THREE.BufferGeometry();
    const vertexCount = maxTrailPoints * (radialSegments + 1);
    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    
    // Pre-calculate UVs
    for (let i = 0; i < maxTrailPoints; i++) {
      const pct = i / (maxTrailPoints - 1);
      for (let j = 0; j <= radialSegments; j++) {
        const idx = i * (radialSegments + 1) + j;
        uvs[idx * 2] = pct;
        uvs[idx * 2 + 1] = j / radialSegments;
      }
    }
    
    // Pre-calculate indices
    const indices: number[] = [];
    for (let i = 0; i < maxTrailPoints - 1; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = i * (radialSegments + 1) + j + 1;
        const c = (i + 1) * (radialSegments + 1) + j;
        const d = (i + 1) * (radialSegments + 1) + j + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }
    
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    trailGeometry.setIndex(indices);

    const trailMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe0eaff, // Soft glow matching the sky
      emissiveIntensity: 0.15,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.82,
      flatShading: false,
      side: THREE.DoubleSide,
    });
    const trailMesh = new THREE.Mesh(trailGeometry, trailMat);
    scene.add(trailMesh);

    let airplaneMesh: THREE.Group | null = null;
    const cloudsList: THREE.Object3D[] = [];

    const setupProceduralScene = () => {
      // 1. Setup Procedural Sleek Stylized Aeroplane Model (Phase 4 / 5 Custom design)
      airplaneMesh = createProceduralPlane();
      // Scale the airplane up to look fat and prominent, matching the reference image
      airplaneMesh.scale.set(1.42, 1.42, 1.42);
      planeModelContainer.add(airplaneMesh);
      
      // Default orientation - nose forward along Z
      planeModelContainer.rotation.set(0, 0, 0);

      // 2. Setup Multi-Layered Procedural High-Quality Bubbly Clouds along the entire spline path
      // All clouds have been removed from the sky and bottom as requested, keeping the flight corridor 100% clear.

      // Smooth transition - hide loader immediately
      setIsLoading(false);
    };

    // Execute the procedural scene setup
    setupProceduralScene();

    // --- 5. High-Performance InstancedMesh Wind Particles (Phase 5) ---
    const windCount = 85;
    const windGeom = new THREE.BoxGeometry(0.015, 0.015, 1.2);
    const windMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const windMesh = new THREE.InstancedMesh(windGeom, windMat, windCount);
    camera.add(windMesh); // Attach to camera so they travel relative to viewport

    const windParticlesList: { pos: THREE.Vector3; speed: number }[] = [];
    for (let i = 0; i < windCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 12,   // X local spread
        (Math.random() - 0.5) * 8,    // Y local spread
        -Math.random() * 45           // Z local spread (ahead of camera)
      );
      const speed = 0.35 + Math.random() * 0.75;
      windParticlesList.push({ pos, speed });
    }

    const dummy = new THREE.Object3D();
    let smoothedVelocity = 0;

    // --- Animation State Variables ---
    let currentProgress = 0;
    let lastScrollProgress = 0;
    
    // --- Window Resize Handler ---
    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // --- Game Render Loop ---
    let frameId: number;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // Smoothly interpolate currentProgress to target scrollProgress (lerp easing)
      const targetProgress = progressRef.current;
      const progressDiff = targetProgress - lastScrollProgress;
      
      currentProgress += (targetProgress - currentProgress) * 0.065;
      
      const scrollSpeed = Math.abs(progressDiff);
      lastScrollProgress = targetProgress;

      const pathT = Math.min(0.99, Math.max(0.01, currentProgress));
      const planeT = Math.min(0.999, pathT + 0.008);
      const cameraT = Math.max(0, pathT - 0.024);

      // Update shader uniform time (Phase 1)
      bgMat.uniforms.uTime.value = time * 0.001;
      cloudMat.uniforms.uTime.value = time * 0.001;

      // Color Palette Transition Detection (Phase 4)
      let targetPaletteIndex = 0;
      if (currentProgress < 0.12) {
        targetPaletteIndex = 0;
      } else if (currentProgress < 0.35) {
        targetPaletteIndex = 1;
      } else if (currentProgress < 0.6) {
        targetPaletteIndex = 2;
      } else if (currentProgress < 0.85) {
        targetPaletteIndex = 3;
      } else {
        targetPaletteIndex = 4;
      }

      if (targetPaletteIndex !== currentPaletteIndex) {
        currentPaletteIndex = targetPaletteIndex;
        const colors = palettes[targetPaletteIndex];
        
        // Use GSAP to transition shader color uniforms smoothly!
        gsap.to(bgMat.uniforms.uColor1.value, {
          r: new THREE.Color(colors.c1).r,
          g: new THREE.Color(colors.c1).g,
          b: new THREE.Color(colors.c1).b,
          duration: 1.6,
          ease: "power2.out",
        });
        gsap.to(bgMat.uniforms.uColor2.value, {
          r: new THREE.Color(colors.c2).r,
          g: new THREE.Color(colors.c2).g,
          b: new THREE.Color(colors.c2).b,
          duration: 1.6,
          ease: "power2.out",
        });
        gsap.to(bgMat.uniforms.uColor3.value, {
          r: new THREE.Color(colors.c3).r,
          g: new THREE.Color(colors.c3).g,
          b: new THREE.Color(colors.c3).b,
          duration: 1.6,
          ease: "power2.out",
        });

        // Update cloud shader shadow and ambient color uniforms to match the palette
        gsap.to(cloudMat.uniforms.uShadowColor.value, {
          r: new THREE.Color(colors.c3).r,
          g: new THREE.Color(colors.c3).g,
          b: new THREE.Color(colors.c3).b,
          duration: 1.6,
          ease: "power2.out",
        });
        gsap.to(cloudMat.uniforms.uAmbientColor.value, {
          r: new THREE.Color(colors.c2).r,
          g: new THREE.Color(colors.c2).g,
          b: new THREE.Color(colors.c2).b,
          duration: 1.6,
          ease: "power2.out",
        });

        // Update HemisphereLight colors simultaneously to match ambient light reflections (Atmos step 4)
        gsap.to(hemiLight.color, {
          r: new THREE.Color(colors.c2).r,
          g: new THREE.Color(colors.c2).g,
          b: new THREE.Color(colors.c2).b,
          duration: 1.6,
          ease: "power2.out",
        });
        gsap.to(hemiLight.groundColor, {
          r: new THREE.Color(colors.c3).r,
          g: new THREE.Color(colors.c3).g,
          b: new THREE.Color(colors.c3).b,
          duration: 1.6,
          ease: "power2.out",
        });

        // Update Fog color simultaneously to match the background sky gradient seamlessly
        if (scene.fog && 'color' in scene.fog) {
          const fogColor = new THREE.Color(colors.c3); // Match the light horizon color
          gsap.to((scene.fog as THREE.Fog).color, {
            r: fogColor.r,
            g: fogColor.g,
            b: fogColor.b,
            duration: 1.6,
            ease: "power2.out",
          });
        }
      }

      // --- End-of-Flight Zoom / Flying-off Animation ---
      if (currentProgress > 0.94) {
        // Scroll progress exiting threshold (0.94 to 1.0)
        const exitProgress = Math.min(1.0, (currentProgress - 0.94) / 0.06); // 0 to 1
        
        // 1. Aeroplane accelerates forward rapidly and flies off out of view
        const planeExitT = Math.min(0.999, planeT + exitProgress * 0.09);
        const targetPlanePos = spline.getPointAt(planeExitT);
        // Shift plane position forward & add climbing arc
        planePivot.position.copy(targetPlanePos);
        planePivot.position.y += exitProgress * 4.5;
        
        // Scale aeroplane pivot down to 0 to simulate fading into the distance (fixes scroll-back bug)
        const exitScale = Math.max(0, 1 - exitProgress * 1.25);
        planePivot.scale.set(exitScale, exitScale, exitScale);

        // 2. Camera slides straight forward into the blue-white sky, aligning forward (No Pitch wobble)
        const cameraExitT = Math.min(0.999, cameraT + exitProgress * 0.06);
        const targetCameraPos = spline.getPointAt(cameraExitT);
        camera.position.copy(targetCameraPos);
        camera.position.y += 0.58 * (1 - exitProgress); // Align to baseline horizon
        camera.lookAt(targetCameraPos.x, targetCameraPos.y, targetCameraPos.z - 25);
      } else {
        // --- Normal Scrolling Flight ---
        // Restore base scale of pivot group if scrolled back
        planePivot.scale.set(1, 1, 1);

        const targetPlanePos = spline.getPointAt(planeT);
        planePivot.position.copy(targetPlanePos);

        const planeLookAtT = Math.min(1.0, planeT + 0.01);
        const lookTarget = spline.getPointAt(planeLookAtT);
        planePivot.lookAt(lookTarget);

        // Turn bank roll
        const currDir = spline.getTangentAt(planeT);
        const nextDir = spline.getTangentAt(Math.min(1.0, planeT + 0.02));
        const turnAmount = currDir.x - nextDir.x;
        
        // Rotate planeModelContainer to apply bank roll and idle wobble, avoiding lookAt quaternion conflicts
        planeModelContainer.rotation.set(
          Math.sin(time * 0.003) * 0.04, // pitch wobble
          Math.cos(time * 0.002) * 0.02, // yaw wobble
          turnAmount * 3.5               // roll bank
        );

        const targetCameraPos = spline.getPointAt(cameraT);
        camera.position.copy(targetCameraPos);
        camera.position.y += 0.58; // Third person offset
        camera.lookAt(planePivot.position);
      }

      // --- Animate Vapour Trail (Tapered Ribbon) ---
      if (airplaneMesh) {
        // Ensure matrices are computed
        planePivot.updateMatrixWorld(true);
        planeModelContainer.updateMatrixWorld(true);
        airplaneMesh.updateMatrixWorld(true);

        // Compute local exhaust position offset behind the plane (aligned to its tail fin)
        const exhaustOffset = new THREE.Vector3(0, 0.08, -0.65);
        const worldExhaust = exhaustOffset.clone().applyMatrix4(airplaneMesh.matrixWorld);

        // Initialize history if empty to avoid snapping from origin (0,0,0)
        if (trailHistory.length === 0) {
          for (let i = 0; i < maxTrailPoints; i++) {
            trailHistory.push(worldExhaust.clone());
          }
        } else {
          // Add to history
          trailHistory.push(worldExhaust);
          if (trailHistory.length > maxTrailPoints) {
            trailHistory.shift();
          }
        }
      }

      // Render ribbon trail
      if (trailHistory.length >= 2 && currentProgress <= 0.96) {
        trailMesh.visible = true;
        updateTrailGeometry(trailGeometry, trailHistory, maxTrailPoints, 8);
      } else {
        trailMesh.visible = false;
      }

      // Gently rotate clouds
      cloudsList.forEach((cloud, idx) => {
        cloud.rotation.y = time * 0.0001 * (idx % 2 === 0 ? 1 : -1);
      });

      // --- Animate Instanced Wind Particles (Phase 5) ---
      // Smooth out scroll velocity to prevent sudden jumps
      smoothedVelocity += (scrollSpeed - smoothedVelocity) * 0.08;

      const currentSpeedMultiplier = 1.0 + smoothedVelocity * 150.0;
      const currentZScale = 1.0 + smoothedVelocity * 220.0;
      windMat.opacity = Math.min(0.48, 0.12 + smoothedVelocity * 15.0);

      for (let i = 0; i < windCount; i++) {
        const p = windParticlesList[i];
        
        // Fly forward towards the camera in local space
        p.pos.z += p.speed * 0.45 * currentSpeedMultiplier;

        // Reset if it flies behind the camera frustum (local Z > 5)
        if (p.pos.z > 5) {
          p.pos.x = (Math.random() - 0.5) * 12;
          p.pos.y = (Math.random() - 0.5) * 8;
          p.pos.z = -45 - Math.random() * 10;
          p.speed = 0.35 + Math.random() * 0.75;
        }

        dummy.position.copy(p.pos);
        dummy.scale.set(1.0, 1.0, currentZScale);
        dummy.updateMatrix();
        windMesh.setMatrixAt(i, dummy.matrix);
      }
      windMesh.instanceMatrix.needsUpdate = true;

      // Section triggers callback
      if (onSectionReached) {
        const progressPercent = currentProgress;
        if (progressPercent >= 0.12 && progressPercent < 0.35) {
          onSectionReached(1);
        } else if (progressPercent >= 0.35 && progressPercent < 0.6) {
          onSectionReached(2);
        } else if (progressPercent >= 0.6 && progressPercent < 0.85) {
          onSectionReached(3);
        } else if (progressPercent >= 0.85) {
          onSectionReached(4);
        } else {
          onSectionReached(0);
        }
      }

      // Directly update the card overlay positions by projecting 3D milestone coordinates to screen space
      const cardRefsObj = cardRefsRef.current;
      if (cardRefsObj) {
        // Project Milestones 1, 2, 3 (Polaroids)
        milestoneWorldPositions.forEach(mw => {
          const cardRef = cardRefsObj[mw.id];
          const el = cardRef?.current;
          if (el) {
            const isMobile = camera.aspect < 0.85;
            const activeOffsetX = isMobile ? mw.mobileOffsetX : mw.offsetX;
            const activeOffsetY = isMobile ? mw.offsetY - 0.15 : mw.offsetY;

            const pos = spline.getPointAt(mw.t);
            const dir = spline.getTangentAt(mw.t);
            const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
            
            const responsivePos = pos.clone()
              .addScaledVector(normal, activeOffsetX)
              .add(new THREE.Vector3(0, activeOffsetY, 0));

            const tempV = new THREE.Vector3().copy(responsivePos);
            
            // Project 3D vector to camera view/projection (NDC)
            tempV.project(camera);
            
            // Check if object is behind camera direction
            const dirToObject = responsivePos.clone().sub(camera.position);
            const cameraDir = new THREE.Vector3();
            camera.getWorldDirection(cameraDir);
            const isBehind = dirToObject.dot(cameraDir) < 0;
            
            // Convert NDC coordinates (-1 to 1) to screen percentages (0 to 100)
            const x = (tempV.x * 0.5 + 0.5) * 100;
            const y = (-tempV.y * 0.5 + 0.5) * 100;
            
            let active = false;
            let opacity = 0;
            let scale = 0.35;
            
            if (mw.id === 1) {
              const start = 0.01, peak = 0.21, end = 0.25;
              if (currentProgress >= start && currentProgress <= end) {
                active = true;
                if (currentProgress < peak) {
                  const t = (currentProgress - start) / (peak - start);
                  opacity = t;
                  scale = 0.45 + t * 0.55;
                } else {
                  const t = (currentProgress - peak) / (end - peak);
                  opacity = 1.0 - t;
                  scale = 1.0 + t * 0.35;
                }
              }
            } else if (mw.id === 2) {
              const start = 0.25, peak = 0.46, end = 0.50;
              if (currentProgress >= start && currentProgress <= end) {
                active = true;
                if (currentProgress < peak) {
                  const t = (currentProgress - start) / (peak - start);
                  opacity = t;
                  scale = 0.45 + t * 0.55;
                } else {
                  const t = (currentProgress - peak) / (end - peak);
                  opacity = 1.0 - t;
                  scale = 1.0 + t * 0.35;
                }
              }
            } else if (mw.id === 3) {
              const start = 0.50, peak = 0.71, end = 0.75;
              if (currentProgress >= start && currentProgress <= end) {
                active = true;
                if (currentProgress < peak) {
                  const t = (currentProgress - start) / (peak - start);
                  opacity = t;
                  scale = 0.45 + t * 0.55;
                } else {
                  const t = (currentProgress - peak) / (end - peak);
                  opacity = 1.0 - t;
                  scale = 1.0 + t * 0.35;
                }
              }
            }
            
            // Apply calculated styles directly to the DOM element for smooth 120fps performance (via hardware-accelerated 3D transforms)
            if (active && !isBehind && opacity > 0.01) {
              el.style.display = "flex";
              el.style.transform = `translate3d(${x}vw, ${y}vh, 0) translate(-50%, -50%) scale(${scale})`;
              el.style.opacity = `${opacity}`;
            } else {
              el.style.display = "none";
            }
          }
        });

      }

      renderer.render(scene, camera);
    };

    animate(0);

    // --- Cleanup ---
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      windGeom.dispose();
      windMat.dispose();
      trailGeometry.dispose();
      trailMat.dispose();
      cloudMat.dispose();
    };
  }, [onSectionReached]);

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#003bde] via-[#759eff] to-[#e6eefa] z-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
          <p className="text-white/80 text-sm font-serif tracking-widest uppercase">
            Loading Flight Experience
          </p>
        </div>
      )}
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}



