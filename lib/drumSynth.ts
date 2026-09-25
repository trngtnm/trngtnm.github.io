import {
  DEFAULT_BPM,
  TOTAL_STEPS,
  type DrumPattern,
  type DrumVoiceId,
} from "@/data/drumMachine";

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export class DrumSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private hatGain: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  async ensure() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.72;
      this.master.connect(this.ctx.destination);
      this.noise = noiseBuffer(this.ctx, 1.5);
    }
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  get context() {
    return this.ctx;
  }

  play(voice: DrumVoiceId, time: number) {
    if (!this.ctx || !this.master || !this.noise) return;
    switch (voice) {
      case "kick":
        this.kick(time);
        break;
      case "tomHi":
        this.tom(time, 240, 108, 0.28);
        break;
      case "tomMid":
        this.tom(time, 175, 78, 0.32);
        break;
      case "tomLow":
        this.tom(time, 125, 52, 0.38);
        break;
      case "closedHat":
        this.hat(time, 0.045, 0.22, 9000);
        break;
      case "openHat":
        this.hat(time, 0.28, 0.2, 7200);
        break;
      case "snare":
        this.snare(time);
        break;
      case "ride":
        this.cymbal(time, 0.45, 0.14, 4200, 0.7);
        break;
      case "crash1":
        this.cymbal(time, 1.15, 0.22, 2800, 0.45);
        break;
      case "crash2":
        this.cymbal(time, 1.35, 0.2, 2400, 0.38);
        break;
      case "clap":
        this.clap(time);
        break;
      case "rimshot":
        this.rimshot(time);
        break;
    }
  }

  cut() {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(0, now);
    const next = this.ctx.createGain();
    next.gain.value = 0.72;
    next.connect(this.ctx.destination);
    this.master = next;
    this.hatGain = null;
  }

  private kick(time: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(148, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.14);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.45);

    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "square";
    click.frequency.value = 820;
    clickGain.gain.setValueAtTime(0.12, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.018);
    click.connect(clickGain);
    clickGain.connect(this.master!);
    click.start(time);
    click.stop(time + 0.02);
  }

  private tom(time: number, start: number, end: number, dur: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(start, time);
    osc.frequency.exponentialRampToValueAtTime(end, time + dur * 0.7);
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  private hat(time: number, dur: number, gainValue: number, freq: number) {
    const ctx = this.ctx!;
    this.chokeHats(time);
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = freq;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    this.hatGain = gain;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    src.start(time);
    src.stop(time + dur + 0.02);
  }

  private snare(time: number) {
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1800;
    band.Q.value = 0.85;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.55, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    noise.connect(band);
    band.connect(noiseGain);
    noiseGain.connect(this.master!);
    noise.start(time);
    noise.stop(time + 0.2);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + 0.08);
    oscGain.gain.setValueAtTime(0.35, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
    osc.connect(oscGain);
    oscGain.connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  private cymbal(
    time: number,
    dur: number,
    gainValue: number,
    freq: number,
    q: number,
  ) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    src.start(time);
    src.stop(time + dur + 0.02);

    const metal = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metal.type = "triangle";
    metal.frequency.value = freq * 0.22;
    metalGain.gain.setValueAtTime(gainValue * 0.18, time);
    metalGain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.6);
    metal.connect(metalGain);
    metalGain.connect(this.master!);
    metal.start(time);
    metal.stop(time + dur * 0.65);
  }

  private clap(time: number) {
    const ctx = this.ctx!;
    for (const offset of [0, 0.012, 0.026]) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1400;
      band.Q.value = 0.7;
      const gain = ctx.createGain();
      const start = time + offset;
      gain.gain.setValueAtTime(0.42, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
      src.connect(band);
      band.connect(gain);
      gain.connect(this.master!);
      src.start(start);
      src.stop(start + 0.18);
    }
  }

  private rimshot(time: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(760, time);
    osc.frequency.exponentialRampToValueAtTime(320, time + 0.03);
    oscGain.gain.setValueAtTime(0.28, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.connect(oscGain);
    oscGain.connect(this.master!);
    osc.start(time);
    osc.stop(time + 0.06);

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const high = ctx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 2500;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);
    src.connect(high);
    high.connect(noiseGain);
    noiseGain.connect(this.master!);
    src.start(time);
    src.stop(time + 0.04);
  }

  private chokeHats(time: number) {
    if (!this.hatGain || !this.ctx) return;
    const gain = this.hatGain;
    const current = Math.max(gain.gain.value, 0.0001);
    gain.gain.cancelScheduledValues(time);
    gain.gain.setValueAtTime(current, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.014);
    this.hatGain = null;
  }
}

type StepListener = (step: number) => void;

export class DrumScheduler {
  private synth = new DrumSynth();
  private timer: number | null = null;
  private nextNoteTime = 0;
  private currentStep = 0;
  private bpm = DEFAULT_BPM;
  private pattern: DrumPattern | null = null;
  private playing = false;
  private listener: StepListener | null = null;
  private uiTimers = new Set<number>();

  setPattern(pattern: DrumPattern) {
    this.pattern = pattern;
  }

  setBpm(bpm: number) {
    this.bpm = bpm;
  }

  onStep(listener: StepListener) {
    this.listener = listener;
  }

  get isPlaying() {
    return this.playing;
  }

  async play() {
    if (this.playing) return;
    this.playing = true;
    this.synth = new DrumSynth();
    const ctx = await this.synth.ensure();
    if (!this.playing) return;
    this.currentStep = 0;
    this.nextNoteTime = ctx.currentTime + 0.04;
    this.listener?.(0);
    this.timer = window.setInterval(() => this.tick(), LOOKAHEAD_MS);
    this.tick();
  }

  stop() {
    this.playing = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    for (const id of this.uiTimers) window.clearTimeout(id);
    this.uiTimers.clear();
    this.synth.cut();
    this.currentStep = 0;
    this.listener?.(0);
  }

  private tick() {
    const ctx = this.synth.context;
    if (!ctx || !this.playing || !this.pattern) return;
    const secondsPer16th = 60 / this.bpm / 4;
    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      this.schedule(this.currentStep, this.nextNoteTime);
      this.nextNoteTime += secondsPer16th;
      this.currentStep = (this.currentStep + 1) % TOTAL_STEPS;
    }
  }

  private schedule(step: number, time: number) {
    const ctx = this.synth.context;
    if (!ctx || !this.pattern) return;
    for (const [voice, row] of Object.entries(this.pattern) as [
      DrumVoiceId,
      boolean[],
    ][]) {
      if (!row?.[step]) continue;
      try {
        this.synth.play(voice, time);
      } catch {
        // A single voice must not halt the sequencer clock.
      }
    }
    const delay = Math.max(0, (time - ctx.currentTime) * 1000);
    const id = window.setTimeout(() => {
      this.uiTimers.delete(id);
      if (this.playing) this.listener?.(step);
    }, delay);
    this.uiTimers.add(id);
  }
}
