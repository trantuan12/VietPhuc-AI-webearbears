// Web Audio API Synthesizer for Vietnamese Heritage Ambience
// Zero external files, 100% offline, zero latency

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a resonant, warm Vietnamese bronze temple bell / gong tone
 */
export function playHeritageGong(isMuted: boolean = false) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master Gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, now);
  masterGain.connect(ctx.destination);

  // Fundamental frequencies of bronze bell (Vietnamese pentatonic harmonics)
  const freqs = [174.61, 261.63, 349.23, 523.25, 783.99]; // F-C-F-C-G resonant chime
  const decays = [3.5, 3.0, 2.4, 1.8, 1.2];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now);

    // Exponential decay curve
    gain.gain.setValueAtTime(0.2 / (i + 1), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[i]);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + decays[i]);
  });
}

/**
 * Play a gentle wooden door creak resonance
 */
export function playDoorOpenCreak(isMuted: boolean = false) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.12, now);
  master.connect(ctx.destination);

  // Low wooden rumble + friction
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, now);
  osc.frequency.linearRampToValueAtTime(65, now + 1.6);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(220, now);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc.start(now);
  osc.stop(now + 1.8);
}

/**
 * Play a delicate wind chime / harp shimmer on station transition
 */
export function playStationChime(isMuted: boolean = false, noteIndex: number = 0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.15, now);
  master.connect(ctx.destination);

  // Vietnamese pentatonic notes (Hò, Xự, Xang, Xê, Cống): D4, F4, G4, A4, C5
  const scale = [587.33, 698.46, 783.99, 880.0, 1046.5];
  const baseFreq = scale[noteIndex % scale.length];

  [baseFreq, baseFreq * 1.5].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.15, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.4);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 1.4);
  });
}
