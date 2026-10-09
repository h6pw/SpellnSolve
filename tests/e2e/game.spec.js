import { test, expect } from '@playwright/test';
function solve(expression) {
  const [a,op,b]=expression.trim().split(' ');const x=Number(a),y=Number(b);
  return op==='+'?x+y:op==='-'?x-y:op==='×'?x*y:x/y;
}
test('completa primeira onda, perde vidas, reinicia e mantém recorde', async ({page}) => {
  const errors=[];page.on('pageerror', error=>errors.push(error.message));
  const start = new Date('2026-10-09T12:00:00Z');
  await page.clock.install({time:start});await page.goto('./');await page.clock.pauseAt(new Date(start.getTime()+1000));
  await page.getByRole('button',{name:'Jogar agora'}).click();
  for(let i=0;i<5;i++){
    if(i) await page.clock.runFor(5100);
    const expression=(await page.locator('#challenges').textContent()).split(' • ')[0];
    await page.getByLabel('Sua resposta',{exact:true}).fill(String(solve(expression)));
    await page.getByLabel('Sua resposta',{exact:true}).press('Enter');
  }
  await expect(page.locator('#level')).toHaveText('2');await expect(page.locator('#score')).toHaveText('50');
  await page.clock.runFor(40000);await expect(page.getByRole('heading',{name:'Game Over'})).toBeVisible();
  await page.getByRole('button',{name:'Jogar novamente'}).click();await expect(page.locator('#lives')).toHaveText('3');await expect(page.locator('#score')).toHaveText('0');
  await page.reload();await expect(page.locator('#record')).toHaveText('50');expect(errors).toEqual([]);
});
test('mobile: dificuldade, entrada inválida e ausência de rolagem horizontal', async ({page}) => {
  await page.setViewportSize({width:390,height:844});await page.goto('./');
  await page.getByLabel('Seu desafio').selectOption('dificil');await expect(page.locator('#difficulty-help')).toContainText('divisão inteira');
  await page.getByRole('button',{name:'Jogar agora'}).click();await page.getByLabel('Sua resposta',{exact:true}).press('Enter');
  await expect(page.getByRole('status')).toContainText('Digite um número inteiro');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test('desktop: fundo contínuo e interface completa na altura da captura', async ({page}) => {
  await page.setViewportSize({width:1920,height:958});await page.goto('./');
  const layout=await page.evaluate(()=>({height:document.documentElement.scrollHeight,viewport:window.innerHeight,
    top:document.querySelector('main').getBoundingClientRect().top,bodyMargin:window.getComputedStyle(document.body).marginTop}));
  expect(layout.height).toBeLessThanOrEqual(layout.viewport);expect(layout.top).toBeLessThanOrEqual(12);expect(layout.bodyMargin).toBe('0px');
  await expect(page.getByRole('button',{name:'Jogar agora'})).toBeInViewport();
});
test('áudio inicia pelo clique, gera notas e mantém controles após reload', async ({page}) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    const Original=window.AudioContext;
    window.__sound={contexts:[],notes:0,gains:[]};
    window.AudioContext=class extends Original {
      constructor(...args){super(...args);window.__sound.contexts.push(this);}
      createGain(){const gain=super.createGain();window.__sound.gains.push(gain);return gain;}
      createOscillator(){const oscillator=super.createOscillator();const start=oscillator.start.bind(oscillator);oscillator.start=(...args)=>{window.__sound.notes++;return start(...args);};return oscillator;}
    };
  });
  await page.goto('./');expect(await page.evaluate(()=>window.__sound.contexts.length)).toBe(0);
  await page.getByRole('button',{name:'Jogar agora'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__sound.contexts[0]?.state)).toBe('running');
  await expect.poll(()=>page.evaluate(()=>window.__sound.notes)).toBeGreaterThan(0);
  await page.evaluate(()=>{
    window.__sound.analyser=window.__sound.contexts[0].createAnalyser();
    window.__sound.gains[0].connect(window.__sound.analyser);
  });
  await expect.poll(()=>page.evaluate(()=>{
    const samples=new Float32Array(128);window.__sound.analyser.getFloatTimeDomainData(samples);
    return Math.max(...samples.map(Math.abs));
  })).toBeGreaterThan(0.00001);
  await page.getByRole('button',{name:'Música ambiente',exact:true}).click();
  await page.getByRole('button',{name:'Efeitos sonoros',exact:true}).click();
  const volume = page.getByLabel('Volume',{exact:true});
  await volume.press('Home');
  for (let i=0; i<25; i++) await volume.press('ArrowRight');
  await page.reload();
  await expect(page.getByRole('button',{name:'Música ambiente',exact:true})).toHaveAttribute('aria-pressed','false');
  await expect(page.getByRole('button',{name:'Efeitos sonoros',exact:true})).toHaveAttribute('aria-pressed','false');
  await expect(page.getByLabel('Volume',{exact:true})).toHaveValue('25');expect(errors).toEqual([]);
});
