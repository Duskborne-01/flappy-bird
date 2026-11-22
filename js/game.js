import { PhysicsEngine } from "./physics.js";

import { ParticleEngine } from "./particles.js";

import { LightningEngine } from "./lightning.js";

import { SoundEngine } from "./sfx.js";

import { MusicEngine } from "./bgm.js";

import { DynamicBackground } from "./bg.js";

import { Bird } from "./bird.js";

import { PipeManager } from "./pipe.fixed.js";

import { ViewRenderer } from "./renderer.js";

import { ShaderEngine } from "./shader.js";

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.physics = new PhysicsEngine();
    this.particles = new ParticleEngine();
    this.lightning = new LightningEngine();
    this.sound = new SoundEngine();
    this.bgm = new MusicEngine();
    this.background = new DynamicBackground(canvas.width, canvas.height);
    this.renderer = new ViewRenderer(this.canvas, this.ctx);
    this.shader = new ShaderEngine(canvas.width, canvas.height);
    this.bird = new Bird(80, 0);
    this.pipeManager = new PipeManager(canvas.width, canvas.height);
    this.state = "MENU";
    this.score = 0;
    this.highScore = localStorage.getItem("TB_HIGHSCORE") || 0;
    this.screenShake = 0;
    this.initUI();
    this.resize();
  }

  initUI() {
    document.getElementById("hi-val").innerText = String(
      this.highScore,
    ).padStart(3, "0");
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.shader.resize(this.canvas.width, this.canvas.height);
    this.pipeManager.resize(this.canvas.width, this.canvas.height);
    this.background.resize(this.canvas.width, this.canvas.height);

    if (this.state === "MENU") {
      this.bird.reset(this.canvas.height / 2);
    }
  }

  render() {
    this.ctx.save();
    this.renderer.applyShake(this.screenShake);
    this.renderer.clear();
    this.renderer.drawGrid();
    this.background.render(this.ctx);
    this.pipeManager.render(this.ctx);
    this.particles.render(this.ctx);
    this.lightning.render(this.ctx);

    if (this.state !== "GAMEOVER") {
      this.bird.render(this.ctx);
    }

    this.ctx.restore();
    this.shader.applyInvertPass(this.ctx);
  }

  start() {
    this.sound.init();
    this.bgm.start();
    this.state = "PLAYING";
    this.score = 0;
    this.screenShake = 0;
    this.bird.reset(this.canvas.height / 2);
    this.pipeManager.reset();

    document.querySelector(".score-val").innerText = "000";
    document.getElementById("overlay").classList.remove("visible");
  }

  triggerJump() {
    if (this.state === "PLAYING") {
      this.physics.jump(this.bird);
      this.particles.spawnThrust(this.bird.x, this.bird.y + this.bird.h / 2);
      this.sound.playThrust();
    }
  }

  triggerMilestoneCelebration() {
    this.screenShake = 10;

    for (let i = 0; i < 4; i++) {
      this.particles.spawnExplosion(
        Math.random() * this.canvas.width,
        Math.random() * (this.canvas.height / 2),
      );
    }
  }

  gameOver() {
    if (this.state === "GAMEOVER") return;

    this.state = "GAMEOVER";
    this.bgm.stop();
    this.screenShake = 15;
    this.particles.spawnExplosion(
      this.bird.x + this.bird.w / 2,
      this.bird.y + this.bird.h / 2,
    );
    this.sound.playExplosion();

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("TB_HIGHSCORE", this.highScore);
      document.getElementById("hi-val").innerText = String(
        this.highScore,
      ).padStart(3, "0");
    }

    setTimeout(() => {
      document.getElementById("overlay").classList.add("visible");
    }, 400);
  }

  update() {
    this.background.update(this.state === "PLAYING" ? 0.8 : 0.2, this.score);
    this.particles.update();
    this.lightning.update(
      this.state === "PLAYING" ? this.pipeManager.pipeSpeed : 0,
    );

    if (this.screenShake > 0) this.screenShake *= 0.85;
    if (this.state !== "PLAYING") return;

    this.physics.applyGravity(this.bird);
    this.bird.updateRotation();

    if (this.bird.y < 0 || this.bird.y + this.bird.h > this.canvas.height) {
      this.gameOver();
    }

    this.pipeManager.update(
      (pipe) => {
        this.score++;
        this.sound.playScore();

        document.querySelector(".score-val").innerText = String(
          this.score,
        ).padStart(3, "0");

        if (this.score > 0 && this.score % 100 === 0) {
          this.triggerMilestoneCelebration();
        }

        this.lightning.trigger(
          pipe.x + this.pipeManager.pipeWidth,
          pipe.top,
          pipe.x + this.pipeManager.pipeWidth,
          pipe.top + this.pipeManager.pipeGap,
        );
      },
      (topRect, botRect) => {
        if (
          this.physics.checkAABB(this.bird, topRect) ||
          this.physics.checkAABB(this.bird, botRect)
        ) {
          this.gameOver();
        }
      },
    );
  }

  render() {
    this.ctx.save();
    this.renderer.applyShake(this.screenShake);
    this.renderer.clear();
    this.renderer.drawGrid();
    this.background.render(this.ctx);
    this.pipeManager.render(this.ctx);
    this.particles.render(this.ctx);
    this.lightning.render(this.ctx);

    if (this.state !== "GAMEOVER") {
      this.bird.render(this.ctx);
    }

    this.ctx.restore();
  }

  loop() {
    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }
}
