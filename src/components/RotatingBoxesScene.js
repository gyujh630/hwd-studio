"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SRGBColorSpace } from "three"; // ✅ 추가
import { setupLights } from "@/lib/three/setupLights";
import { createGround } from "@/lib/three/createGround";
import { loadWoodTexturesAsync } from "@/lib/three/loadTextures";
import {
  createMaterialForBox,
  createSideMaterialForBox,
} from "@/lib/three/createMaterials";

export default function RotatingBoxesScene({ onLoaded }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 6, window.innerWidth <= 560 ? 11 : 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    setupLights(scene);
    scene.add(createGround());

    let handleResize;
    let animationId;
    let cleanupFns = [];
    loadWoodTexturesAsync().then(({ colorMap, normalMap, roughnessMap }) => {
      if (!isMounted) return;
      const group = new THREE.Group();
      scene.add(group);
      const total = 18;
      const boxSize = 0.7;
      const boxHeight = 4.4;
      const boxes = [];

      for (let i = 0; i < total; i++) {
        const topBottomMaterial = createMaterialForBox(
          i,
          total,
          colorMap,
          normalMap,
          roughnessMap
        );
        const sideMaterial = createSideMaterialForBox(
          i,
          total,
          colorMap,
          normalMap,
          roughnessMap
        );
        const materials = [
          sideMaterial,
          sideMaterial.clone(),
          topBottomMaterial,
          topBottomMaterial.clone(),
          sideMaterial.clone(),
          sideMaterial.clone(),
        ];
        const geometry = new THREE.BoxGeometry(boxSize, boxHeight, boxSize);
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.x = (i - total / 2) * boxSize + boxSize / 2;
        const offsetRatio = i / (total - 1);
        mesh.rotation.x = THREE.MathUtils.degToRad(offsetRatio * 180);
        group.add(mesh);
        boxes.push(mesh);
      }

      let rotationSpeed = 0.0015;
      const mouse = { x: 0, y: 0 };

      const onMouseMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 4 - 1;
        mouse.y = ((event.clientY - rect.top) / rect.height) * 4 + 1;
      };
      renderer.domElement.addEventListener("mousemove", onMouseMove);
      cleanupFns.push(() => renderer.domElement.removeEventListener("mousemove", onMouseMove));

      handleResize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        camera.position.set(0, 6, window.innerWidth <= 560 ? 11 : 6);
        camera.lookAt(0, 0, 0);
      };
      window.addEventListener("resize", handleResize);
      cleanupFns.push(() => window.removeEventListener("resize", handleResize));

      const baseY = 6;
      const baseZ = window.innerWidth <= 560 ? 11 : 6;

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        group.rotation.x += rotationSpeed;
        group.rotation.y += rotationSpeed;
        group.rotation.z += rotationSpeed;

        const targetX = -mouse.x * 1.5;
        const targetY = baseY + mouse.y * 0.5;

        camera.position.x += (targetX - camera.position.x) * 0.03;
        camera.position.y += (targetY - camera.position.y) * 0.03;
        camera.position.z = baseZ;

        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      if (onLoaded) onLoaded();

      // Clean-up function for Three.js resources
      cleanupFns.push(() => {
        if (animationId) cancelAnimationFrame(animationId);
        // Dispose all geometries, materials, and textures
        group.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.geometry) obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                if (mat.normalMap) mat.normalMap.dispose();
                if (mat.roughnessMap) mat.roughnessMap.dispose();
                mat.dispose && mat.dispose();
              });
            } else if (obj.material) {
              if (obj.material.map) obj.material.map.dispose();
              if (obj.material.normalMap) obj.material.normalMap.dispose();
              if (obj.material.roughnessMap) obj.material.roughnessMap.dispose();
              obj.material.dispose && obj.material.dispose();
            }
          }
        });
        renderer.dispose();
      });
    });

    return () => {
      isMounted = false;
      cleanupFns.forEach((fn) => fn());
    };
  }, [onLoaded]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        margin: "auto",
      }}
    />
  );
}
