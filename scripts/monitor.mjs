import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'node:fs';
import { api, paginate } from './github.mjs';
const site = process.env.SITE_URL;
if(!site) throw new Error('SITE_URL necessária');
mkdirSync('status',{recursive:true});
if(!existsSync('status/sondas.csv'))appendFileSync('status/sondas.csv','utc,ambiente,http,latencia_ms,versao\n');
let root=await fetch(new URL('rollout.json',site),{signal:AbortSignal.timeout(10000)}).then(r=>r.ok?r.json():null).catch(()=>null);
if(!/^[a-f0-9]{40}$/.test(root?.estavel))root=null;
const probes=[];
for(const [environment,url] of [['producao',root?.estavel?new URL(`releases/${root.estavel}/`,site):site],['homologacao',new URL('hml/',site)]]){
  const start=performance.now();let status,version='indisponivel';
  try {
    const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)});status=response.status;
    await response.arrayBuffer();
    const data=await fetch(new URL('version.json',url),{cache:'no-store',signal:AbortSignal.timeout(10000)});
    if(!data.ok)status=data.status;else { version=(await data.json()).commit;if(!/^[a-f0-9]{40}$/.test(version)){status=0;version='invalida';} }
  }catch{status=0;}
  if(environment==='producao' && root===null)status=0;
  const latency=Math.round(performance.now()-start);
  probes.push({environment,status,latency,version});
  appendFileSync('status/sondas.csv',`${new Date().toISOString()},${environment},${status},${latency},${version}\n`);
}
try { await api('labels/alerta'); } catch { await api('labels',{method:'POST',body:JSON.stringify({name:'alerta',color:'B3261E',description:'Sondas de produção e homologação'})}); }
const issues=await paginate('issues?state=open&labels=alerta');
for(const type of ['JogoForaDoAr','LatenciaAlta']){
  for(const probe of probes){
    const title=`[${type}] ${probe.environment}`;
    const bad=type==='JogoForaDoAr'?probe.status!==200:probe.latency>2000;
    const existing=issues.find(i=>i.title===title);
    if(bad&&!existing)await api('issues',{method:'POST',body:JSON.stringify({title,labels:['alerta'],body:`Sonda real em ${new Date().toISOString()}: HTTP ${probe.status}, ${probe.latency} ms, versão ${probe.version}. Run: ${process.env.GITHUB_RUN_ID}`})});
    if(!bad&&existing)await api(`issues/${existing.number}`,{method:'PATCH',body:JSON.stringify({state:'closed',state_reason:'completed'})});
  }
}
if(root===null) throw new Error('Ponteiro de produção indisponível; sondas e alertas de ambientes registrados');
// Valida CSV existente para evitar aceitar conteúdo externo inesperado.
if(!readFileSync('status/sondas.csv','utf8').startsWith('utc,ambiente,http,latencia_ms,versao'))throw new Error('CSV inválido');
