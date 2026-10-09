import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
mkdirSync('reports/screenshots',{recursive:true});
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1280,height:950}});
  const start=new Date('2026-10-09T12:00:00Z');
  await page.clock.install({time:start});
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:4173');
  await page.clock.pauseAt(new Date(start.getTime()+1000));
  await page.screenshot({path:'reports/screenshots/menu.png',fullPage:true});
  await page.getByRole('button',{name:'Jogar agora'}).click();
  await page.clock.runFor(7200);
  await page.screenshot({path:'reports/screenshots/game.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'reports/screenshots/mobile.png',fullPage:true});
  await page.clock.runFor(40000);
  await page.screenshot({path:'reports/screenshots/gameover.png',fullPage:true});
  console.log('Capturas reais em reports/screenshots/');
} finally { await browser.close(); }
