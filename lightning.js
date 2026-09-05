export class LightningEngine {
  constructor() {
    this.bolts = [];
  }

  trigger(x1, y1, x2, y2) {
    this.bolts.push({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      segments: this.createSegments(x1, y1, x2, y2),
      life: 1.0,
      decay: 0.1,
    });
  }

  createSegments(x1, y1, x2, y2) {
    const segments = [];

    let curX = x1;
    let curY = y1;

    const steps = 8;
    const dx = (x2 - x1) / steps;
    const dy = (y2 - y1) / steps;

    for (let i = 0; i < steps; i++) {
      const nextX = curX + dx;
      const nextY = curY + dy;
      const offsetX = (Math.random() - 0.5) * 15;
      const offsetY = (Math.random() - 0.5) * 15;

      segments.push({
        x1: curX,
        y1: curY,
        x2: i === steps - 1 ? x2 : nextX + offsetX,
        y2: i === steps - 1 ? y2 : nextY + offsetY,
      });

      curX = nextX + offsetX;
      curY = nextY + offsetY;
    }

    return segments;
  }

  update(pipeSpeed = 0) {
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const bolt = this.bolts[i];
      bolt.life -= bolt.decay;

      for (const seg of bolt.segments) {
        seg.x1 -= pipeSpeed;
        seg.x2 -= pipeSpeed;
      }

      if (bolt.life <= 0) {
        this.bolts.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.strokeStyle = "#00f0ff";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 12;

    for (const bolt of this.bolts) {
      ctx.globalAlpha = bolt.life;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();

      for (const seg of bolt.segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }

      ctx.stroke();
    }

    ctx.restore();
  }
}