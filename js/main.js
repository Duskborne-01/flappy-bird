import { GameEngine } from "./game.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const engine = new GameEngine(canvas);

  window.addEventListener("resize", () => engine.resize());

  const triggerAction = () => {
    if (engine.state === "PLAYING") {
      engine.triggerJump();
    }
  };

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      triggerAction();
    }

    if (e.code === "KeyI") {
      engine.shader.toggle();
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    triggerAction();
  });

  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      triggerAction();
    },
    {
      passive: false,
    },
  );

  document.getElementById("start-btn").addEventListener("click", () => {
    engine.start();
  });

  engine.loop();
});
