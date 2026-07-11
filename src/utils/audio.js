// Web Audio API Sound Synthesizer for CabHub Alerts
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a single note/tone with custom options
const playTone = (freq, type, duration, delay = 0, volume = 0.1) => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    // Smooth envelope (fade-in, fade-out)
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    console.warn('Web Audio playback failed:', e);
  }
};

// Sound 1: Ride requested (rising arpeggio chime)
export const playRequestChime = () => {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, idx) => {
    playTone(freq, 'sine', 0.6, idx * 0.12, 0.1);
  });
};

// Sound 2: Driver ringtone for incoming requests (pulsing alert)
let ringInterval = null;
export const startIncomingRequestRing = () => {
  if (ringInterval) clearInterval(ringInterval);
  
  const ring = () => {
    playTone(523.25, 'sine', 0.15, 0, 0.08); // C5
    playTone(659.25, 'sine', 0.15, 0.08, 0.08); // E5
  };
  
  ring();
  ringInterval = setInterval(ring, 1200);
};

export const stopIncomingRequestRing = () => {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
};

// Sound 3: Ride completed success chime
export const playSuccessChime = () => {
  playTone(392.00, 'sine', 0.15, 0, 0.08); // G4
  playTone(523.25, 'sine', 0.15, 0.08, 0.08); // C5
  playTone(659.25, 'sine', 0.15, 0.16, 0.08); // E5
  playTone(783.99, 'sine', 0.4, 0.24, 0.12); // G5
};

// Sound 4: Emergency SOS siren (sweeping frequency)
export const playSirenSound = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    // Sweep sound frequency back and forth
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.9);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.warn(e);
  }
};
