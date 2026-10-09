const [url, expected] = process.argv.slice(2);
if (!url || !/^[a-f0-9]{40}$/.test(expected)) throw new Error('URL e SHA necessários');
let ready=false;
for(let attempt=0;attempt<24;attempt++) {
  try { const response=await fetch(new URL(`rollout.json?t=${Date.now()}`,url),{signal:AbortSignal.timeout(10000)});const pointer=await response.json();if(response.ok&&pointer.estavel===expected){ready=true;break;} }catch { /* Aguarda propagação. */ }
  await new Promise(done=>setTimeout(done,10000));
}
if(!ready)throw new Error('Ponteiro não propagou a versão esperada em quatro minutos');
