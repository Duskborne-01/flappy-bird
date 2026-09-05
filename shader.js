export class ShaderEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.active = false;
    this.offscreen = document.createElement("canvas");
    this.offscreenCtx = this.offscreen.getContext("2d", {
      willReadFrequently: true,
    });

    this.resize(width, height);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.offscreen.width = w;
    this.offscreen.height = h;
    this.offscreenCtx = this.offscreen.getContext("2d", {
      willReadFrequently: true,
    });
  }

  toggle() {
    this.active = !this.active;
  }

  applyInvertPass(ctx) {
    if (!this.active) return;

    this.offscreenCtx.clearRect(0, 0, this.width, this.height);
    this.offscreenCtx.drawImage(ctx.canvas, 0, 0);

    const imgData = this.offscreenCtx.getImageData(
      0,
      0,
      this.width,
      this.height,
    );
    const data = imgData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }

    ctx.putImageData(imgData, 0, 0);
  }
}