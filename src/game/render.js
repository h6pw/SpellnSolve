function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function polygon(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath(); points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); ctx.fill();
}
function cat(ctx, time) {
  const bob = Math.sin(time * 2) * 2;
  ctx.save(); ctx.translate(98, 379 + bob);
  ellipse(ctx, 0, 70, 50, 12, '#071f29');
  ctx.strokeStyle = '#e6ba83'; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-25,45);ctx.bezierCurveTo(-65,40,-57,5,-43,14);ctx.stroke();
  polygon(ctx, [[-27,14],[24,14],[38,62],[-37,62]], '#7063bb');
  ellipse(ctx, -16, 61, 14, 7, '#e6ba83'); ellipse(ctx, 22, 61, 14, 7, '#e6ba83');
  ellipse(ctx, 0, 0, 33, 28, '#efc18e');
  polygon(ctx,[[-30,-9],[-30,-41],[-9,-23]],'#efc18e');polygon(ctx,[[11,-23],[30,-41],[31,-7]],'#efc18e');
  polygon(ctx,[[-26,-15],[-26,-31],[-15,-22]],'#c9818c');polygon(ctx,[[17,-22],[26,-31],[27,-15]],'#c9818c');
  ellipse(ctx,-12,-1,5,7,'#193c43');ellipse(ctx,12,-1,5,7,'#193c43');ellipse(ctx,-11,-3,2,2,'#fff');ellipse(ctx,13,-3,2,2,'#fff');
  polygon(ctx,[[-4,9],[4,9],[0,13]],'#a66b72');
  ctx.strokeStyle='#7b5e56';ctx.lineWidth=1.5;for(const side of [-1,1]){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(side*13,10+i*3);ctx.lineTo(side*38,6+i*7);ctx.stroke();}}
  polygon(ctx,[[-31,-24],[-6,-77],[21,-65],[12,-59],[32,-24]],'#7767c3');ellipse(ctx,0,-23,43,9,'#9180d3');
  polygon(ctx,[[-7,-55],[-3,-47],[6,-46],[0,-40],[2,-31],[-6,-35],[-14,-31],[-12,-40],[-18,-46],[-10,-47]],'#f3d17b');
  ctx.strokeStyle='#bf8d61';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(40,53);ctx.lineTo(51,-28);ctx.stroke();
  ellipse(ctx,52,-31,11,15,'#a6efde');ellipse(ctx,49,-35,4,5,'#fff7cb');ellipse(ctx,31,28,12,8,'#efc18e');ctx.restore();
}
export function desenharJogo(ctx, width, height, enemies, effects = [], time = 0) {
  ctx.clearRect(0,0,width,height);ctx.save();ctx.scale(width/960,height/540);
  const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,'#15283e');sky.addColorStop(1,'#438178');ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
  ellipse(ctx,750,115,42,42,'#e5deac');ellipse(ctx,735,101,40,38,'#1a3247');
  for(let i=0;i<35;i++) ellipse(ctx,(i*137+43)%960,65+(i*67)%240,1.5,1.5,'#cde4d5');
  for(let i=0;i<11;i++){const x=i*100;polygon(ctx,[[x-90,410],[x+20,100+i%3*30],[x+115,410]],'#244b54');polygon(ctx,[[x-65,410],[x+20,175+i%3*30],[x+90,410]],'#2d6160');}
  ellipse(ctx,410,550,690,170,'#2e625e');ellipse(ctx,900,540,600,100,'#356e60');
  ctx.fillStyle='#719180';ctx.beginPath();ctx.moveTo(0,461);ctx.bezierCurveTo(250,425,650,460,960,414);ctx.lineTo(960,475);ctx.bezierCurveTo(650,490,300,460,0,505);ctx.fill();
  for(let i=0;i<18;i++){const x=(i*151)%960,y=466+(i*37)%65;ellipse(ctx,x,y,13,4,'#294d4c');ctx.fillStyle=i%2?'#a3b4ee':'#e4afc3';ctx.beginPath();ctx.arc(x,y-7,10,Math.PI,0);ctx.fill();ctx.fillStyle='#e5d5b3';ctx.fillRect(x-2,y-7,4,9);}
  for(let i=0;i<14;i++) ellipse(ctx,(i*83+Math.sin(time+i)*10)%960,280+(i*31)%200,2,2,'#cfe9a7');
  cat(ctx,time);
  const list = Array.isArray(enemies) ? enemies : enemies ? [enemies] : [];
  for(const [i,e] of list.entries()){
    const y=e.y+Math.sin(time*4+i)*4;
    ellipse(ctx,e.x,y+29,30,7,'#193d42');
    polygon(ctx,[[e.x-22,y-12],[e.x-34,y-41],[e.x-5,y-25],[e.x+15,y-25],[e.x+34,y-38],[e.x+24,y-9]],'#94a7bb');
    ellipse(ctx,e.x,y,29,28,i%2?'#d3a2ba':'#ac9cc9');
    ellipse(ctx,e.x-10,y-4,7,9,'#fff0d2');ellipse(ctx,e.x+10,y-4,7,9,'#fff0d2');ellipse(ctx,e.x-9,y-3,3,5,'#354151');ellipse(ctx,e.x+9,y-3,3,5,'#354151');
    ctx.fillStyle='#182f40';ctx.beginPath();ctx.roundRect(e.x-58,y-75,116,34,9);ctx.fill();ctx.strokeStyle='#c8d8ba';ctx.lineWidth=1;ctx.stroke();
    const {a,operacao,b}=e.desafio;ctx.fillStyle='#fff1cc';ctx.font='bold 20px system-ui';ctx.textAlign='center';ctx.fillText(`${a} ${operacao==='*'?'×':operacao==='/'?'÷':operacao} ${b}`,e.x,y-52);
  }
  for(const e of effects){ctx.globalAlpha=Math.max(0,e.ttl/0.65);ctx.strokeStyle='#b6ffe4';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(151,348);ctx.quadraticCurveTo(400,210,e.x,e.y);ctx.stroke();for(let i=0;i<12;i++){const angle=i*Math.PI/6;const r=(0.65-e.ttl)*110+12;ellipse(ctx,e.x+Math.cos(angle)*r,e.y+Math.sin(angle)*r,4,4,'#ffe49e');}ctx.globalAlpha=1;}
  ctx.restore();
}
