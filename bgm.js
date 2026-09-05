export class MusicEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;
    this.sequence = [65.41, 65.41, 77.78, 87.31, 65.41, 65.41, 58.27, 49.0];
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  start() {
    this.init();

    if (this.isPlaying) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.step = 0;

    const intervalMs = (60 / 130 / 2) * 1000;

    this.timer = setInterval(() => this.playSynthStep(), intervalMs);
  }

  stop() {
    this.isPlaying = false;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  playSynthStep() {
    if (!this.ctx || !this.isPlaying) return;

    const freq = this.sequence[this.step % this.sequence.length];
    this.step++;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      150,
      this.ctx.currentTime + 0.15,
    );

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}