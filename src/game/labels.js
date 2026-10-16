import { WORLD } from '../core/world.js';
// Pixel layout shared by the visual labels and regression tests.
export function layoutLabels(enemies, width, height) {
  const labelWidth = Math.min(112, Math.max(76, width / 7));
  const placed = [];
  for (const enemy of [...enemies].sort((a,b) => a.x - b.x)) {
    const x = Math.max(labelWidth / 2 + 4, Math.min(width - labelWidth / 2 - 4, enemy.x / WORLD.width * width));
    let y = Math.max(6, enemy.y / WORLD.height * height - 67);
    while (placed.some(p => Math.abs(p.x-x) < labelWidth+6 && Math.abs(p.y-y) < 33)) y -= 34;
    // Five labels fit in three bands even at 320px; wrap to a free cell if needed.
    if (y < 4) {
      const candidates=[];
      for (let row=0; row<5; row++) for (let col=0; col<Math.floor(width/(labelWidth+6)); col++) {
        const cx=labelWidth/2+5+col*(labelWidth+6), cy=5+row*34;
        if (cy+29<=height && !placed.some(p=>Math.abs(p.x-cx)<labelWidth+5 && Math.abs(p.y-cy)<33)) candidates.push({enemy,x:cx,y:cy,width:labelWidth});
      }
      const desiredY=enemy.y/WORLD.height*height-67;
      candidates.sort((a,b)=>(Math.abs(a.x-x)+Math.abs(a.y-desiredY)*.6)-(Math.abs(b.x-x)+Math.abs(b.y-desiredY)*.6));
      if(candidates.length)placed.push(candidates[0]);
    } else placed.push({enemy,x,y,width:labelWidth});
  }
  return placed;
}
