import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));
const entries=Object.entries(lock.packages).filter(([path])=>path).map(([path,pkg])=>({path,version:pkg.version,license:pkg.license || null,source:pkg.resolved || null}));
mkdirSync('reports',{recursive:true});writeFileSync('reports/licenses.json',JSON.stringify(entries,null,2)+'\n');
const missing=entries.filter(item=>!item.license);
if(missing.length)throw new Error(`Dependências sem declaração de licença: ${missing.map(i=>i.path).join(', ')}`);
console.log(`${entries.length} dependências com licença declarada; ver reports/licenses.json e SBOM`);
