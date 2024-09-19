import { Application, Assets, Sprite, Spritesheet, Texture } from "pixi.js";
import * as foliageAtlas from "./foliage.json";

const app = new Application();
await app.init({resizeTo: window});
document.body.appendChild(app.canvas);

await  Assets.load("./foliage.png");

const foliageSpriteSheet = new Spritesheet(
  Texture.from(foliageAtlas.meta.image),
  foliageAtlas
);

await foliageSpriteSheet.parse();

const treeSprite = new Sprite(foliageSpriteSheet.textures["tree6.png"]);

treeSprite.anchor.set(0.5);
treeSprite.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(treeSprite);

app.ticker.add(() => {})