import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const folder='reports/refinement';mkdirSync(folder,{recursive:true});
const browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:1280,height:1000},recordVideo:{dir:folder,size:{width:1280,height:1000}}});
 const page=await context.newPage();
 await page.addInitScript(()=>{let seed=192;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};});
 const start=new Date('2026-10-16T12:00:00Z');await page.clock.install({time:start});await page.goto(process.env.BASE_URL||'http://127.0.0.1:4174');await page.clock.pauseAt(new Date(start.getTime()+1000));
 const shot=name=>page.screenshot({path:`${folder}/${name}.png`,fullPage:true});
 const solve=async()=>{const [a,op,b]=(await page.locator('#challenges').textContent()).split(' • ')[0].split(' ');await page.locator('#answer').fill(String(op==='+'?+a + +b:op==='-'?a-b:op==='×'?a*b:a/b));await page.locator('#answer').press('Enter');};
 await shot('menu');await page.locator('#play').click();await page.clock.runFor(7200);await shot('game');
 await solve();await page.clock.runFor(100);await shot('spell-100ms');await page.clock.runFor(200);await shot('spell-300ms');await page.clock.runFor(350);await shot('spell-650ms');
 await solve();await page.clock.runFor(5000);await solve();await page.clock.runFor(220);await shot('combo');
 await page.keyboard.press('Escape');await shot('pause');await page.keyboard.press('Escape');
 await page.clock.runFor(46000);await shot('gameover');
 await page.locator('#restart').click();await page.clock.runFor(10000);
 for(const width of [320,390,768]){await page.setViewportSize({width,height:width===768?1024:844});await shot(`mobile-${width}`);}
 await page.setViewportSize({width:844,height:390});await shot('landscape');
 await context.close();
 // Real wall-clock playback measures frame work, not the controlled clock above.
 const live=await browser.newPage({viewport:{width:1280,height:950},recordVideo:{dir:`${folder}/real-time`,size:{width:1280,height:950}}});
 await live.addInitScript(()=>{window.__frames=[];const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const before=performance.now();cb(t);window.__frames.push(performance.now()-before);});});
 await live.goto(process.env.BASE_URL||'http://127.0.0.1:4174');await live.locator('#play').click();
 await live.waitForTimeout(1000);const [a,op,b]=(await live.locator('#challenges').textContent()).split(' ');await live.locator('#answer').fill(String(op==='+'?+a + +b:a-b));await live.locator('#cast').click();
 const samples=[];for(let i=0;i<4;i++){await live.waitForTimeout(180);samples.push(await live.locator('canvas').screenshot());}
 await live.waitForTimeout(600);
 const frames=await live.evaluate(()=>window.__frames);frames.sort((a,b)=>a-b);
 const metrics={frames:frames.length,medianMs:frames[Math.floor(frames.length*.5)],p95Ms:frames[Math.floor(frames.length*.95)],differentSpellFrames:samples.slice(1).every((s,i)=>!s.equals(samples[i]))};
 writeFileSync(`${folder}/performance.json`,JSON.stringify(metrics,null,2));console.log(metrics);
 const video=live.video();await live.close();await video.saveAs(`${folder}/spell-real-time.webm`);
 console.log(`Capturas e vídeo reais em ${folder}/`);
} finally {await browser.close();}
