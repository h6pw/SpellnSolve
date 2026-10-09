const [url, expected] = process.argv.slice(2);
if (!url || !/^[a-f0-9]{40}$/.test(expected)) throw new Error('URL e SHA necessários');
let found = false;
for (let attempt=0; attempt<24; attempt++) {
  try { const response=await fetch(new URL(`version.json?t=${Date.now()}`,url), { signal: AbortSignal.timeout(10000) }); const v=await response.json(); if(response.ok && v.commit === expected){ found=true;break; } } catch { /* Aguarda a propagação do Pages. */ }
  await new Promise(done=>setTimeout(done,10000));
}
if (!found) throw new Error('Pages não propagou a versão esperada em quatro minutos');
