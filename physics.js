export class PhysicsEngine {
  constructor() {
    this.gravity = 0.45;
    this.jumpForce = -7.5;
    this.terminalVelocity = 10;
  }

  applyGravity(entity) {
    entity.vy += this.gravity;

    if (entity.vy > this.terminalVelocity) {
      entity.vy = this.terminalVelocity;
    }

    entity.y += entity.vy;
  }

  jump(entity) {
    entity.vy = this.jumpForce;
  }

  checkAABB(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }
}