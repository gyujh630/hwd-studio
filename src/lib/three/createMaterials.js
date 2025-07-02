import * as THREE from "three";

export function createMaterialForBox(
  index,
  total,
  colorMap,
  normalMap,
  roughnessMap
) {
  const offsetX = (index * 0.3) % 1;
  const offsetY = (index * 0.7) % 1;

  const cMap = colorMap.clone();
  const nMap = normalMap.clone();
  const rMap = roughnessMap.clone();

  [cMap, nMap, rMap].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(0.5, 0.5);
    tex.offset.set(offsetX, offsetY);
  });

  return new THREE.MeshStandardMaterial({
    map: cMap,
    normalMap: nMap,
    roughnessMap: rMap,
    roughness: 0.7,
    color: new THREE.Color(0.95, 0.9, 0.8),
  });
}

export function createSideMaterialForBox(
  index,
  total,
  colorMap,
  normalMap,
  roughnessMap
) {
  const offsetX = (index * 0.3) % 1;
  const offsetY = (index * 0.7) % 1;

  const cMap = colorMap.clone();
  const nMap = normalMap.clone();
  const rMap = roughnessMap.clone();

  [cMap, nMap, rMap].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(0.3, 0.2);
    tex.offset.set(offsetX, offsetY);
    tex.rotation = Math.PI / 2;
    tex.center.set(0.5, 0.5);
  });

  return new THREE.MeshStandardMaterial({
    map: cMap,
    normalMap: nMap,
    roughnessMap: rMap,
    metalness: 0.05,
    roughness: 0.8,
    color: new THREE.Color(0.8, 0.72, 0.6),
  });
}
