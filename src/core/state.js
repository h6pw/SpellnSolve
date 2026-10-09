import { criarInimigo, atualizarInimigo } from '../game/enemy.js';
import { settings } from './settings.js';
export function createGame(difficulty = 'facil') {
  if (!settings[difficulty]) throw new Error('Dificuldade inválida.');
  return { difficulty, status: 'playing', score: 0, lives: 3, level: 1,
    defeated: 0, elapsed: 0, spawn: 0, enemies: [], effects: [], message: 'Prepare seu primeiro feitiço!' };
}
export function updateGame(state, delta) {
  if (state.status !== 'playing') return;
  if (!Number.isFinite(delta) || delta < 0) throw new Error('Tempo inválido.');
  state.elapsed += delta;
  state.level = 1 + Math.floor(state.defeated / 5);
  const config = settings[state.difficulty];
  state.spawn -= delta;
  if (state.spawn <= 0 && state.enemies.length < 5) {
    const enemy = criarInimigo(state.difficulty, 960, 540);
    enemy.y = 350 + (Math.floor(state.elapsed) % 3) * 37;
    enemy.velocidade = config.speed * (1 + (state.level - 1) * 0.12);
    state.enemies.push(enemy);
    state.spawn = Math.max(1.5, config.spawnInterval - (state.level - 1) * 0.25);
  }
  for (const enemy of state.enemies) atualizarInimigo(enemy, delta);
  const arrivals = state.enemies.filter(enemy => enemy.x <= 145);
  state.enemies = state.enemies.filter(enemy => enemy.x > 145);
  if (arrivals.length) { state.lives = Math.max(0, state.lives - arrivals.length); state.message = 'Um inimigo alcançou o gato!'; }
  state.effects = state.effects.filter(effect => (effect.ttl -= delta) > 0);
  if (state.lives === 0) { state.status = 'over'; state.message = 'O bosque precisa descansar. Tente novamente!'; }
}
export function submitAnswer(state, raw) {
  if (state.status !== 'playing') return false;
  const text = String(raw).trim();
  if (!/^-?\d+$/.test(text) || !Number.isSafeInteger(Number(text))) {
    state.message = 'Digite um número inteiro antes de lançar.'; return false;
  }
  const enemy = [...state.enemies].sort((a, b) => a.x - b.x).find(item => item.desafio.resposta === Number(text));
  if (!enemy) { state.message = 'Ainda não! Confira a conta e tente outra vez.'; return false; }
  state.enemies = state.enemies.filter(item => item !== enemy);
  state.effects.push({ x: enemy.x, y: enemy.y, ttl: 0.65 });
  state.score += 10 * state.level;
  state.defeated++;
  state.level = 1 + Math.floor(state.defeated / 5);
  state.message = state.defeated % 5 === 0 ? `Onda ${state.level}! O desafio aumentou.` : 'Feitiço certeiro! + pontos';
  return true;
}
