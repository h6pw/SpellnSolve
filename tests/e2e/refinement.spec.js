import { test, expect } from '@playwright/test';
async function frozen(page){const start=new Date('2026-10-16T12:00:00Z');await page.clock.install({time:start});await page.goto('./');await page.clock.pauseAt(new Date(start.getTime()+1000));await page.getByRole('button',{name:'Jogar agora'}).click();}
async function answer(page){const [a,op,b]=(await page.locator('#challenges').textContent()).split(' • ')[0].split(' ');return String(op==='+'?+a + +b:op==='-'?a-b:op==='×'?a*b:a/b);}
test('entrada: erro mantém e seleciona; botão e Enter corrigem e preservam foco',async({page})=>{
 await frozen(page);const input=page.getByLabel('Sua resposta',{exact:true});
 await input.fill('abc');await page.locator('#cast').click();await expect(input).toHaveValue('abc');await expect(input).toBeFocused();
 expect(await input.evaluate(e=>[e.selectionStart,e.selectionEnd])).toEqual([0,3]);await expect(input).toHaveAttribute('aria-invalid','true');await expect(page.getByRole('status')).toContainText('número inteiro');
 await input.fill('9999');await input.press('Enter');await expect(input).toHaveValue('9999');await expect(page.getByRole('status')).toContainText('Confira');
 await input.fill(await answer(page));await page.locator('#cast').click();await expect(input).toHaveValue('');await expect(input).toBeFocused();await expect(page.locator('#combo')).toHaveText('1');await expect(page.locator('#score')).toHaveText('10');
 await page.clock.runFor(5100);await input.fill(await answer(page));await input.press('Enter');await expect(page.locator('#combo')).toHaveText('2');
 await input.fill('');await input.press('Enter');await expect(page.locator('#combo')).toHaveText('2');await input.fill('9999');await input.press('Enter');await expect(page.locator('#combo')).toHaveText('0');await expect(page.locator('#best-combo')).toHaveText('2');
});
test('pausa explícita e aba oculta congelam a posição e restauram foco',async({page})=>{
 await frozen(page);await page.clock.runFor(3000);await page.keyboard.press('Escape');await expect(page.locator('#resume')).toBeFocused();
 const before=await page.locator('.enemy-label').getAttribute('style');await page.clock.runFor(20000);expect(await page.locator('.enemy-label').getAttribute('style')).toBe(before);await expect(page.locator('#lives')).toHaveText('3');
 await page.keyboard.press('Escape');await expect(page.locator('#answer')).toBeFocused();await page.clock.runFor(500);expect(await page.locator('.enemy-label').getAttribute('style')).not.toBe(before);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new window.Event('visibilitychange'));});
 const hidden=await page.locator('.enemy-label').getAttribute('style');await page.clock.runFor(20000);expect(await page.locator('.enemy-label').getAttribute('style')).toBe(hidden);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new window.Event('visibilitychange'));});await expect(page.locator('#answer')).toBeEnabled();await page.clock.runFor(100);await expect(page.locator('#lives')).toHaveText('3');
 await page.locator('#pause').click();await page.keyboard.press('p');await expect(page.locator('#answer')).toBeFocused();
});
for(const [width,height] of [[320,740],[390,844],[768,1024],[844,390]])test(`etiquetas legíveis e controles em ${width} × ${height}`,async({page})=>{
 await page.setViewportSize({width,height});await frozen(page);await page.clock.runFor(11000);
 const boxes=await page.locator('.enemy-label').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,font:parseFloat(window.getComputedStyle(n).fontSize)};}));
 expect(boxes.length).toBeGreaterThan(1);for(const b of boxes){expect(b.font).toBeGreaterThanOrEqual(16);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.w).toBeLessThanOrEqual(width);}
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)expect(boxes[i].x+boxes[i].w<=boxes[j].x || boxes[j].x+boxes[j].w<=boxes[i].x || boxes[i].y+boxes[i].h<=boxes[j].y || boxes[j].y+boxes[j].h<=boxes[i].y).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.locator('#answer').scrollIntoViewIfNeeded();await expect(page.locator('#cast')).toBeInViewport();
});
test('movimento reduzido, zoom equivalente de 200% e expressão acessível',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:640,height:480});await frozen(page);
 await expect(page.locator('#urgency')).toContainText('#1');await expect(page.locator('#answer')).toHaveAttribute('aria-describedby','cast-help feedback');
 // 640 × 480 CSS pixels corresponds to 1280 × 960 at browser zoom 200%.
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('redimensionar com relógio parado reposiciona as etiquetas sem cortes',async({page})=>{
 await frozen(page);await page.clock.runFor(7000);await page.setViewportSize({width:320,height:740});
 await expect.poll(()=>page.locator('.enemy-label').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.x>=0 && r.right<=window.innerWidth;}))).toBe(true);
});
