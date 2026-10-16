import './style.css';
import { desenharJogo } from './game/render.js';
import { createGame, updateGame, submitAnswer, takeEvents, setPaused } from './core/state.js';
import { WORLD, expression } from './core/world.js';
import { layoutLabels } from './game/labels.js';
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
let manualPause = false, pageHidden = document.hidden, returnFocus = null;
let visualTime = 0;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const view = { pose: 'idle', poseTTL: 0, bannerTTL: 0 };
const labelNodes = new Map();
const prop = (node,key,value) => { if(node[key]!==value)node[key]=value; };
const attr = (node, key, value) => { if (node.getAttribute(key) !== String(value)) node.setAttribute(key, String(value)); };
function labels() {
  const live = state?.status === 'over' ? [] : state?.enemies ?? [];
  for (const [id, nodes] of labelNodes) if (!live.some(e=>e.id===id)) { nodes.label.remove();nodes.line.remove();labelNodes.delete(id); }
  const rect = canvas.getBoundingClientRect();
  for (const {enemy:e,x,y,width} of layoutLabels(live,rect.width,rect.height)) {
    if(!labelNodes.has(e.id)) {
      const label=document.createElement('div');label.className='enemy-label';label.dataset.enemyId=e.id;
      const badge=document.createElement('small');badge.textContent=`#${e.id}`;
      const text=document.createElement('span');text.textContent=expression(e);label.append(badge,text);
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      $('enemy-labels').append(label);$('label-lines').append(line);labelNodes.set(e.id,{label,line});
    }
    const {label,line}=labelNodes.get(e.id);
    const style=`left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${width.toFixed(1)}px`;
    attr(label,'style',style);attr(label,'class',`enemy-label${e.x<300?' urgent':''}`);
    for(const [key,value] of Object.entries({x1:x,y1:y+29,x2:e.x/WORLD.width*rect.width,y2:(e.y-32)/WORLD.height*rect.height})) attr(line,key,value.toFixed(1));
  }
}
window.addEventListener('resize',labels);
function events() {
  if(!state) return;
  for(const event of takeEvents(state)) {
    if(event.type==='hit'){view.pose='cast';view.poseTTL=.4;audio.effect(event.milestone?'wave':'correct');}
    if(event.type==='damage'){view.pose='damage';view.poseTTL=.6;audio.effect('life');}
    if(event.type==='miss') audio.effect('wrong');
    if(event.type==='wave' || event.milestone){
      view.bannerTTL=event.type==='wave'?1.7:1.1;
      setText('event-banner',event.type==='wave'?`✦ Onda ${event.level} · A clareira desperta`:`✧ ${event.combo} acertos em sequência`);
      if(event.type==='wave')audio.effect('wave');
    }
    if(event.type==='over'){view.pose='defeat';view.poseTTL=0;audio.stop();audio.effect('over');view.focusEnd=true;}
  }
}
function syncPause() {
  if(!state || state.status==='over')return;
  setPaused(state,manualPause || pageHidden);last=null;
  audio.setHidden(state.status==='paused');refresh();
}
function togglePause() {
  if(!state || state.status==='over')return;
  manualPause=!manualPause;syncPause();
  (manualPause?$('resume'):$('answer')).focus({preventScroll:true});
}
$('pause').addEventListener('click',togglePause);$('resume').addEventListener('click',togglePause);
document.addEventListener('keydown',event=>{
  if(event.repeat)return;
  if(event.key==='Escape' || (event.code==='KeyP' && event.target.tagName!=='INPUT' && event.target.tagName!=='SELECT')) {
    if(state && state.status!=='over'){event.preventDefault();togglePause();}
  }
});
function refresh() {
  for(const [id,value] of Object.entries({score:state?.score??0,lives:state?.lives??3,level:state?.level??1,combo:state?.combo??0,'best-combo':state?.bestCombo??0,record})) setText(id,value);
  setText('feedback',state?.message??'Escolha uma dificuldade e entre no bosque.');
  const ordered=[...(state?.enemies??[])].sort((a,b)=>a.x-b.x);
  setText('challenges',ordered.map(expression).join(' • ') || 'O bosque está tranquilo…');
  setText('urgency',ordered.map(e=>`#${e.id}: ${e.x<300?'chegando ao gato':e.x<550?'aproximando':'na clareira'}`).join(' · '));
  prop($('menu'),'hidden',state!==null);
  prop($('gameover'),'hidden',state?.status!=='over');
  prop($('paused'),'hidden',state?.status!=='paused');
  prop($('pause'),'disabled',!state || state.status==='over');
  setText('pause',state?.status==='paused'?'▶ Retomar':'Ⅱ Pausar');
  attr($('pause'),'aria-label',state?.status==='paused'?'Retomar partida':'Pausar partida');
  prop($('answer'),'disabled',state?.status!=='playing');prop($('cast'),'disabled',state?.status!=='playing');
  attr(document.querySelector('.arena'),'data-mode',state?.status??'menu');
  attr(document.querySelector('.controls'),'data-result',state?.lastAnswer??'');
  attr($('answer'),'aria-invalid',state?.lastAnswer==='invalid' || state?.lastAnswer==='miss');
  attr($('event-banner'),'class',view.bannerTTL>0?'active':'');
  if(view.focusEnd){$('restart').focus({preventScroll:true});view.focusEnd=false;}
  if(state?.status==='over')for(const [id,value] of Object.entries({'final-score':state.score,'final-level':state.level,'final-combo':state.bestCombo}))setText(id,value);
}
function start() {
  audio.stop();
  state = createGame($('difficulty').value);manualPause=false;visualTime=0;
  Object.assign(view,{pose:'idle',poseTTL:0,bannerTTL:0});audio.setHidden(false);
  if (!audio.start()) {
    $('music-toggle').disabled = true; $('effects-toggle').disabled = true; $('audio-volume').disabled = true;
    $('audio-controls').title = 'Áudio indisponível neste navegador; a partida continua normalmente.';
  }
  updateGame(state, 0); last = null; refresh(); $('answer').focus();
}
$('play').addEventListener('click', start);
$('restart').addEventListener('click', start);
$('back').addEventListener('click', () => { audio.stop(); state = null;view.pose='idle';view.bannerTTL=0; refresh(); $('play').focus(); });
function difficultyChanged(){setText('difficulty-help',settings[$('difficulty').value].description);for(const button of document.querySelectorAll('[data-difficulty]'))attr(button,'aria-pressed',button.dataset.difficulty===$('difficulty').value);}
$('difficulty').addEventListener('change',difficultyChanged);
for(const button of document.querySelectorAll('[data-difficulty]'))button.addEventListener('click',()=>{$('difficulty').value=button.dataset.difficulty;difficultyChanged();});
bindInput($('answer-form'),$('answer'),raw=>{
  if(!state || state.status!=='playing')return false;
  const correct=submitAnswer(state,raw);events();
  record=saveRecord(storage,state.score);refresh();labels();return correct;
});
function visibility(hidden) {
  if(hidden && !pageHidden)returnFocus=document.activeElement;
  pageHidden=hidden;last=null;
  if(state && state.status!=='over')syncPause();else audio.setHidden(hidden);
  if(!hidden && returnFocus && !returnFocus.disabled){returnFocus.focus({preventScroll:true});returnFocus=null;}
}
document.addEventListener('visibilitychange',()=>visibility(document.hidden));
window.addEventListener('pagehide',()=>visibility(true));
window.addEventListener('pageshow',()=>visibility(document.hidden));
function frame(time) {
  const delta=last===null?0:Math.min((time-last)/1000,.05);last=time;
  const playing=state?.status==='playing' && !pageHidden;
  if(playing){updateGame(state,delta);events();refresh();}
  if((playing || !state) && !pageHidden) {
    visualTime+=delta;
    if(view.poseTTL>0){view.poseTTL=Math.max(0,view.poseTTL-delta);if(!view.poseTTL)view.pose='idle';}
    view.bannerTTL=Math.max(0,view.bannerTTL-delta);
  }
  attr(document.querySelector('.controls'),'data-casting',view.pose==='cast' && view.poseTTL>0);
  attr($('event-banner'),'class',view.bannerTTL>0?'active':'');
  labels();
  desenharJogo(ctx,canvas.width,canvas.height,state?.enemies??[],state?.effects??[],visualTime,
    {...view,reduced:motion.matches,level:state?.level??1,elapsed:state?.elapsed??visualTime, showcase:!state || state.status==='over'});
  requestAnimationFrame(frame);
}
refreshAudio(); refresh(); requestAnimationFrame(frame);
fetch(`${import.meta.env.BASE_URL}version.json`).then(r => r.ok ? r.json() : null)
  .then(v => { if (v) $('version').textContent = `v${v.version} · ${v.commit.slice(0, 7)}${v.dirty ? ' · alterações locais' : ''}`; }).catch(() => {});
