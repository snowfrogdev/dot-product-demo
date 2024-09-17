import { engineInit } from "littlejsengine";
import { SceneManager } from "./scene-manager";
import { FieldOfViewScene } from "./scenes/field-of-view.scene";

SceneManager.registerScene(new FieldOfViewScene());

engineInit(
  () => SceneManager.switchScene("field-of-view"),
  SceneManager.gameUpdate,
  SceneManager.gameUpdatePost,
  SceneManager.gameRender,
  SceneManager.gameRenderPost
);
