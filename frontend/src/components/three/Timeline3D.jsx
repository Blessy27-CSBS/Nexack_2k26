import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Calendar, Clock, ChevronRight, ChevronLeft, Play, Pause, Compass } from 'lucide-react';
import { useWebGL } from '../../hooks/useWebGL';
import EmptyState from '../EmptyState';

/**
 * Timeline3D
 * An interactive 3D WebGL experience visualizing the hackathon milestone journey.
 * Uses real timeline items from the database.
 * Features:
 * 1. 3D Spline cyber-path winding through digital space.
 * 2. Station milestone nodes at each phase.
 * 3. Traveling energy packet (photon) gliding along the timeline curve.
 * 4. Interactive selection, camera pan, and phase inspection.
 * 5. Full WebGL fallback & reduced-motion responsiveness.
 */
const Timeline3D = ({ timeline = [] }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { isSupported, qualityLevel, isMobile, reducedMotion } = useWebGL();

  // Safety check: if no timeline items from database
  if (!timeline || timeline.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Schedule will be announced soon."
        message="The organizing committee is scheduling the hackathon milestones."
      />
    );
  }

  // Safe active milestone item
  const currentItem = timeline[activeIndex] || timeline[0];

  useEffect(() => {
    if (!isSupported || qualityLevel === 'none' || isMobile || reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 420;

    // 1. Scene & Depth Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080a, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
    camera.position.set(0, 2.6, 6.8);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: qualityLevel === 'high',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x10b981, 2.5);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 3.2, 20);
    purpleLight.position.set(-4, -2, 2);
    scene.add(purpleLight);

    // 5. Build 3D Curved Path from Real Timeline Items
    const count = timeline.length;
    const curvePoints = [];
    const spanX = Math.max(count * 1.5, 6);

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const x = (t - 0.5) * spanX;
      // Sine wave elevation and depth variation
      const y = Math.sin(t * Math.PI * 2) * 0.75;
      const z = Math.cos(t * Math.PI) * 1.1;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const pathGeometry = new THREE.TubeGeometry(curve, Math.max(count * 20, 64), 0.035, 12, false);
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.8
    });
    const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    scene.add(pathMesh);

    // 6. Milestone Nodes along the path
    const nodeMeshes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.24, 0);
    const haloGeo = new THREE.TorusGeometry(0.38, 0.018, 12, 32);

    curvePoints.forEach((pt, idx) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pt);

      const nodeMat = new THREE.MeshStandardMaterial({
        color: idx === activeIndex ? 0x10b981 : 0xa855f7,
        emissive: idx === activeIndex ? 0x10b981 : 0x581c87,
        emissiveIntensity: idx === activeIndex ? 1.4 : 0.6,
        roughness: 0.2,
        metalness: 0.9
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeGroup.add(nodeMesh);

      const haloMat = new THREE.MeshBasicMaterial({
        color: idx === activeIndex ? 0x10b981 : 0x7e22ce,
        transparent: true,
        opacity: 0.7
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(haloMesh);

      scene.add(nodeGroup);
      nodeMeshes.push({ group: nodeGroup, mesh: nodeMesh, halo: haloMesh, pt, index: idx });
    });

    // 7. Animated Energy Packet (Photon) traveling along the curve
    const photonGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const photonMesh = new THREE.Mesh(photonGeo, photonMat);
    scene.add(photonMesh);

    const photonLight = new THREE.PointLight(0x10b981, 4.0, 5);
    photonMesh.add(photonLight);

    // 8. Ground Grid for Perspective
    const grid = new THREE.GridHelper(30, 30, 0x10b981, 0x1e1b4b);
    grid.position.y = -2.2;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    scene.add(grid);

    // 9. Mouse interaction & Camera targeting
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    container.addEventListener('mousemove', onMouseMove, { passive: true });

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let photonProgress = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();

      // Animate Traveling Energy Packet
      if (isPlaying) {
        photonProgress = (photonProgress + delta * 0.12) % 1.0;
      }
      const photonPos = curve.getPointAt(photonProgress);
      photonMesh.position.copy(photonPos);

      // Rotate Milestone Nodes
      nodeMeshes.forEach((item) => {
        item.mesh.rotation.y += 0.015;
        item.mesh.rotation.x += 0.008;
        item.halo.rotation.z += 0.01;

        // Dynamic scale if active
        const isActive = item.index === activeIndex;
        const targetScale = isActive ? 1.35 : 1.0;
        item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      // Smooth camera interpolation towards selected node
      const targetNodePt = curvePoints[activeIndex] || new THREE.Vector3(0, 0, 0);
      const targetCamX = targetNodePt.x * 0.45 + mouseX * 0.4;
      const targetCamY = 2.4 + mouseY * 0.3;
      const targetCamZ = 6.4 - Math.abs(targetNodePt.x) * 0.2;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(targetNodePt.x * 0.5, targetNodePt.y, 0);

      renderer.render(scene, camera);
    };

    render();

    // 11. Cleanup
    return () => {
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      pathGeometry.dispose();
      pathMaterial.dispose();
      nodeGeo.dispose();
      haloGeo.dispose();
      photonGeo.dispose();
      photonMat.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [timeline, activeIndex, isPlaying, isSupported, qualityLevel, isMobile, reducedMotion]);

  // If on mobile or WebGL disabled: return clean responsive vertical timeline
  if (!isSupported || qualityLevel === 'none' || isMobile || reducedMotion) {
    return (
      <div className="relative border-l-2 border-emerald-500/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-6">
        {timeline.map((item, idx) => (
          <div key={item._id || idx} className="relative group">
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#07080a] border-2 border-emerald-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-neon-emerald">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="cyber-card p-5 border border-white/10 hover:border-emerald-500/40 transition-all rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 w-fit">
                  PHASE {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono text-zinc-400">{item.date} {item.time && `• ${item.time}`}</span>
              </div>
              <h4 className="font-heading font-bold text-base text-white mb-1">{item.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop / Tablet Interactive 3D Spline Experience
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#090b14] via-[#0d101a] to-[#07080a] p-6 sm:p-8 shadow-2xl overflow-hidden">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            3D Chronological Pipeline
          </span>
          <h3 className="font-heading font-black text-xl sm:text-2xl text-white mt-1 uppercase">
            Hackathon Mission Vector
          </h3>
        </div>

        {/* Phase Navigator & Photon Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-500/40 text-xs font-mono text-zinc-300 flex items-center space-x-1.5 transition-colors"
            title={isPlaying ? "Pause traveling pulse" : "Play traveling pulse"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isPlaying ? "Pulse Active" : "Pulse Paused"}</span>
          </button>

          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : timeline.length - 1))}
            className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-500/40 text-zinc-300 transition-colors"
            title="Previous Phase"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-emerald-400 font-bold px-2">
            {activeIndex + 1} / {timeline.length}
          </span>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % timeline.length)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-500/40 text-zinc-300 transition-colors"
            title="Next Phase"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Phase Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 3D WebGL Pipeline Canvas */}
        <div className="lg:col-span-7 relative flex items-center justify-center rounded-xl bg-zinc-950/50 border border-white/5 overflow-hidden">
          <div ref={containerRef} className="w-full h-[360px] sm:h-[420px]" />

          {/* Subtitle guidance */}
          <div className="absolute bottom-3 left-4 pointer-events-none">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-3 h-3 text-emerald-400" />
              <span>Camera follows active phase • Real-time photon trajectory</span>
            </span>
          </div>
        </div>

        {/* Phase Inspector Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="cyber-card p-6 border border-emerald-500/30 bg-zinc-900/90 rounded-xl shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                PHASE {String(activeIndex + 1).padStart(2, '0')} OF {String(timeline.length).padStart(2, '0')}
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentItem.date}</span>
              </div>
            </div>

            <h4 className="font-heading font-black text-xl text-white mb-2 leading-tight">
              {currentItem.title}
            </h4>

            {currentItem.time && (
              <div className="flex items-center space-x-1.5 text-xs font-mono text-amber-400 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Checkpoint Time: {currentItem.time}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {currentItem.description}
            </p>
          </div>

          {/* Phase Quick Select Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              Milestone Checkpoints:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {timeline.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item._id || idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-2.5 py-2 rounded-lg text-left text-xs font-mono transition-all truncate border flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-neon-emerald'
                        : 'bg-zinc-900/60 text-zinc-300 border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {item.title}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline3D;
