import { TextureLoader, RepeatWrapping, SRGBColorSpace } from "three";

export function loadWoodTexturesAsync() {
  const loader = new TextureLoader();
  return Promise.all([
    new Promise(res => loader.load("/textures/wood/color.png", tex => res(tex))),
    new Promise(res => loader.load("/textures/wood/normalGL.png", tex => res(tex))),
    new Promise(res => loader.load("/textures/wood/roughness.png", tex => res(tex))),
  ]).then(([colorMap, normalMap, roughnessMap]) => {
    colorMap.colorSpace = SRGBColorSpace;
    [colorMap, normalMap, roughnessMap].forEach((tex) => {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(0.5, 0.5);
    });
    return { colorMap, normalMap, roughnessMap };
  });
}
