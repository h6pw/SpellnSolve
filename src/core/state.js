import { criarInimigo, atualizarInimigo } from '../game/enemy.js';
import { WORLD } from './world.js';
import { settings } from './settings.js';
export function createGame(difficulty = 'facil') {
  if (!settings[difficulty]) throw new Error('Dificuldade inválida.');
  return { difficulty, status: 'playing', score: 0, lives: 3, level: 1,
    combo: 0, bestCombo: 0, nextEnemyId: 1, events: [], lastAnswer: null,
    defeated: 0, elapsed: 0, spawn: 0, enemies: [], effects: [], message: 'Prepare seu primeiro feitiço!' };
}
export function updateGame(state, delta) {
  if (state.status !== 'playing') return;
  if (!Number.isFinite(delta) || delta < 0) throw new Error('Tempo inválido.');
  state.elapsed += delta;
  state.level = 1 + Math.floor(state.defeated / 5);
  const config = settings[state.difficulty];
  state.spawn -= delta;
  if (state.spawn <= 0 && state.enemies.length < WORLD.maxEnemies) {
    const enemy = criarInimigo(state.difficulty, WORLD.width, WORLD.height, state.nextEnemyId++);
    enemy.born = state.elapsed;
    enemy.y = 350 + (Math.floor(state.elapsed) % 3) * 37;
    enemy.velocidade = config.speed * (1 + (state.level - 1) * 0.12);
    state.enemies.push(enemy);
    state.spawn = Math.max(1.5, config.spawnInterval - (state.level - 1) * 0.25);
  }
  for (const enemy of state.enemies) atualizarInimigo(enemy, delta);
  const arrivals = state.enemies.filter(enemy => enemy.x <= WORLD.boundary);
  state.enemies = state.enemies.filter(enemy => enemy.x > WORLD.boundary);
  if (arrivals.length) { state.combo = 0; emit(state, { type: 'damage' }); state.lives = Math.max(0, state.lives - arrivals.length); state.message = 'Um inimigo alcançou o gato!'; }
  state.effects = state.effects.filter(effect => (effect.ttl -= delta) > 0);
  if (state.lives === 0) { state.status = 'over'; emit(state, { type: 'over' }); state.message = 'O bosque precisa descansar. Tente novamente!'; }
}
export function submitAnswer(state, raw) {
  if (state.status !== 'playing') return false;
  const text = String(raw).trim();
  if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) {
    state.lastAnswer = 'invalid'; state.message = 'Digite um número inteiro antes de lançar.'; return false;
  }
  const enemy = [...state.enemies].sort((a, b) => a.x - b.x).find(item => item.desafio.resposta === Number(text));
  if (!enemy) { state.lastAnswer = 'miss'; state.combo = 0; emit(state, { type: 'miss' }); state.message = 'Ainda não! Confira a conta e tente outra vez.'; return false; }
  state.enemies = state.enemies.filter(item => item !== enemy);
  const points = 10 * state.level;
  state.lastAnswer = 'hit'; state.combo++; state.bestCombo = Math.max(state.bestCombo, state.combo);
  const milestone = [3, 5, 10].includes(state.combo);
  state.effects.push({ ...enemy, ttl: 0.85, duration: 0.85, points, milestone });
  state.effects = state.effects.slice(-12);
  emit(state, { type: 'hit', points, milestone, combo: state.combo });
  state.score += 10 * state.level;
  state.defeated++;
  state.level = 1 + Math.floor(state.defeated / 5);
  if (state.defeated % 5 === 0) emit(state, { type: 'wave', level: state.level });
  state.message = state.defeated % 5 === 0 ? `Onda ${state.level}! +${points} pontos. O desafio aumentou.` : `Feitiço certeiro! +${points} pontos${milestone ? ` · Sequência de ${state.combo}!` : ''}`;
  return true;
}

function emit(state, event) { state.events.push(event); if (state.events.length > 32) state.events.shift(); }
export function takeEvents(state) { return state.events.splice(0); }
export function setPaused(state, paused) {
  if (state.status === 'over') return;
  state.status = paused ? 'paused' : 'playing';
}
