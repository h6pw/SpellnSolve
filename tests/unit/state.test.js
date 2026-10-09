import { describe, it, expect } from 'vitest';
import { createGame, updateGame, submitAnswer } from '../../src/core/state.js';
import { readRecord, saveRecord } from '../../src/game/storage.js';
function target(x = 500, answer = 4) { return { x, y: 350, velocidade: 30, desafio: { a: 2, operacao: '+', b: 2, resposta: answer } }; }
describe('partida', () => {
  it('começa com três vidas e zero pontos', () => { const s = createGame(); expect(s.lives).toBe(3); expect(s.score).toBe(0); });
  it('rejeita dificuldade desconhecida', () => expect(() => createGame('x')).toThrow());
  it('cria e move um inimigo', () => { const s=createGame(); updateGame(s,0); const x=s.enemies[0].x; updateGame(s,1); expect(s.enemies[0].x).toBeLessThan(x); });
  it('acerta, pontua e cria feitiço', () => { const s=createGame();s.enemies=[target()];expect(submitAnswer(s,'4')).toBe(true);expect(s.score).toBe(10);expect(s.effects).toHaveLength(1);expect(s.enemies).toHaveLength(0); });
  it('erro não elimina nem tira vida', () => { const s=createGame();s.enemies=[target()];expect(submitAnswer(s,'8')).toBe(false);expect(s.lives).toBe(3);expect(s.enemies).toHaveLength(1); });
  it.each(['', ' ', '0x10', '2.5', 'Infinity', '4abc'])('rejeita entrada %j', raw => { const s=createGame();s.enemies=[target(500,0)];expect(submitAnswer(s,raw)).toBe(false);expect(s.score).toBe(0); });
  it('aceita zero decimal válido', () => { const s=createGame();s.enemies=[target(500,0)];expect(submitAnswer(s,'0')).toBe(true); });
  it('prioriza inimigo mais próximo com resposta repetida', () => { const s=createGame();s.enemies=[target(600),target(250)];submitAnswer(s,'4');expect(s.enemies[0].x).toBe(600); });
  it('cinco acertos avançam a onda', () => { const s=createGame();for(let i=0;i<5;i++){s.enemies=[target()];submitAnswer(s,'4');}expect(s.level).toBe(2);expect(s.score).toBe(50); });
  it('onda aumenta velocidade e frequência', () => {
    const baseline=createGame();updateGame(baseline,0);
    const s=createGame();s.defeated=10;updateGame(s,0);
    expect(s.enemies[0].velocidade).toBeGreaterThan(baseline.enemies[0].velocidade);expect(s.spawn).toBeLessThan(baseline.spawn);
  });
  it('três colisões encerram sem vidas negativas', () => { const s=createGame();s.enemies=[target(100),target(100),target(100),target(100)];s.spawn=100;updateGame(s,0);expect(s.status).toBe('over');expect(s.lives).toBe(0); });
  it('partida terminada ignora entrada e tempo', () => { const s=createGame();s.status='over';expect(submitAnswer(s,'4')).toBe(false);updateGame(s,3);expect(s.elapsed).toBe(0); });
  it('rejeita delta inválido', () => expect(() => updateGame(createGame(),-1)).toThrow());
  it('expira os efeitos', () => { const s=createGame();s.effects=[{ttl:0.1}];updateGame(s,0.2);expect(s.effects).toHaveLength(0); });
  it('reinício cria estado independente', () => { const a=createGame();a.lives=0;expect(createGame().lives).toBe(3); });
  it('recorde nunca diminui', () => { const store={getItem:()=> '80',setItem:()=>{}};expect(saveRecord(store,10)).toBe(80); });
  it('armazenamento bloqueado não quebra o jogo', () => { expect(readRecord(null)).toBe(0);expect(saveRecord(null,20)).toBe(20); });
  it('recorde corrompido é descartado', () => expect(readRecord({getItem:()=>'-2'})).toBe(0));
});
