try {
  const rollout = await fetch('../rollout.json',{cache:'no-store'}).then(r=>r.json());
  document.getElementById('current').textContent = `Versão estável: ${rollout.estavel} | Canário: ${rollout.percentual}%`;
  const config = await fetch('./config.json').then(r=>r.json());
  const root = `https://raw.githubusercontent.com/${config.repository}/observabilidade/status/`;
  const [dora, probes] = await Promise.all([fetch(root+'dora.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(root+'sondas.csv',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.text();})]);
  document.getElementById('metrics').textContent = JSON.stringify(dora,null,2);
  const rows=probes.trim().split('\n').slice(1).map(row=>row.split(','));
  const availability=rows.length ? (rows.filter(row=>row[2]==='200').length/rows.length*100).toFixed(2) : 'sem dados';
  document.getElementById('probes').textContent = `Disponibilidade do período: ${availability}%\nÚltimas sondas (UTC, ambiente, HTTP, ms, versão):\n`+rows.slice(-12).map(row=>row.join(' | ')).join('\n');
} catch { document.getElementById('metrics').textContent='Sem evidências de monitoramento publicadas ainda.'; }
