// Melodia e timbres originais. Nenhum sample, arquivo remoto ou biblioteca.
const MELODY = [74, 0, 77, 81, 79, 0, 77, 0, 72, 0, 76, 79, 77, 0, 76, 0,
  70, 0, 74, 77, 76, 0, 74, 0, 69, 0, 72, 76, 74, 0, 69, 0];
const CHORDS = [[50, 57, 65], [48, 55, 64], [46, 53, 62], [45, 52, 60]];
const EFFECTS = {
  correct: [72, 76, 79], wrong: [50, 48], life: [55, 43],
  wave: [74, 77, 81, 86], over: [69, 65, 62, 50],
};
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

export function createAudio(storage, makeContext = () => {
  const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
  return Context ? new Context() : null;
}) {
  let preferences = { music: true, effects: true, volume: 0.6 };
  try {
    const saved = JSON.parse(storage?.getItem('spell-solve-audio') || 'null');
    if (saved && typeof saved.music === 'boolean' && typeof saved.effects === 'boolean'
      && Number.isFinite(saved.volume) && saved.volume >= 0 && saved.volume <= 1) preferences = saved;
  } catch { /* Preferências padrão se o armazenamento estiver indisponível. */ }
  let context, master, music, effects, timer;
  let playing = false, hidden = false, step = 0, nextNote = 0;
  const voices = new Set();

  function ensureContext() {
    if (context) return true;
    try {
      context = makeContext();
      if (!context) return false;
      master = context.createGain(); music = context.createGain(); effects = context.createGain();
      master.gain.value = preferences.volume;
      music.gain.value = 0; effects.gain.value = preferences.effects ? 0.65 : 0;
      music.connect(master); effects.connect(master); master.connect(context.destination);
      return true;
    } catch { context = null; return false; }
  }

  function note(midi, start, duration, amplitude, bus, type = 'sine') {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency(midi);
    const attack = type === 'triangle' ? 0.5 : 0.015;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(amplitude, start + Math.min(attack, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope); envelope.connect(bus);
    const voice = { oscillator, envelope, bus };
    voices.add(voice);
    oscillator.onended = () => { voices.delete(voice); oscillator.disconnect(); envelope.disconnect(); };
    oscillator.start(start); oscillator.stop(start + duration + 0.02);
  }

  function cancelMusic() {
    if (timer !== undefined) { globalThis.clearInterval(timer); timer = undefined; }
    if (music) music.gain.setTargetAtTime(0, context.currentTime, 0.05);
    for (const voice of voices) {
      if (voice.bus !== music) continue;
      voice.envelope.gain.cancelScheduledValues(context.currentTime);
      voice.envelope.gain.setTargetAtTime(0.0001, context.currentTime, 0.02);
      voice.oscillator.stop(context.currentTime + 0.08);
      voices.delete(voice);
    }
  }

  function schedule() {
    if (!playing || hidden || !preferences.music || context.state !== 'running') return;
    // Lookahead pequeno: limita notas futuras mesmo se o navegador atrasar.
    nextNote = Math.max(nextNote, context.currentTime + 0.025);
    while (nextNote < context.currentTime + 0.6) {
      if (step % 8 === 0) {
        for (const midi of CHORDS[Math.floor(step / 8) % CHORDS.length]) {
          note(midi, nextNote, 4.6, 0.07, music, 'triangle');
        }
      }
      const midi = MELODY[step % MELODY.length];
      if (midi) {
        note(midi, nextNote, 1.1, 0.18, music);
        note(midi + 12, nextNote + 0.18, 0.9, 0.025, music);
      }
      nextNote += 0.55; step++;
    }
  }

  function syncMusic() {
    cancelMusic();
    if (!context || !playing || hidden || !preferences.music || context.state !== 'running') return;
    music.gain.setTargetAtTime(0.3, context.currentTime, 0.15);
    nextNote = context.currentTime + 0.04;
    schedule(); timer = globalThis.setInterval(schedule, 200);
  }

  function resume() {
    if (!ensureContext()) return false;
    if (context.state === 'running') syncMusic();
    else context.resume().then(syncMusic).catch(() => { /* Falha de áudio não interrompe a partida. */ });
    return true;
  }

  function persist() {
    try { storage?.setItem('spell-solve-audio', JSON.stringify(preferences)); } catch { /* Sem persistência. */ }
  }

  return {
    get preferences() { return { ...preferences }; },
    start() { playing = true; step = 0; return resume(); },
    stop() { playing = false; cancelMusic(); },
    setHidden(value) {
      hidden = value; cancelMusic();
      if (!context) return;
      if (hidden) context.suspend().catch(() => {});
      else if (playing) resume();
    },
    setMusic(value) { preferences.music = Boolean(value); persist(); if (playing && !hidden) resume(); else cancelMusic(); },
    setEffects(value) {
      preferences.effects = Boolean(value); persist();
      if (effects) effects.gain.setTargetAtTime(preferences.effects ? 0.65 : 0, context.currentTime, 0.02);
    },
    setVolume(value) {
      if (!Number.isFinite(value)) return;
      preferences.volume = Math.max(0, Math.min(1, value)); persist();
      if (master) master.gain.setTargetAtTime(preferences.volume, context.currentTime, 0.04);
    },
    effect(name) {
      if (!context || hidden || !preferences.effects || context.state !== 'running') return;
      const sequence = EFFECTS[name];
      if (!sequence) return;
      sequence.forEach((midi, index) => note(midi, context.currentTime + 0.02 + index * 0.095,
        name === 'over' ? 0.55 : 0.25, 0.2, effects));
    },
    async dispose() {
      playing = false; cancelMusic();
      for (const voice of voices) { try { voice.oscillator.stop(); } catch { /* Voz já encerrada. */ } }
      voices.clear(); if (context && context.state !== 'closed') await context.close();
    },
  };
}
