import { mkdirSync, writeFileSync } from 'node:fs';
import { api, paginate } from './github.mjs';
const days = Number(process.env.DORA_DAYS || 30);
const since = new Date(Date.now()-days*86400000).toISOString();
const runs = await paginate(`actions/workflows/esteira.yml/runs?created=%3E%3D${since}`, 'workflow_runs');
const deploys=[];
for(const run of runs) {
  const jobs=await paginate(`actions/runs/${run.id}/jobs`,'jobs');
  const job=jobs.find(item=>item.name==='deploy-prd');
  const artifacts=await paginate(`actions/runs/${run.id}/artifacts`,'artifacts');
  if(artifacts.some(a=>a.name==='production-promoted') && job?.completed_at && ['success','failure'].includes(job.conclusion)) {
    const commit=await api(`commits/${run.head_sha}`);
    deploys.push({run:run.id,sha:run.head_sha,conclusion:job.conclusion,completed:job.completed_at,
      leadHours:(new Date(job.completed_at)-new Date(commit.commit.committer.date))/3600000});
  }
}
const issues=(await paginate(`issues?state=all&labels=alerta&since=${since}`)).filter(item=>!item.pull_request);
const recovered=issues.filter(item=>item.closed_at && item.created_at>=since);
const success=deploys.filter(item=>item.conclusion==='success');
const failed=deploys.filter(item=>item.conclusion==='failure');
const rollbacks=await paginate(`actions/workflows/rollback.yml/runs?created=%3E%3D${since}`,'workflow_runs');
// Failed production jobs are not assumed to be deployments: count explicit rollback markers in logs.
const rolled=new Set();
for(const run of runs) {
  const artifacts=await paginate(`actions/runs/${run.id}/artifacts`,'artifacts');
  if(artifacts.some(a=>a.name==='rollback-executed'))rolled.add(run.id);
}
for(const run of rollbacks.filter(r=>r.conclusion==='success')){
  const candidate=deploys.filter(d=>d.completed<=run.created_at).sort((a,b)=>b.completed.localeCompare(a.completed))[0];
  if(candidate)rolled.add(candidate.run);
}
const mean = list => list.length ? list.reduce((a,b)=>a+b,0)/list.length : null;
const metrics={periodStart:since,periodDays:days,deploymentFrequencyPerDay:deploys.length/days,
  leadTimeHours:mean(success.map(d=>d.leadHours)),changeFailureRate:deploys.length?rolled.size/deploys.length:null,
  recoveryTimeHours:mean(recovered.map(i=>(new Date(i.closed_at)-new Date(i.created_at))/3600000)),
  baselineLeadTimeHours:264,productionJobFailures:failed.length,deploys,rollbackRunIds:[...rolled],
  caveat:'Sem dados = null. Deploy contado somente com artefato production-promoted. Taxa usa marcadores de rollback e rollback manual correlacionado ao último deploy. Validar a correlação no relatório; primeira instalação sem anterior não permite recuperação.'};
mkdirSync('status',{recursive:true});writeFileSync('status/dora.json',JSON.stringify(metrics,null,2)+'\n');
console.log('DORA calculado a partir das execuções reais do GitHub');
