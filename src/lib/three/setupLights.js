import * as THREE from "three";

export function setupLights(scene) {
  // 💡 중간 밝기, 자연스러운 전체 조명
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // 0.6 → 0.45
  scene.add(ambientLight);

  // ☀️ 중립적인 색감의 방향광
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 살짝 밝게
  directionalLight.color.setRGB(1.0, 0.95, 0.88); // 너무 노랗지 않게 중간 톤
  directionalLight.position.set(5, 8, 6);
  directionalLight.castShadow = true;

  // 🔍 그림자 선명도 조절
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.bias = -0.0005; // 떨림 방지
  directionalLight.shadow.radius = 2; // 6 → 2: 더 선명한 그림자

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;
  directionalLight.shadow.camera.left = -8;
  directionalLight.shadow.camera.right = 8;
  directionalLight.shadow.camera.top = 8;
  directionalLight.shadow.camera.bottom = -8;

  scene.add(directionalLight);
}
