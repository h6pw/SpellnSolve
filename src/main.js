import './style.css';
import { desenharJogo } from './game/render.js';
import { createGame, updateGame, submitAnswer } from './core/state.js';
import { settings } from './core/settings.js';
import { bindInput } from './game/input.js';
import { readRecord, saveRecord } from './game/storage.js';
import { createAudio } from './game/audio.js';
const $ = id => document.getElementById(id);
const setText = (id, value) => { const node = $(id); const text = String(value); if (node.textContent !== text) node.textContent = text; };
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Não foi possível iniciar o Canvas.');
let storage;
try { storage = window.localStorage; } catch { storage = null; }
const audio = createAudio(storage);
function refreshAudio() {
  const { music, effects, volume } = audio.preferences;
  $('music-toggle').setAttribute('aria-pressed', String(music));
  $('effects-toggle').setAttribute('aria-pressed', String(effects));
  $('music-toggle').textContent = music ? '♫ Música' : '♫ Música off';
  $('effects-toggle').textContent = effects ? '✦ Efeitos' : '✦ Efeitos off';
  $('audio-volume').value = Math.round(volume * 100);
}
$('music-toggle').addEventListener('click', () => { audio.setMusic(!audio.preferences.music); refreshAudio(); });
$('effects-toggle').addEventListener('click', () => { audio.setEffects(!audio.preferences.effects); refreshAudio(); });
$('audio-volume').addEventListener('input', event => audio.setVolume(Number(event.target.value) / 100));
let record = readRecord(storage);
let state = null;
let last = null;
function refresh() {
  $('score').textContent = state?.score ?? 0;
  $('lives').textContent = state?.lives ?? 3;
  $('level').textContent = state?.level ?? 1;
  $('record').textContent = record;
  setText('feedback', state?.message ?? 'Escolha uma dificuldade e entre no bosque.');
  setText('challenges', state?.enemies.map(e => {
    const { a, operacao, b } = e.desafio;
    return `${a} ${operacao === '*' ? '×' : operacao === '/' ? '÷' : operacao} ${b}`;
  }).join(' • ') || 'O bosque está tranquilo…');
  $('menu').hidden = state !== null;
  $('gameover').hidden = state?.status !== 'over';
  $('answer').disabled = state?.status !== 'playing';
  $('cast').disabled = state?.status !== 'playing';
  if (state?.status === 'over') $('final-score').textContent = state.score;
}
function start() {
  audio.stop();
  state = createGame($('difficulty').value);
  if (!audio.start()) {
    $('music-toggle').disabled = true; $('effects-toggle').disabled = true; $('audio-volume').disabled = true;
    $('audio-controls').title = 'Áudio indisponível neste navegador; a partida continua normalmente.';
  }
  updateGame(state, 0); last = null; refresh(); $('answer').focus();
}
$('play').addEventListener('click', start);
$('restart').addEventListener('click', start);
$('back').addEventListener('click', () => { audio.stop(); state = null; refresh(); $('play').focus(); });
$('difficulty').addEventListener('change', () => { $('difficulty-help').textContent = settings[$('difficulty').value].description; });
bindInput($('answer-form'), $('answer'), raw => {
  if (state) {
    const level = state.level;
    const correct = submitAnswer(state, raw);
    audio.effect(correct ? (state.level > level ? 'wave' : 'correct') : 'wrong');
    record = saveRecord(storage, state.score); refresh();
  }
});
document.addEventListener('visibilitychange', () => { last = null; audio.setHidden(document.hidden); });
window.addEventListener('pagehide', () => { audio.setHidden(true); });
window.addEventListener('pageshow', () => { audio.setHidden(document.hidden); });
function frame(time) {
  const delta = last === null ? 0 : Math.min((time - last) / 1000, 0.05);
  last = time;
  if (state && !document.hidden) {
    const before = state.status, lives = state.lives;
    updateGame(state, delta); refresh();
    if (before !== state.status && state.status === 'over') {
      audio.stop(); audio.effect('over'); $('restart').focus();
    } else if (state.lives < lives) audio.effect('life');
  }
  desenharJogo(ctx, canvas.width, canvas.height, state?.enemies ?? [], state?.effects ?? [], time / 1000);
  requestAnimationFrame(frame);
}
refreshAudio(); refresh(); requestAnimationFrame(frame);
fetch(`${import.meta.env.BASE_URL}version.json`).then(r => r.ok ? r.json() : null)
  .then(v => { if (v) $('version').textContent = `v${v.version} · ${v.commit.slice(0, 7)}${v.dirty ? ' · alterações locais' : ''}`; }).catch(() => {});
