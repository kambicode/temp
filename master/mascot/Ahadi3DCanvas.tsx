import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Ahadi3DCanvasProps {
  className?: string;
}

export function Ahadi3DCanvas({ className = '' }: Ahadi3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const emberBeaconLight = new THREE.PointLight(0xd97706, 4.0, 10);
    emberBeaconLight.position.set(0, -0.9, 0.4);
    scene.add(emberBeaconLight);

    const rimLight = new THREE.DirectionalLight(0xb45309, 1.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // 3. Root Mascot Group
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // 4. Procedural Arch Geometry (The KAMBi Arch)
    const curvePoints = [
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(1.1, 1.4, 0.1),
      new THREE.Vector3(1.4, 0.2, 0.2),
      new THREE.Vector3(1.1, -1.2, 0.1),
      new THREE.Vector3(0.5, -1.5, 0),
      new THREE.Vector3(-0.5, -1.5, 0),
      new THREE.Vector3(-1.1, -1.2, -0.1),
      new THREE.Vector3(-1.4, 0.2, -0.2),
      new THREE.Vector3(-1.1, 1.4, -0.1),
      new THREE.Vector3(0, 2.2, 0),
    ];
    const archCurve = new THREE.CatmullRomCurve3(curvePoints, true);
    const archGeometry = new THREE.TubeGeometry(archCurve, 128, 0.18, 24, true);

    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.25,
      metalness: 0.85,
    });
    const archMesh = new THREE.Mesh(archGeometry, archMaterial);
    mascotGroup.add(archMesh);

    // 5. Ahadi Core Beacon (Concentric Amber Sphere & Halo)
    const beaconGeometry = new THREE.SphereGeometry(0.42, 32, 32);
    const beaconMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.4,
    });
    const beaconMesh = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beaconMesh.position.set(0, -0.9, 0.2);
    mascotGroup.add(beaconMesh);

    // White core dot (matching the signature KAMBi logo hollow)
    const coreDotGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const coreDotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreDotMesh = new THREE.Mesh(coreDotGeo, coreDotMat);
    coreDotMesh.position.set(0, -0.9, 0.52);
    mascotGroup.add(coreDotMesh);

    // 6. Constellation Particle Cloud (African Field Data Nodes)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 0.05 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Interactive Mouse Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.2;
      targetRotX = y * 0.8;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 8. Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth camera / rotation interpolation
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      mascotGroup.rotation.x = currentRotX + Math.sin(elapsed * 0.8) * 0.05;
      mascotGroup.rotation.y = currentRotY + Math.cos(elapsed * 0.6) * 0.08;
      mascotGroup.position.y = Math.sin(elapsed * 1.4) * 0.12;

      // Pulse beacon
      const beaconScale = 1.0 + Math.sin(elapsed * 3.0) * 0.08;
      beaconMesh.scale.set(beaconScale, beaconScale, beaconScale);
      emberBeaconLight.intensity = 3.5 + Math.sin(elapsed * 3.0) * 1.5;

      // Constellation rotation
      particleSystem.rotation.y = elapsed * 0.08;
      particleSystem.rotation.x = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      archGeometry.dispose();
      archMaterial.dispose();
      beaconGeometry.dispose();
      beaconMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
    />
  );
}
