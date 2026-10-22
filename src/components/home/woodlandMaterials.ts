import { useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from "three";

export function makeBarkSampler(texture: Texture) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d")!;
  context.drawImage(texture.image as CanvasImageSource, 0, 0, 256, 256);
  const pixels = context.getImageData(0, 0, 256, 256).data;
  return (u: number, v: number) => {
    const x = Math.floor(((u * texture.repeat.x) % 1 + 1) % 1 * 255);
    const y = Math.floor((1 - ((v * texture.repeat.y) % 1 + 1) % 1) * 255);
    const offset = (y * 256 + x) * 4;
    return (pixels[offset] * .2126 + pixels[offset + 1] * .7152 + pixels[offset + 2] * .0722) / 255;
  };
}

export function useWoodlandTexture(kind: "bark" | "ground" | "leaves", repeatX = 1, repeatY = 1, rotation = 0) {
  const original = useLoader(TextureLoader, `/images/woodland/golden-${kind}.webp`);
  const { gl } = useThree();
  const texture = useMemo(() => {
    const result = original.clone();
    result.colorSpace = SRGBColorSpace;
    result.wrapS = result.wrapT = RepeatWrapping;
    result.repeat.set(repeatX, repeatY);
    result.rotation = rotation;
    result.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    result.needsUpdate = true;
    return result;
  }, [original, repeatX, repeatY, rotation, gl]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
