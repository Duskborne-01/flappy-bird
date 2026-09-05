export class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 38;
    this.h = 28;
    this.vy = 0;
    this.rotation = 0;
  }

  reset(y) {
    this.y = y;
    this.vy = 0;
    this.rotation = 0;
  }

  updateRotation() {
    this.rotation = Math.min(
      Math.PI / 4,
      Math.max(-Math.PI / 4, this.vy * 0.1),
    );
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.rotation);

    const halfW = this.w / 2;
    const halfH = this.h / 2;

    ctx.fillStyle = "#121620";
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-halfW, 0);
    ctx.lineTo(-halfW + 10, halfH);
    ctx.lineTo(halfW - 8, -halfH + 4);
    ctx.lineTo(halfW, 0);
    ctx.lineTo(halfW - 8, halfH - 4);
    ctx.lineTo(-halfW + 10, halfH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1a1d24";
    ctx.beginPath();
    ctx.moveTo(-halfW + 8, -2);
    ctx.lineTo(0, -halfW + 2);
    ctx.lineTo(8, -2);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#ff0055";
    ctx.shadowColor = "#ff0055";
    ctx.shadowBlur = 8;
    ctx.fillRect(halfW - 12, -4, 5, 5);
    ctx.fillStyle = "#00f0ff";
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 6;
    ctx.fillRect(-halfW - 2, -3, 3, 6);
    ctx.restore();
  }
}