import { WORLD } from '../core/world.js';
function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function polygon(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath(); points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); ctx.fill();
}
function cat(ctx, time, pose = 'idle', intensity = 0) {
  const bob = pose === 'defeat' ? 12 : Math.sin(time * 2) * 2;
  ctx.save(); ctx.translate(98, 379 + bob);
  if (pose === 'damage') ctx.rotate(-0.07 * intensity);
  if (pose === 'cast') ctx.rotate(0.04 * intensity);
  if (pose === 'defeat') ctx.rotate(-0.13);
  ellipse(ctx, 0, 70, 50, 12, '#071f29');
  ctx.strokeStyle = '#e6ba83'; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-25,45);ctx.bezierCurveTo(-65,40,-57,5,-43,14);ctx.stroke();
  polygon(ctx, [[-27,14],[24,14],[38,62],[-37,62]], '#7063bb');
  polygon(ctx,[[-27,14],[-10,20],[-22,60],[-37,62]],'#4d4387');
  ctx.strokeStyle='#e0bb78';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-27,17);ctx.lineTo(-36,59);ctx.lineTo(35,59);ctx.stroke();
  ellipse(ctx,0,24,5,6,'#e6c487');
  ellipse(ctx, -16, 61, 14, 7, '#e6ba83'); ellipse(ctx, 22, 61, 14, 7, '#e6ba83');
  ellipse(ctx, 0, 0, 33, 28, '#efc18e');
  polygon(ctx,[[-30,-9],[-30,-41],[-9,-23]],'#efc18e');polygon(ctx,[[11,-23],[30,-41],[31,-7]],'#efc18e');
  polygon(ctx,[[-26,-15],[-26,-31],[-15,-22]],'#c9818c');polygon(ctx,[[17,-22],[26,-31],[27,-15]],'#c9818c');
  if(pose==='defeat' || pose==='damage'){ctx.strokeStyle='#65415c';ctx.lineWidth=3;for(const x of [-12,12]){ctx.beginPath();ctx.moveTo(x-4,1);ctx.lineTo(x+4,pose==='defeat'?4:-2);ctx.stroke();}} else {ellipse(ctx,-12,-1,5,7,'#193c43');ellipse(ctx,12,-1,5,7,'#193c43');ellipse(ctx,-11,-3,2,2,'#fff');ellipse(ctx,13,-3,2,2,'#fff');}
  polygon(ctx,[[-4,9],[4,9],[0,13]],'#a66b72');
  ctx.strokeStyle='#7b5e56';ctx.lineWidth=1.5;for(const side of [-1,1]){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(side*13,10+i*3);ctx.lineTo(side*38,6+i*7);ctx.stroke();}}
  polygon(ctx,[[-31,-24],[-6,-77],[21,-65],[12,-59],[32,-24]],'#7767c3');ellipse(ctx,0,-23,43,9,'#9180d3');
  polygon(ctx,[[-7,-55],[-3,-47],[6,-46],[0,-40],[2,-31],[-6,-35],[-14,-31],[-12,-40],[-18,-46],[-10,-47]],'#f3d17b');
  ctx.strokeStyle='#bf8d61';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(40,53);ctx.lineTo(51,-28);ctx.stroke();
  if(pose==='cast'){const glow=ctx.createRadialGradient(52,-31,2,52,-31,40);glow.addColorStop(0,'#fff5cbaa');glow.addColorStop(1,'#a6efde00');ctx.fillStyle=glow;ctx.fillRect(10,-72,84,84);}
  ellipse(ctx,52,-31,11,15,pose==='damage'?'#e5afc3':'#a6efde');ellipse(ctx,49,-35,4,5,'#fff7cb');ellipse(ctx,31,28,12,8,'#efc18e');ctx.restore();
}

function tree(ctx,x,y,scale,color,bend=0) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-17,0);ctx.bezierCurveTo(-9,-100,4,-210,bend,-330);
  ctx.lineTo(bend+12,-330);ctx.bezierCurveTo(25,-180,8,-90,21,0);ctx.fill();
  ctx.strokeStyle=color;ctx.lineCap='round';
  for(let i=0;i<5;i++){const yy=-90-i*43;ctx.lineWidth=10-i;ctx.beginPath();ctx.moveTo(2,yy);ctx.quadraticCurveTo(-30,yy-18,-60+i*4,yy-65);ctx.moveTo(9,yy-15);ctx.quadraticCurveTo(34,yy-40,65-i*5,yy-82);ctx.stroke();}
  polygon(ctx,[[-56,-202],[-30,-260],[-37,-258],[bend+6,-363],[34,-268],[29,-269],[63,-211],[39,-220],[79,-148],[18,-172],[-71,-136],[-40,-215]],color);
  ctx.restore();
}
function creature(ctx,e,time,reduced=false,dying=0) {
  const phase=e.phase || 0, variant=e.variant || 0;
  const y=e.y+(reduced?0:Math.sin(time*3+phase)*3);
  ctx.save();ctx.translate(e.x,y);
  if(dying){ctx.globalAlpha=1-dying;ctx.scale(1+dying*.3,1-dying*.35);ctx.rotate(dying*.18);}
  ellipse(ctx,0,29,30,7,'#071c26aa');
  if(variant===0) {
    polygon(ctx,[[-22,-12],[-32,-43],[-5,-25],[15,-25],[32,-39],[24,-9]],'#819aa5');
    ellipse(ctx,0,0,29,28,'#ada1cd');ellipse(ctx,-8,12,18,12,'#c4b9de');
  } else if(variant===1) {
    ellipse(ctx,0,5,28,25,'#97b7a5');
    polygon(ctx,[[-30,-8],[-21,-25],[-8,-29],[0,-39],[12,-29],[27,-24],[34,-5]],'#557e76');
    polygon(ctx,[[-7,-29],[-18,-50],[0,-40],[11,-52],[13,-28]],'#89a879');
    ellipse(ctx,-18,13,6,4,'#d6c48e');ellipse(ctx,17,14,5,3,'#d6c48e');
  } else {
    polygon(ctx,[[-29,19],[-33,-4],[-20,-24],[-1,-29],[23,-20],[31,5],[24,25],[12,19],[0,27],[-14,20]],'#c39bb5');
    ellipse(ctx,0,2,24,20,'#d0afc7');
    ctx.strokeStyle='#c39bb5';ctx.lineWidth=4;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*16,-20);ctx.quadraticCurveTo(side*35,-47,side*13,-39);ctx.stroke();}
  }
  if(dying){ctx.strokeStyle='#fff0d2';ctx.lineWidth=3;for(const x of [-10,10]){ctx.beginPath();ctx.arc(x,-3,5,Math.PI,Math.PI*2);ctx.stroke();}}
  else {for(const x of [-10,10]){ellipse(ctx,x,-4,7,9,'#fff0d2');ellipse(ctx,x-1,-3,3,5,'#354151');ellipse(ctx,x-2,-6,1.4,2,'#fff');}}
  ellipse(ctx,0,11,3,2,'#66536c');
  ctx.font='700 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#f7ecd3';ctx.fillText(String(e.id || ''),0,45);
  ctx.restore();
}
export function desenharJogo(ctx,width,height,enemies,effects=[],time=0,presentation={}) {
  const { reduced=false, level=1, pose='idle', poseTTL=0, elapsed=time, showcase=false }=presentation;
  const t=reduced?0:time;
  ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width/WORLD.width,height/WORLD.height);
  const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#101b30');sky.addColorStop(.65,level>=3?'#284b50':'#24444c');sky.addColorStop(1,'#48786a');ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
  const moon=ctx.createRadialGradient(735,110,20,735,110,210);moon.addColorStop(0,'#b4cdad22');moon.addColorStop(1,'#9cccc000');ctx.fillStyle=moon;ctx.fillRect(520,0,440,330);
  ellipse(ctx,750,102,34,34,'#e9deae');ellipse(ctx,737,91,32,31,'#15263a');
  for(let i=0;i<30;i++) ellipse(ctx,(i*137+43)%960,35+(i*67)%215, i%4===0?1.5:.8, i%4===0?1.5:.8,'#b7c9bb');
  for(let layer=0;layer<3;layer++) for(let i=0;i<10;i++) {if(i===6 || (i===5 && layer<2))continue;ctx.save();ctx.globalAlpha=.5+layer*.2;tree(ctx,i*125-40+layer*30,400+layer*25,.7+layer*.25,['#1c3443','#244751','#2b5456'][layer],i%2?22:-18);ctx.restore();}
  // Broken stone arch: a quiet landmark, outside the expression bands.
  ctx.strokeStyle='#68817855';ctx.lineWidth=18;ctx.beginPath();ctx.arc(510,345,79,Math.PI,Math.PI*1.82);ctx.stroke();
  ctx.strokeStyle='#9ca88a44';ctx.lineWidth=2;ctx.beginPath();ctx.arc(510,345,88,Math.PI,Math.PI*1.77);ctx.stroke();
  ellipse(ctx,410,550,690,170,'#244b4a');ellipse(ctx,900,540,600,100,'#2d5a50');
  ctx.fillStyle='#627d6977';ctx.beginPath();ctx.moveTo(0,461);ctx.bezierCurveTo(250,425,650,460,960,414);ctx.lineTo(960,475);ctx.bezierCurveTo(650,490,300,460,0,505);ctx.fill();
  for(let i=0;i<22;i++){const x=(i*151)%960,y=466+(i*37)%65;ellipse(ctx,x,y,13,4,'#193637');ctx.fillStyle=i%2?'#a6b0db':'#c69aae';ctx.beginPath();ctx.arc(x,y-7,7+i%3,Math.PI,0);ctx.fill();ctx.fillStyle='#c2b999';ctx.fillRect(x-1.5,y-7,3,9);}
  // Low fog stays under the creatures and never passes over the labels (DOM).
  for(let i=0;i<3;i++) ellipse(ctx,210+i*320+Math.sin(t*.15+i)*25,445+i*22,240,11,'#b1cfb00c');
  for(let i=0;i<(reduced?5:14);i++) ellipse(ctx,(i*83+Math.sin(t*.5+i)*10)%960,260+(i*31)%200,1.6,1.6,'#c8e1aa');
  if(level>=2) {ctx.font='18px Georgia';ctx.fillStyle='#c5d5b32c';for(let i=0;i<Math.min(level,6);i++)ctx.fillText(['+','−','×','÷'][i%4],255+i*96,175+i%2*25);}
  // Foreground trunks frame the clearing, not its creatures.
  tree(ctx,-36,550,1.8,'#091d29',18);tree(ctx,1004,550,1.8,'#091d29',-26);
  ctx.save();if(showcase){ctx.translate(-5,-230);ctx.scale(1.7,1.7);}
  cat(ctx,t,pose,Math.min(1,poseTTL*4));ctx.restore();
  for(const e of (Array.isArray(enemies)?enemies:enemies?[enemies]:[])) {
    ctx.save();ctx.globalAlpha=reduced?1:Math.min(1,Math.max(.2,(elapsed-(e.born||0))/.3));creature(ctx,e,t,reduced);ctx.restore();
  }
  for(const e of effects){
    const duration=e.duration||.85, progress=1-e.ttl/duration;
    if(e.desafio && progress>.12) creature(ctx,e,t,reduced,Math.min(1,(progress-.12)/.75));
    const impact=progress>.18;
    if(!reduced && progress<.4){
      ctx.strokeStyle='#d0f2d8';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(151,348);ctx.quadraticCurveTo(340,235,e.x,e.y);ctx.stroke();
      ellipse(ctx,151+(e.x-151)*Math.min(1,progress/.18),348+(e.y-348)*Math.min(1,progress/.18),6,6,'#ffe4aa');
    }
    if(impact){ctx.save();ctx.globalAlpha=Math.max(0,1-progress);ctx.strokeStyle=e.milestone?'#f2cc86':'#b5dfcf';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(e.x,e.y,14+progress*38,14+progress*38,0,0,Math.PI*2);ctx.stroke();
      if(!reduced)for(let i=0;i<(e.milestone?14:7);i++){const a=i*2.4,r=14+progress*(e.milestone?80:48);ellipse(ctx,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,2,2,'#f1d498');}
      ctx.restore();}
    ctx.save();ctx.globalAlpha=Math.min(1,e.ttl*4);ctx.fillStyle='#ffe2a2';ctx.font='700 23px Georgia';ctx.textAlign='center';ctx.fillText(`+${e.points||10}`,e.x,e.y-35-(reduced?0:progress*23));ctx.restore();
  }
  const vignette=ctx.createRadialGradient(480,300,220,480,270,620);vignette.addColorStop(0,'#050e1900');vignette.addColorStop(1,'#050e1977');ctx.fillStyle=vignette;ctx.fillRect(0,0,960,540);
  ctx.restore();
}
