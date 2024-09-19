import { engineInit } from "littlejsengine";
import { SceneManager } from "./extensions/scene-manager";
import { FieldOfViewScene } from "./scenes/field-of-view.scene";
import { LightingScene } from "./scenes/lighting.scene";

SceneManager.registerScene(new LightingScene());
SceneManager.registerScene(new FieldOfViewScene());

engineInit(
  () => SceneManager.switchScene("lighting"),
  SceneManager.gameUpdate,
  SceneManager.gameUpdatePost,
  SceneManager.gameRender,
  SceneManager.gameRenderPost
);
