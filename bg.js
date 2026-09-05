export class DynamicBackground {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.scrollX = 0;
    this.buildings = [];
    this.blinkTimer = 0;
    this.blinkState = true;
    this.FACES = {
      NEUTRAL: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],

      SMILEY: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],

      SAD: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
        1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      ],

      ANGRY: [
        1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    };

    this.generateBuildings();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.generateBuildings();
  }

  generateBuildings() {
    this.buildings = [];

    let currentX = 0;

    while (currentX < this.width + 300) {
      this.buildings.push(this.createBuilding(currentX));

      const lastB = this.buildings[this.buildings.length - 1];

      currentX += lastB.width + Math.floor(Math.random() * 15) + 5;
    }
  }

  createBuilding(startX) {
    const isBillboard = Math.random() < 1 / 15;
    const bWidth = isBillboard ? 80 : Math.floor(Math.random() * 50) + 50;
    const bHeight = Math.floor(Math.random() * (this.height * 0.35)) + 140;

    if (isBillboard) {
      const faces = ["SMILEY", "SAD", "ANGRY"];
      const initialFace = faces[Math.floor(Math.random() * faces.length)];

      return {
        type: "BILLBOARD",
        x: startX,
        width: bWidth,
        height: bHeight,
        currentFace: initialFace,
        seen: false,
        transitioning: false,
        transitionStep: 0,
        targetFace: null,
      };
    }

    const windows = [];
    const cols = Math.floor((bWidth - 12) / 10);
    const rows = Math.floor((bHeight - 20) / 14);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          relX: 8 + c * 10,
          relY: 12 + r * 14,
          active: Math.random() > 0.4,
        });
      }
    }

    return {
      type: "NORMAL",
      x: startX,
      width: bWidth,
      height: bHeight,
      windows: windows,
    };
  }

  update(speed = 0.5, currentScore = 0) {
    this.scrollX += speed;
    this.blinkTimer++;

    if (this.blinkTimer >= 15) {
      this.blinkTimer = 0;
      this.blinkState = !this.blinkState;

      for (const b of this.buildings) {
        if (b.type === "BILLBOARD" && b.transitioning) {
          b.transitionStep++;

          if (b.transitionStep === 1) {
            b.currentFace = "NEUTRAL";
          } else if (b.transitionStep === 3) {
            b.currentFace = b.targetFace;
            b.transitioning = false;
          }
        }
      }
    }

    const cycle = currentScore % 200;

    let targetLightRatio = 0.5;

    if (cycle <= 100) {
      targetLightRatio = Math.max(0, 1 - cycle / 100);
    } else {
      targetLightRatio = Math.min(1, (cycle - 100) / 100);
    }

    for (const b of this.buildings) {
      if (b.x - this.scrollX + b.width < 0) {
        let maxX = 0;

        for (const other of this.buildings) {
          if (other.x > maxX) maxX = other.x;
        }

        const newB = this.createBuilding(
          maxX + b.width + Math.floor(Math.random() * 15) + 5,
        );

        Object.assign(b, newB);
      }

      const renderX = Math.floor(b.x - this.scrollX);

      if (b.type === "BILLBOARD") {
        const frameX = renderX + (b.width - 64) / 2;
        const isFrameVisible = frameX > 50 && frameX + 64 < this.width - 50;

        if (!b.seen && isFrameVisible) {
          b.seen = true;

          if (Math.random() < 1 / 3 && b.currentFace !== "NEUTRAL") {
            const availableFaces = ["SMILEY", "SAD", "ANGRY"].filter(
              (face) => face !== b.currentFace,
            );

            b.targetFace =
              availableFaces[Math.floor(Math.random() * availableFaces.length)];
            b.transitioning = true;
            b.transitionStep = 0;
          }
        }
      } else if (b.type === "NORMAL") {
        for (const w of b.windows) {
          if (w.active && Math.random() < 0.0005) {
            w.active = false;
          } else if (!w.active && Math.random() < targetLightRatio * 0.001) {
            w.active = true;
          }

          if (targetLightRatio === 0) {
            w.active = false;
          }
        }
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#090b0f";
    ctx.strokeStyle = "#121620";
    ctx.lineWidth = 1;

    for (const b of this.buildings) {
      const renderX = Math.floor(b.x - this.scrollX);
      const renderY = this.height - b.height;

      if (renderX + b.width > -50 && renderX < this.width + 50) {
        ctx.fillRect(renderX, renderY, b.width, b.height);
        ctx.strokeRect(renderX, renderY, b.width, b.height);
      }
    }

    ctx.fillStyle = "#1a1d24";
    ctx.beginPath();

    for (const b of this.buildings) {
      if (b.type !== "NORMAL") continue;

      const renderX = Math.floor(b.x - this.scrollX);
      const renderY = this.height - b.height;

      if (renderX + b.width > -50 && renderX < this.width + 50) {
        for (const w of b.windows) {
          if (!w.active) {
            ctx.rect(renderX + w.relX, renderY + w.relY, 6, 8);
          }
        }
      }
    }

    ctx.fill();
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();

    for (const b of this.buildings) {
      if (b.type !== "NORMAL") continue;

      const renderX = Math.floor(b.x - this.scrollX);
      const renderY = this.height - b.height;

      if (renderX + b.width > -50 && renderX < this.width + 50) {
        for (const w of b.windows) {
          if (w.active) {
            ctx.rect(renderX + w.relX, renderY + w.relY, 6, 8);
          }
        }
      }
    }

    ctx.fill();

    for (const b of this.buildings) {
      if (b.type !== "BILLBOARD") continue;

      const renderX = Math.floor(b.x - this.scrollX);
      const renderY = this.height - b.height;

      if (renderX + b.width > -50 && renderX < this.width + 50) {
        const frameX = renderX + (b.width - 64) / 2;
        const frameY = renderY + 20;

        ctx.strokeStyle = "#00f0ff";
        ctx.strokeRect(frameX - 2, frameY - 2, 68, 68);

        const matrix = this.FACES[b.currentFace];

        ctx.fillStyle = this.blinkState ? "#00f0ff" : "#1a1d24";
        ctx.beginPath();

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (matrix[r * 8 + c] === 1) {
              ctx.rect(frameX + c * 8, frameY + r * 8, 6, 6);
            }
          }
        }

        ctx.fill();
      }
    }

    ctx.restore();
  }
}