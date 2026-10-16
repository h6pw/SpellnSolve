import { it, expect } from 'vitest';
import { createGame, updateGame, submitAnswer, takeEvents, setPaused } from '../../src/core/state.js';
import { criarInimigo } from '../../src/game/enemy.js';
import { layoutLabels } from '../../src/game/labels.js';
import { expression } from '../../src/core/world.js';
const enemy=(id=1,x=500)=>({...criarInimigo('facil',960,540,id),x,y:350,desafio:{a:2,b:2,operacao:'+',resposta:4}});
const hit=s=>{s.enemies=[enemy(s.defeated+1)];return submitAnswer(s,'4');};
it('identidade, variante e fase sobrevivem à remoção de outro alvo',()=>{
 const s=createGame();s.enemies=[enemy(1,220),enemy(2,550),enemy(3,700)];const survivors=s.enemies.slice(1).map(e=>({...e}));
 submitAnswer(s,'4');expect(s.enemies).toEqual(survivors);expect(s.effects[0].id).toBe(1);expect(s.enemies.map(e=>e.variant)).toEqual([1,2]);
});
it('efeito de derrota deixa de ser alvo e preserva pontos reais',()=>{const s=createGame();hit(s);expect(submitAnswer(s,'4')).toBe(false);expect(s.score).toBe(10);expect(s.effects[0].points).toBe(10);});
it('marcos 3,5,10 não multiplicam os pontos e emitem ondas',()=>{
 const s=createGame();for(let i=0;i<10;i++)hit(s);
 expect(s.combo).toBe(10);expect(s.bestCombo).toBe(10);expect(s.score).toBe(150);expect(s.level).toBe(3);
 const events=takeEvents(s);expect(events.filter(e=>e.milestone).map(e=>e.combo)).toEqual([3,5,10]);expect(events.filter(e=>e.type==='wave').map(e=>e.level)).toEqual([2,3]);expect(takeEvents(s)).toEqual([]);
});
it('formato inválido preserva combo, inteiro incorreto quebra sem tirar vida',()=>{
 const s=createGame();hit(s);s.enemies=[enemy()];submitAnswer(s,'2.5');expect(s.combo).toBe(1);expect(s.lastAnswer).toBe('invalid');
 submitAnswer(s,'99');expect(s.lastAnswer).toBe('miss');expect(s.combo).toBe(0);expect(s.bestCombo).toBe(1);expect(s.lives).toBe(3);
});
it('dano quebra combo e reinício limpa a sessão sem compartilhar arrays',()=>{
 const s=createGame();hit(s);s.spawn=100;s.enemies=[enemy(4,100)];updateGame(s,0);expect(s.combo).toBe(0);expect(s.bestCombo).toBe(1);expect(takeEvents(s).some(e=>e.type==='damage')).toBe(true);
 const fresh=createGame();expect(fresh.combo).toBe(0);expect(fresh.bestCombo).toBe(0);expect(fresh.effects).toEqual([]);expect(fresh.events).toEqual([]);expect(fresh.nextEnemyId).toBe(1);
});
it('pausa congela timers, criaturas e efeitos; retoma sem mutar combo',()=>{
 const s=createGame();hit(s);updateGame(s,0);setPaused(s,true);const frozen=JSON.stringify(s);updateGame(s,60);expect(submitAnswer(s,'4')).toBe(false);expect(JSON.stringify(s)).toBe(frozen);
 setPaused(s,false);updateGame(s,.1);expect(s.elapsed).toBe(.1);expect(s.combo).toBe(1);s.status='over';setPaused(s,false);expect(s.status).toBe('over');
});
it('formatadores cobrem as quatro operações',()=>{for(const [op,symbol] of [['+','+'],['-','-'],['*','×'],['/','÷']])expect(expression({desafio:{a:8,b:2,operacao:op}})).toBe(`8 ${symbol} 2`);});
it.each([300,320,390,768,960])('cinco etiquetas agrupadas ficam legíveis sem sobreposição em %ipx',width=>{
 const boxes=layoutLabels([1,2,3,4,5].map(id=>enemy(id,850+id*7)),width,width*9/16);
 expect(boxes).toHaveLength(5);
 for(const b of boxes){expect(b.x-b.width/2).toBeGreaterThanOrEqual(0);expect(b.x+b.width/2).toBeLessThanOrEqual(width);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.y+29).toBeLessThanOrEqual(width*9/16);}
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)expect(Math.abs(boxes[i].x-boxes[j].x)>=boxes[i].width || Math.abs(boxes[i].y-boxes[j].y)>=33).toBe(true);
});
it('recursos transitórios são limitados mesmo sem avançar o relógio',()=>{const s=createGame();for(let i=0;i<100;i++)hit(s);expect(s.effects.length).toBeLessThanOrEqual(12);expect(s.events.length).toBeLessThanOrEqual(32);});
