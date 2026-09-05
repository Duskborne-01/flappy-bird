export class ParticleEngine {
  constructor() {
    this.particles = [];
  }

  spawnThrust(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: -2 - Math.random() * 3,
        vy: (Math.random() - 0.5) * 2,
        life: 1.0,
        decay: 0.04 + Math.random() * 0.03,
        color: Math.random() > 0.5 ? "#00f0ff" : "#00f0ff",
        size: Math.random() * 3 + 2,
      });
    }
  }

  spawnExplosion(x, y) {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        color: Math.random() > 0.3 ? "#ff0055" : "#ffb700",
        size: Math.random() * 4 + 2,
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    for (const p of this.particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }

    ctx.restore();
  }
}