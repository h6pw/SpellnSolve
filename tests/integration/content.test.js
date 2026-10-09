import { it, expect } from 'vitest';
import content from '../../src/content/difficulties.json';
import { validateSettings } from '../../src/core/settings.js';
import { createGame, updateGame, submitAnswer } from '../../src/core/state.js';
import { execFileSync } from 'node:child_process';
it('conteúdo rejeita multiplicação com dois dígitos no segundo fator', () => {
  const invalid={...content,medio:{...content.medio,multiplication:{...content.medio.multiplication,maxB:21}}};
  expect(()=>validateSettings(invalid)).toThrow('Multiplicação inválida');
});
it('CLI valida o conteúdo em Node ES sem o transformador do Vite', () => {
  expect(execFileSync(process.execPath, ['scripts/validate-content.mjs'], { encoding: 'utf8' })).toContain('Conteúdo validado');
});
it('carrega JSON e integra cada dificuldade com o gerador', () => {
  validateSettings(content);
  for(const key of Object.keys(content)){ const s=createGame(key);updateGame(s,0);expect(Number.isInteger(s.enemies[0].desafio.resposta)).toBe(true); }
});
it('JSON com esquema inválido bloqueia conteúdo', () => expect(() => validateSettings({ ...content, facil: {...content.facil,speed:'rápido'} })).toThrow());
it('conteúdo incompleto não é aceito', () => expect(() => validateSettings({ facil: content.facil })).toThrow());
it('integra geração, resposta, efeito e progressão', () => {
  const s=createGame('dificil');for(let i=0;i<5;i++){s.spawn=0;updateGame(s,0);expect(submitAnswer(s,String(s.enemies[0].desafio.resposta))).toBe(true);}expect(s.level).toBe(2);expect(s.score).toBe(50);
});
