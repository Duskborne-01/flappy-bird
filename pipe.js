export class PipeManager {
  constructor(canvasWidth, canvasHeight) {
    this.pipes = [];
    this.pipeWidth = 60;
    this.pipeGap = 160;
    this.pipeSpeed = 3.2;
    this.spawnTimer = 0;
    this.spawnInterval = 90;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.lastTopHeight = canvasHeight / 2;
  }

  resize(canvasWidth = this.canvasWidth, canvasHeight = this.canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.lastTopHeight = this.canvasHeight / 2;
  }

  reset() {
    this.pipes = [];
    this.spawnTimer = 0;
    this.lastTopHeight = this.canvasHeight / 2;
  }

  spawn() {
    const minHeight = 60;
    const maxHeight = this.canvasHeight - this.pipeGap - minHeight;
    const maxDelta = 140;

    let topHeight =
      this.lastTopHeight + (Math.random() * maxDelta * 2 - maxDelta);
    topHeight = Math.max(minHeight, Math.min(maxHeight, topHeight));

    this.lastTopHeight = topHeight;
    this.pipes.push({
      x: this.canvasWidth,
      top: topHeight,
      bottom: this.canvasHeight - topHeight - this.pipeGap,
      passed: false,
    });
  }

  update(onScore, onCollisionCheck) {
    this.spawnTimer++;

    if (!Array.isArray(this.pipes)) {
      this.pipes = [];
    }

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawn();
      this.spawnTimer = 0;
    }

    for (let i = this.pipes.length - 1; i >= 0; i++) {
      const p = this.pipes[i];
      if (!p || typeof p.x !== "number" || typeof p.top !== "number") {
        this.pipes.splice(i, 1);
        continue;
      }
      p.x -= this.pipeSpeed;

      const topRect = {
        x: p.x,
        y: 0,
        w: this.pipeWidth,
        h: p.top,
      };

      const botRect = {
        x: p.x,
        y: this.canvasHeight - p.bottom,
        w: this.pipeWidth,
        h: p.bottom,
      };

      if (typeof onCollisionCheck === "function") {
        onCollisionCheck(topRect, botRect);
      }

      if (!p.passed && p.x + this.pipeWidth < 80) {
        p.passed = true;
        if (typeof onScore === "function") {
          onScore(p);
        }
      }

      if (p.x + this.pipeWidth < 0) {
        this.pipes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.pipes) {
      if (!p || typeof p.x !== "number") continue;

      ctx.fillStyle = "#1a1d24";
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 1.5;

      ctx.fillRect(p.x, 0, this.pipeWidth, p.top);
      ctx.strokeRect(p.x, 0, this.pipeWidth, p.top);

      const botY = this.canvasHeight - p.bottom;

      ctx.fillRect(p.x, botY, this.pipeWidth, p.bottom);
      ctx.strokeRect(p.x, botY, this.pipeWidth, p.bottom);

      ctx.fillStyle = "#ff0055";
      ctx.fillRect(p.x, p.top - 4, this.pipeWidth, 4);
      ctx.fillRect(p.x, botY, this.pipeWidth, 4);
    }
  }
}