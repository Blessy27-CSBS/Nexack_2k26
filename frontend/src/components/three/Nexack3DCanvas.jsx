import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useWebGL } from '../../hooks/useWebGL';

/**
 * Nexack3DCanvas — "NEXACK BUILD CORE"
 * 
 * A single, cohesive, cinematic 3D visual representing:
 * IDEA → BUILD → INNOVATE
 * 
 * Core Design Principles:
 * 1. ONE primary 3D visual element: The Build Core (no competing cards, terminals, or random wireframes).
 * 2. Positioned deep in the background with pristine negative space for the NEXACK 2K26 title.
 * 3. Cohesive harmonic motion: Assembly fragments gently converge, core pulses with energy, fragments breathe outward.
 * 4. ONE thin glowing orbital energy stream.
 * 5. Drastically reduced, subtle digital dust particles in the far background.
 * 6. Slow, premium, 60 FPS cinematic motion with gentle mouse parallax and scroll transition.
 */
const Nexack3DCanvas = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isSupported, qualityLevel, reducedMotion } = useWebGL();

  useEffect(() => {
    if (!isSupported || qualityLevel === 'none' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Deep Cinematic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: qualityLevel === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualityLevel === 'high' ? 2 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Subtle Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x09090e, 1.5);
    scene.add(ambientLight);

    // Core internal emerald glow
    const corePointLight = new THREE.PointLight(0x10b981, 2.2, 10);
    corePointLight.position.set(0, 2.1, -1.0);
    scene.add(corePointLight);

    // Rim accent purple light
    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.8);
    rimLight.position.set(3, 4, 2);
    scene.add(rimLight);

    // 5. THE NEXACK BUILD CORE (Single Cohesive 3D System)
    // Positioned in the upper negative space (y = 2.1) to crown and frame the NEXACK title without overlap
    const buildCoreGroup = new THREE.Group();
    buildCoreGroup.position.set(0, 2.1, -1.2);
    scene.add(buildCoreGroup);

    // 5a. Inner Reactor Nucleus (Faceted Emerald Octahedron)
    const nucleusGeo = new THREE.OctahedronGeometry(0.48, 0);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.85
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    buildCoreGroup.add(nucleusMesh);

    // 5b. Outer Geometric Wireframe Shell (Electric Purple Lattice)
    const shellGeo = new THREE.IcosahedronGeometry(0.88, 1);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      emissive: 0x3b0764,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.45
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    buildCoreGroup.add(shellMesh);

    // 5c. Translucent Inner Facet Shroud (Adds Glass-Like Depth)
    const shroudGeo = new THREE.IcosahedronGeometry(0.82, 0);
    const shroudMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x10b981,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      metalness: 0.9
    });
    const shroudMesh = new THREE.Mesh(shroudGeo, shroudMat);
    buildCoreGroup.add(shroudMesh);

    // 5d. ONE Subtle Energy / Data Stream Orbit Ring
    const streamRingGeo = new THREE.TorusGeometry(1.22, 0.012, 16, 96);
    const streamRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.55
    });
    const streamRing = new THREE.Mesh(streamRingGeo, streamRingMat);
    streamRing.rotation.x = Math.PI / 3;
    streamRing.rotation.y = Math.PI / 8;
    buildCoreGroup.add(streamRing);

    // Single Traveling Photon Pulse along the Energy Ring
    const photonGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const photonMesh = new THREE.Mesh(photonGeo, photonMat);
    buildCoreGroup.add(photonMesh);

    // 5e. Cohesive Assembly Fragments (IDEA → BUILD → INNOVATE)
    const fragmentCount = qualityLevel === 'high' ? 10 : 6;
    const fragments = [];
    const fragGeo = new THREE.OctahedronGeometry(0.055, 0);
    const fragMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.75
    });

    for (let i = 0; i < fragmentCount; i++) {
      const fragMesh = new THREE.Mesh(fragGeo, fragMat);
      const theta = (i / fragmentCount) * Math.PI * 2;
      const phi = ((i % 3) - 1) * 0.45;
      const baseRadius = 1.38 + (i % 2) * 0.25;

      fragMesh.position.set(
        Math.cos(theta) * baseRadius,
        Math.sin(theta) * baseRadius * 0.7 + phi,
        Math.sin(phi) * 0.6
      );

      buildCoreGroup.add(fragMesh);
      fragments.push({
        mesh: fragMesh,
        theta,
        phi,
        baseRadius,
        speed: 0.3 + (i % 3) * 0.15
      });
    }

    // 6. Very Subtle Background Digital Dust Particles (Drastically Reduced)
    // Only 60 particles, strictly positioned in the deep background (z < -2.0)
    const particleCount = qualityLevel === 'high' ? 65 : 35;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 16;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 10;
      particlePositions[idx + 2] = -2.5 - Math.random() * 5.0; // Strictly behind in depth

      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: qualityLevel === 'high' ? 0.045 : 0.035,
      color: 0x10b981,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 7. Interaction: Subtle Mouse Parallax & Smooth Scroll Transition
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;

    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Render Loop (Target 60 FPS — Slow & Cinematic)
    let animationFrameId;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp (subtle)
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      if (!reducedMotion) {
        // Slow rotation of the Core
        nucleusMesh.rotation.y += 0.005;
        nucleusMesh.rotation.x += 0.003;

        shellMesh.rotation.y -= 0.004;
        shellMesh.rotation.z += 0.003;

        shroudMesh.rotation.y += 0.002;

        // Energy Stream Ring rotation
        streamRing.rotation.z += 0.006;

        // Pulse traveling photon around the stream ring
        const photonAngle = elapsed * 1.2;
        const ringRad = 1.22;
        photonMesh.position.set(
          Math.cos(photonAngle) * ringRad,
          Math.sin(photonAngle) * ringRad * 0.5,
          Math.sin(photonAngle) * ringRad * 0.8
        );

        // Core Breathing Pulse (Cycle: IDEA → BUILD → INNOVATE)
        const breathe = 1.0 + Math.sin(elapsed * 0.9) * 0.04;
        nucleusMesh.scale.set(breathe, breathe, breathe);
        corePointLight.intensity = 2.2 + Math.sin(elapsed * 1.8) * 0.7;

        // Assembly Fragments Cycle (move gently toward core, then breathe outward)
        const fragWave = Math.sin(elapsed * 0.8);
        fragments.forEach((f) => {
          const r = f.baseRadius + fragWave * 0.25;
          f.mesh.position.x = Math.cos(f.theta + elapsed * 0.1) * r;
          f.mesh.position.y = Math.sin(f.theta + elapsed * 0.1) * r * 0.65;
          f.mesh.rotation.y += 0.01;
        });

        // Background dust drift
        const pPos = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const v = particleVelocities[i];
          pPos[i3] += v.vx;
          pPos[i3 + 1] += v.vy;

          if (pPos[i3] > 8) pPos[i3] = -8;
          if (pPos[i3] < -8) pPos[i3] = 8;
          if (pPos[i3 + 1] > 5) pPos[i3 + 1] = -5;
          if (pPos[i3 + 1] < -5) pPos[i3 + 1] = 5;
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Parallax response on the Build Core (desktop only, subtle)
      buildCoreGroup.rotation.y = mouse.x * 0.15;
      buildCoreGroup.rotation.x = -mouse.y * 0.12;

      // Scroll Transition: As user scrolls down towards Tracks, the Core gently elevates and recedes
      const targetY = 2.1 - scrollProgress * 3.0;
      const targetZ = -1.2 - scrollProgress * 3.5;
      buildCoreGroup.position.y += (targetY - buildCoreGroup.position.y) * 0.05;
      buildCoreGroup.position.z += (targetZ - buildCoreGroup.position.z) * 0.05;

      // Camera stays calm and stable
      camera.position.x += (mouse.x * 0.25 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.18 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    render();

    // 9. Complete Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      nucleusGeo.dispose();
      nucleusMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      shroudGeo.dispose();
      shroudMat.dispose();
      streamRingGeo.dispose();
      streamRingMat.dispose();
      photonGeo.dispose();
      photonMat.dispose();
      fragGeo.dispose();
      fragMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isSupported, qualityLevel, reducedMotion]);

  if (!isSupported || qualityLevel === 'none') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default Nexack3DCanvas;
