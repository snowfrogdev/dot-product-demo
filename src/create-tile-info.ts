import { tile, TileInfo, vec2 } from "littlejsengine";
import { SpriteFrameData } from "./sprite-frame-data";

export function createTileInfos(frames: SpriteFrameData[], textureIndex: number): TileInfo[] {
  const tileInfos: TileInfo[] = [];
  for (const sprite of frames) {
    tileInfos.push(createTileInfo(sprite, textureIndex));
  }
  return tileInfos;
}

export function createTileInfo(sprite: SpriteFrameData, textureIndex: number): TileInfo {
  const spritePos = vec2(sprite.frame.x, sprite.frame.y);
  const spriteSize = vec2(sprite.frame.w, sprite.frame.h);
  return tile(spritePos, spriteSize, textureIndex);
}