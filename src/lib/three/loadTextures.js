import { TextureLoader, RepeatWrapping, SRGBColorSpace } from "three";

export function loadWoodTextures() {
  const loader = new TextureLoader();

  const colorMap = loader.load("/textures/wood/color.png");
  const normalMap = loader.load("/textures/wood/normalGL.png");
  const roughnessMap = loader.load("/textures/wood/roughness.png");

  // ✅ 최신 방식: colorSpace 지정
  colorMap.colorSpace = SRGBColorSpace;

  [colorMap, normalMap, roughnessMap].forEach((tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(0.5, 0.5);
  });

  return { colorMap, normalMap, roughnessMap };
}
